import os
import json
import re
import time
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore
from google import genai
from google.genai import types

# Load Environment Variables
load_dotenv()

# ---------------------------------------------------------------------------
# 1. INITIALIZE FIREBASE ADMIN SDK
# ---------------------------------------------------------------------------
if not firebase_admin._apps:
    if os.path.exists("firebase-key.json"):
        cred = credentials.Certificate("firebase-key.json")
    else:
        key_json = os.environ.get("FIREBASE_KEY_JSON", "")
        cred = credentials.Certificate(json.loads(key_json))
    firebase_admin.initialize_app(cred)

db = firestore.client()

# ---------------------------------------------------------------------------
# 2. INITIALIZE GEMINI API CLIENT
# ---------------------------------------------------------------------------
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("VITE_GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("⚠️ GEMINI_API_KEY missing in environment variables!")

client = genai.Client(api_key=GEMINI_API_KEY)

# Target Software Animation
SOFTWARES = [
    "opentoonz-tahoma",
    "moho",
    "blender",
    "adobe-animate",
    "toonboom"
]

# ---------------------------------------------------------------------------
# HELPER: CLEAN & PARSE JSON FROM GEMINI TEXT
# ---------------------------------------------------------------------------
def parse_gemini_json(raw_text: str) -> dict:
    """Membersihkan wrapper Markdown ```json dari output Gemini lalu parse ke JSON object"""
    cleaned_text = re.sub(r"```json\s*|\s*```", "", raw_text).strip()
    return json.loads(cleaned_text)

# ---------------------------------------------------------------------------
# 3. FUNCTION: GENERATE & FEED TUTORIALS (SEARCH GROUNDING + FULL ENGLISH)
# ---------------------------------------------------------------------------
def feed_tutorials():
    print("\n📚 [TUTORIAL FEEDER] Searching & Generating Real Tutorials in ENGLISH...")

    for sw in SOFTWARES:
        prompt = f"""
        Search the internet for real, high-quality, and recent production techniques for '{sw}'.
        Based on real software documentation or industry workflows, write 1 detailed written tutorial.

        CRITICAL INSTRUCTIONS:
        1. Everything MUST be strictly in ENGLISH.
        2. DO NOT repeat the summary/excerpt in the content body.
        3. The 'content' field must be a rich 400-600 word step-by-step tutorial (Prerequisites, Step 1, Step 2, Pro Tips).
        4. Output ONLY the raw JSON object. Do NOT wrap it in any conversational text.

        Return JSON matching this exact schema:
        {{
            "title": "Clear Actionable Title (e.g. Advanced Rigging: Smart Bones Setup in Moho)",
            "softwareId": "{sw}",
            "category": "Rigging & Controls",
            "excerpt": "A brief 2-sentence summary of what animators will accomplish.",
            "content": "Step-by-step tutorial breakdown containing detailed instructions, shortcuts, and keyframe setups.",
            "source_url": "[https://cgchannel.com](https://cgchannel.com)"
        }}
        """

        try:
            # Catatan: response_mime_type Sengaja Dihapus agar Google Search Grounding Berjalan Lancar
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    tools=[{"google_search": {}}],
                    temperature=0.3
                )
            )
            
            # Parsing aman dari text response
            data = parse_gemini_json(response.text)
            
            # Memastikan sinkronisasi field 'description' untuk kompatibilitas UI
            if "excerpt" in data and "description" not in data:
                data["description"] = data["excerpt"]

            data["createdAt"] = firestore.SERVER_TIMESTAMP

            # Simpan ke Firestore koleksi 'tutorials'
            db.collection("tutorials").add(data)
            print(f"  ✅ [SUCCESS] Added Grounded Tutorial for '{sw}': {data.get('title')}")

        except Exception as e:
            print(f"  ❌ [ERROR] Failed to add tutorial for '{sw}': {e}")

        # Jeda 12 detik demi menjaga Rate Limit Gemini Free Tier (5 Req/min)
        time.sleep(12)

# ---------------------------------------------------------------------------
# 4. FUNCTION: GENERATE & FEED INDUSTRY NEWS (FULL ENGLISH)
# ---------------------------------------------------------------------------
def feed_news():
    print("\n📰 [NEWS FEEDER] Searching Global Animation Industry News in ENGLISH...")

    prompt = """
    Search the internet for breaking news, major updates, or tech releases in 2D/3D animation & AI animation technology.
    
    CRITICAL INSTRUCTIONS:
    1. Everything MUST be strictly in ENGLISH.
    2. Write a professional industry news breakdown.
    3. Output ONLY the raw JSON object. Do NOT wrap it in any conversational text.

    Return JSON matching this exact schema:
    {
        "title": "Compelling English News Headline",
        "category": "Industry News",
        "excerpt": "A concise 2-sentence executive summary.",
        "content": "Full 3 to 4 paragraph breakdown detailing pipeline impact, studio trends, or release notes.",
        "source_url": "The actual URL or main portal domain reference"
    }
    """

    try:
        # Catatan: response_mime_type Sengaja Dihapus agar Google Search Grounding Berjalan Lancar
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                tools=[{"google_search": {}}],
                temperature=0.3
            )
        )
        
        # Parsing aman dari text response
        data = parse_gemini_json(response.text)
        
        if "excerpt" in data and "description" not in data:
            data["description"] = data["excerpt"]

        data["createdAt"] = firestore.SERVER_TIMESTAMP

        # Simpan ke Firestore koleksi 'news'
        db.collection("news").add(data)
        print(f"  ✅ [SUCCESS] Added Global News: {data.get('title')}")

    except Exception as e:
        print(f"  ❌ [ERROR] Failed to add news: {e}")

# ---------------------------------------------------------------------------
# MAIN EXECUTION
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    print("🚀 === STARTING BANG BRO ANIMATION AUTOFEEDER (ENGLISH EDITION) ===")

    feed_tutorials()
    feed_news()

    print("\n✨ === ALL FEEDING PROCESSES COMPLETED SUCCESSFULLY! ===")