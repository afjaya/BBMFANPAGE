import os
import json
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
GEMINI_API_KEY = os.getenv("VITE_GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("⚠️ GEMINI_API_KEY / VITE_GEMINI_API_KEY missing in .env!")

client = genai.Client(api_key=GEMINI_API_KEY)

# Software Animation Hub Targets
SOFTWARES = [
    "opentoonz-tahoma",
    "moho",
    "blender",
    "adobe-animate",
    "toonboom"
]

# ---------------------------------------------------------------------------
# 3. FUNCTION: GENERATE & FEED TUTORIALS (FULL ENGLISH)
# ---------------------------------------------------------------------------
def feed_tutorials():
    print("\n📚 [TUTORIAL FEEDER] Generating Production Tutorials in ENGLISH...")
    
    for sw in SOFTWARES:
        prompt = f"""
        Write 1 comprehensive, step-by-step production tutorial for software '{sw}'.
        
        CRITICAL: Everything MUST be strictly in ENGLISH.
        
        Return ONLY valid JSON (no markdown wrappers):
        {{
            "title": "Actionable English Tutorial Title (e.g., Mastering Smart Bone Dials for Head Turns)",
            "softwareId": "{sw}",
            "level": "INTERMEDIATE",
            "readTime": "6 MIN READ",
            "category": "Rigging & Controls",
            "description": "Short overview paragraph in English detailing what animators will learn.",
            "points": [
                "Step 1: English action point for setting up keyframes",
                "Step 2: English action point for bone constraint setup",
                "Step 3: English action point for testing interpolation"
            ],
            "url": "https://cgchannel.com"
        }}
        """

        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(response_mime_type="application/json")
            )
            data = json.loads(response.text)
            data["createdAt"] = firestore.SERVER_TIMESTAMP

            # Save to Firestore 'tutorials' collection
            db.collection("tutorials").add(data)
            print(f"  ✅ [SUCCESS] Added Tutorial for '{sw}': {data['title']}")

        except Exception as e:
            print(f"  ❌ [ERROR] Failed to add tutorial for '{sw}': {e}")
            
        # Jeda 12 detik agar tidak melampaui quota rate limit Gemini Free Tier
        time.sleep(12)

# ---------------------------------------------------------------------------
# 4. FUNCTION: GENERATE & FEED INDUSTRY NEWS (FULL ENGLISH)
# ---------------------------------------------------------------------------
def feed_news():
    print("\n📰 [NEWS FEEDER] Generating Global Animation News in ENGLISH...")
    
    prompt = """
    Write 1 breaking animation industry or AI-assisted 2D/3D technology news article in ENGLISH.
    
    Return ONLY valid JSON (no markdown wrappers):
    {
        "title": "Compelling English News Headline",
        "category": "Industry News",
        "description": "2-sentence summary in English.",
        "content": "Full 3-paragraph news breakdown in English detailing pipeline impact, studio trends, or software releases.",
        "source_url": "https://cgchannel.com"
    }
    """

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(response_mime_type="application/json")
        )
        data = json.loads(response.text)
        data["createdAt"] = firestore.SERVER_TIMESTAMP

        # Save to Firestore 'news' collection
        db.collection("news").add(data)
        print(f"  ✅ [SUCCESS] Added Global News: {data['title']}")

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