import os
import sys
import json
import re
import time
from dotenv import load_dotenv

# Load Environment Variables
load_dotenv()

try:
    import feedparser
except ImportError:
    print("Missing dependency: feedparser. Install with: pip install feedparser")
    sys.exit(1)

import firebase_admin
from firebase_admin import credentials, firestore
from google import genai
from google.cloud.firestore_v1.base_query import FieldFilter

# ---------------------------------------------------------------------------
# 1. INITIALIZE FIREBASE ADMIN SDK (POLA SAMA DENGAN ANIMATION_FEEDER.PY)
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

# ---------------------------------------------------------------------------
# 3. RSS FEEDS CONFIGURATION
# ---------------------------------------------------------------------------
RSS_FEEDS = [
    "[https://techcrunch.com/category/artificial-intelligence/feed/](https://techcrunch.com/category/artificial-intelligence/feed/)",
    "[https://news.ycombinator.com/rss](https://news.ycombinator.com/rss)",
    "[https://theverge.com/rss/ai-artificial-intelligence/index.xml](https://theverge.com/rss/ai-artificial-intelligence/index.xml)"
]

# ---------------------------------------------------------------------------
# HELPER: CLEAN & PARSE JSON FROM GEMINI TEXT
# ---------------------------------------------------------------------------
def parse_gemini_json(raw_text: str) -> dict:
    """Membersihkan wrapper Markdown ```json dari output Gemini lalu parse ke JSON object"""
    cleaned_text = re.sub(r"```json\s*|\s*```", "", raw_text).strip()
    return json.loads(cleaned_text)

# ---------------------------------------------------------------------------
# 4. FUNCTION: FETCH & PUBLISH AI NEWS
# ---------------------------------------------------------------------------
def fetch_and_publish():
    print("\n🤖 === STARTING AUTOFEEDER AI NEWS (ENGLISH EDITION) ===")
    
    total_processed = 0
    max_per_run = 5  # Batasi maksimal 5 berita per sekali eksekusi

    for feed_url in RSS_FEEDS:
        if total_processed >= max_per_run:
            print(f"\n🛑 Sudah mencapai kuota aman ({max_per_run} berita). Selesai!")
            break

        print(f"\n📡 Memindai Feed: {feed_url}")
        feed = feedparser.parse(feed_url)
        
        for entry in feed.entries[:2]:
            if total_processed >= max_per_run:
                break

            title = entry.title
            link = entry.link
            raw_summary = entry.get('summary', '')

            # Cek apakah berita sudah ada di Firestore
            news_ref = db.collection('news')
            existing = news_ref.where(filter=FieldFilter('source_url', '==', link)).limit(1).get()
            if len(existing) > 0:
                print(f"  ⏩ Berita sudah ada: {title}")
                continue

            print(f"  ⚡ [{total_processed + 1}/{max_per_run}] Memproses: {title}")

            prompt = f"""
            You are the Chief Editor of 'BangBroMedia', an authority tech and AI news platform.
            Rewrite and synthesize the raw news below into a professional, engaging tech article IN ENGLISH.

            Original Title: {title}
            Original Summary: {raw_summary}

            CRITICAL INSTRUCTIONS:
            1. Everything MUST be strictly in ENGLISH.
            2. Output ONLY the raw JSON object matching the exact schema. Do NOT wrap it in conversational text.

            Return JSON structure:
            {{
                "title": "Engaging Headline in English",
                "description": "Comprehensive article body with at least 3-4 paragraphs in English.",
                "excerpt": "Concise 1-2 sentence preview summary",
                "category": "Select one: AI Breakthroughs / Big Tech / Developer Tools / Quantum",
                "tags": ["tag1", "tag2"]
            }}
            """

            try:
                response = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt
                )
                
                # Clean dan parse JSON aman
                article = parse_gemini_json(response.text)
                
                # Simpan ke Firestore
                news_ref.add({
                    'title': article.get('title', title),
                    'description': article.get('description', ''),
                    'excerpt': article.get('excerpt', ''),
                    'category': article.get('category', 'AI Breakthroughs'),
                    'tags': article.get('tags', []),
                    'source_url': link,
                    'createdAt': firestore.SERVER_TIMESTAMP
                })

                total_processed += 1
                print(f"  ✅ Berhasil Terbit: {article.get('title')}")
                print("  ⏳ Jeda 12 detik agar API menjaga Rate Limit...")
                time.sleep(12)

            except Exception as e:
                print(f"  ❌ Gagal memproses berita '{title}': {e}")
                # Jika kena rate limit, beri waktu istirahat ekstra
                if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
                    print("  ⚠️ Hit Rate Limit 429. Menunggu 20 detik...")
                    time.sleep(20)

# ---------------------------------------------------------------------------
# MAIN EXECUTION
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    fetch_and_publish()
    print("\n✨ === PROCESS COMPLETED SUCCESSFULLY! ===")