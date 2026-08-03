import os
import sys
import json
import time

try:
    import feedparser
except ImportError:
    print("Missing dependency: feedparser. Install with: pip install feedparser")
    sys.exit(1)

import firebase_admin
from firebase_admin import credentials, firestore
from google import genai
from google.cloud.firestore_v1.base_query import FieldFilter

# 1. Inisialisasi Firebase Firestore
cred = credentials.Certificate("firebase-key.json")
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)
db = firestore.client()

# 2. Inisialisasi SDK Gemini Terbaru (google-genai)
# ✅ Membaca dari Environment Variable (Aman dari deteksi GitHub)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("VITE_GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("⚠️ GEMINI_API_KEY missing in environment variables!")

client = genai.Client(api_key=GEMINI_API_KEY)


# 3. Sumber RSS Feed Berita AI Global
RSS_FEEDS = [
    "https://techcrunch.com/category/artificial-intelligence/feed/",
    "https://news.ycombinator.com/rss",
    "https://theverge.com/rss/ai-artificial-intelligence/index.xml"
]

def generate_article(prompt, retries=3):
    """Memanggil model Gemini dengan penanganan Rate Limit"""
    # Model gemini-2.5-flash adalah model resmi terbaru yang aktif di SDK ini
    model_name = "gemini-2.5-flash"
    
    for attempt in range(retries):
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config={'response_mime_type': 'application/json'}
            )
            return response.text
        except Exception as e:
            err_msg = str(e)
            if "429" in err_msg or "RESOURCE_EXHAUSTED" in err_msg:
                wait_time = (attempt + 1) * 20
                print(f"⚠️ Kuota penuh. Istirahat {wait_time} detik (Percobaan {attempt+1}/{retries})...")
                time.sleep(wait_time)
            else:
                raise e
    raise Exception("Gagal memproses artikel setelah beberapa kali percobaan.")

def fetch_and_publish():
    print("🤖 Memulai Autopilot Feeder (Anti-Limit Version)...")
    
    total_processed = 0
    max_per_run = 5  # Batasi maksimal 5 berita per sekali eksekusi

    for feed_url in RSS_FEEDS:
        if total_processed >= max_per_run:
            print(f"\n🛑 Sudah mencapai kuota aman ({max_per_run} berita). Selesai!")
            break

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
                print(f"⏩ Berita sudah ada: {title}")
                continue

            print(f"\n⚡ [{total_processed + 1}/{max_per_run}] Memproses: {title}")

            prompt = f"""
            You are the Chief Editor of 'BangBroMedia', an authority tech and AI news platform.
            Rewrite and synthesize the raw news below into a professional, engaging tech article IN ENGLISH.

            Original Title: {title}
            Original Summary: {raw_summary}

            Return ONLY valid JSON with structure:
            {{
                "title": "Engaging Headline in English",
                "description": "Comprehensive article body with at least 3-4 paragraphs in English.",
                "excerpt": "Concise 1-2 sentence preview summary",
                "category": "Select one: AI Breakthroughs / Big Tech / Developer Tools / Quantum",
                "tags": ["tag1", "tag2"]
            }}
            """

            try:
                raw_json = generate_article(prompt)
                article = json.loads(raw_json)
                
                # Simpan ke Firestore
                news_ref.add({
                    'title': article['title'],
                    'description': article['description'],
                    'excerpt': article['excerpt'],
                    'category': article['category'],
                    'tags': article.get('tags', []),
                    'source_url': link,
                    'createdAt': firestore.SERVER_TIMESTAMP
                })

                total_processed += 1
                print(f"✅ Berhasil Terbit: {article['title']}")
                print("⏳ Jeda 15 detik agar API tidak kena limit...")
                time.sleep(15)

            except Exception as e:
                print(f"❌ Gagal memproses berita: {e}")

if __name__ == "__main__":
    fetch_and_publish()