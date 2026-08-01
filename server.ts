import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Support JSON request processing
  app.use(express.json());

  // Safe initialize Google Gemini Client
  let ai: GoogleGenAI | null = null;
  const apiKey = process.env.VITE_GEMINI_API_KEY;
  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    try {
      ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
      console.log("Gemini API configured successfully.");
    } catch (err) {
      console.error("Failed to initialize Gemini SDK:", err);
    }
  } else {
    console.log("Gemini API Key missing or default. Simulated replies active.");
  }

  // API endpoint for interactive tutorial support chat (bilingual / Indonesian)
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages payload is required as an array." });
      }

      // If AI isn't configured, provide interactive expert simulated answers based on keywords
      if (!ai) {
        const lastUserMsg = messages[messages.length - 1]?.content || "";
        const query = lastUserMsg.toLowerCase();
        let fallbackReply = "Halo! Saya Bang Bro AI Support. Selamat datang di portal belajar Opentoonz! Saat ini modul AI sedang berjalan dalam mode lokal gratis. Ada hal spesifik tentang rigging, efek FX, atau render yang ingin ditanyakan?";

        if (query.includes("rig") || query.includes("tulang") || query.includes("skeleton") || query.includes("mesh")) {
          fallbackReply = "Sobat Animasi, untuk **Rigging** di Opentoonz:\n\n1. Pilih gambar/level karakter Anda.\n2. Aktifkan **Plastic Tool** (ikon jaring hijau di toolbar Barat).\n3. Klik **Create Mesh** di menu bar atas, tentukan densitas jaring.\n4. Ganti mode ke **Build Skeleton** untuk menyusun tulang baru dengan klik kiri dari titik pangkal (misal: bahu ke siku lalu pergelangan tangan).\n5. Pindah ke mode **Animate** untuk menggerakkan sendi rigging tersebut! Menarik sekali kan?";
        } else if (query.includes("render") || query.includes("ekspor") || query.includes("video") || query.includes("ffmpeg") || query.includes("mp4")) {
          fallbackReply = "Untuk **Rendering** video di Opentoonz, Anda mesti memasang ekstensi FFmpeg:\n\n1. Unduh FFmpeg gratis dan tempatkan foldernya di komputer.\n2. Di Opentoonz, buka **File > Preferences > Import/Export** lalu arahkan path menuju lokasi folder bin FFmpeg.\n3. Setelah itu, buka **Render > Output Settings (Ctrl+O)**.\n4. Atur format file ke `.mp4` (atau `.gif` untuk animasi pendek).\n5. Tentukan start-end frame, lalu klik tombol **Render** di bagian bawah! Video Anda akan siap di folder master project.";
        } else if (query.includes("fx") || query.includes("efek") || query.includes("glow") || query.includes("blur") || query.includes("schematic")) {
          fallbackReply = "Wah, bermain dengan **FX Schematic** sangat menyenangkan! Di Opentoonz:\n\n1. Di sudut kanan jendela kerja, pastikan Anda membuka tab **Schematic** dan tombol di pojok bawahnya aktif 'FX'.\n2. Klik kanan di papan node, lalu pilih **Insert FX**.\n3. Cari efek favorit seperti **Blur/Glow**, **Radial Gradient**, atau **Color Key**.\n4. Sambungkan port lingkaran level gambar aslinya ke port input efek, lalu port efek disambung kembali ke terminal *XSheet* utama agar perubahannya terlihat di preview render!";
        } else if (query.includes("basic") || query.includes("pemula") || query.includes("toonz vector") || query.includes("raster")) {
          fallbackReply = "Untuk para pemula, kunci utama OpenToonz adalah memahami tipe level:\n\n* **Toonz Vector Level** (ikon warna merah): Sangat cocok untuk menggambar line-art rapi karena garisnya berbasis matematika vektor, bisa di-resize tanpa pecah, dan warna bisa diganti instan.\n* **Toonz Raster Level** (ikon warna biru): Memungkinkan brush bertekstur arang/cat minyak, sangat ekspresif tapi ukurannya pixel tetap.\n* Gunakan shortcut dasar seperti **X** untuk brush, **B** untuk bucket warna, dan **C** untuk select tool!";
        } else if (query.includes("resource") || query.includes("bahan") || query.includes("karakter") || query.includes("download")) {
          fallbackReply = "Semua bahan rigging gratis, asset karakter `.tnz`, dan file latihan bisa langsung Anda akses secara cuma-cuma di menu **Free Resource** di bagian atas halaman web ini! Klik dan raih file zip latihannya.";
        } else if (query.includes("about") || query.includes("pembuat") || query.includes("bang bro") || query.includes("siapa")) {
          fallbackReply = "Bang Bro Media adalah hub komunitas kreator animasi yang berdedikasi membuat tutorial OpenToonz berkualitas dalam bahasa Indonesia! Kami ingin memudahkan anak muda Indonesia belajar animasi kelas dunia secara gratis.";
        } else if (query.includes("hai") || query.includes("halo") || query.includes("pagi") || query.includes("siang") || query.includes("sore") || query.includes("malam")) {
          fallbackReply = "Halo Sobat Animasi! Selamat datang di Bang Bro Media Support. Ada tutorial atau fitur OpenToonz apa yang ingin kita bahas bersama hari ini? 😊";
        }

        await new Promise((resolve) => setTimeout(resolve, 800));
        return res.json({ text: fallbackReply });
      }

      // Map to Gemini instructions contents shape
      const contents = messages.map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content || "" }],
      }));

      const systemInstruction =
        "Anda adalah 'Bang Bro AI Support', asisten tutorial interaktif untuk portal fans 'Bang Bro Media Fanpage'. " +
        "Situs ini menyediakan tutorial lengkap tentang perangkat lunak animasi 2D OpenToonz. " +
        "Gaya bahasa Anda harus ramah, komunikatif, bersahabat, energetik, dan menggunakan bahasa Indonesia yang santai khas kreator tutorial animasi (misal dengan menggunakan kata 'Sobat Animasi', 'Bro', 'Guys', atau 'Kawan-kawan'). " +
        "Bantu pengguna menjawab pertanyaan mereka tentang teori atau praktik animasi di OpenToonz seperti:\n" +
        "1. Opentoonz Basic (perbedaan Vector dan Raster level, tools gambar).\n" +
        "2. Rigging (menggunakan Plastic Tool, mendesain Mesh pelindung, menggambar skelet/tulang, menganimasi sendi).\n" +
        "3. Animating (mengatur keyframe di XSheet, kurva animasi di Function Editor).\n" +
        "4. FX (Schematic window, menyambungkan node, efek Glow, Blur, Matte, Masking).\n" +
        "5. Rendering (Konfigurasi FFmpeg, mengarahkan Preferences, ekspor MP4 dan serial PNG).\n" +
        "Tuliskan jawaban yang memiliki rincian langkah demi langkah (list atau bullet-points) agar sangat mudah dipahami. " +
        "Apabila pengguna melenceng atau menanyakan topik di luar animasi 2D, kembalikan topik secara fleksibel ke asyiknya membuat animasi di OpenToonz.";

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Call failed:", error);
      return res.status(500).json({ error: error.message || "Something went wrong during tutorial search." });
    }
  });

  // Serve static assets in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started and listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
