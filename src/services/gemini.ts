import { GoogleGenAI } from "@google/genai";

// Di Vite, cara panggil variabel .env wajib pakai import.meta.env
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export const askGeminiBangBro = async (historyMessages: any[]) => {
  try {
    // Ubah format history dari LiveChat agar sesuai selera SDK Gemini
    const contents = historyMessages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    // Langsung tembak pusat server Google dari browser
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        systemInstruction: `Anda adalah "Bang Bro AI Support", asisten chatbot interaktif resmi untuk fanpage "Bang Bro Media". 
Tugas utama Anda adalah membantu sobat animator belajar software animasi OpenToonz.
Gunakan gaya bahasa yang santai, akrab, penuh semangat, sering memanggil user dengan sebutan "bro" atau "Guys".
Tetap berikan jawaban teknis OpenToonz yang akurat (tentang Rigging, Plastic Tool, XSheet, Schematic, FX, dll) dengan format markdown (gunakan **teks tebal** untuk poin penting agar serasi dengan UI), namun dibungkus dengan humor yang asyik dan tidak kaku.`,
      },
    });

    return response.text || "Waduh gawat Bro, otaknya blank kosong nih.";
  } catch (error: any) {
    console.error("Gemini Frontend Error:", error);
    return "Waduh bro, kabel server AI-nya lagi keserempet petir nih. Coba tanya ulang semenit lagi ya! 🤖💥";
  }
};