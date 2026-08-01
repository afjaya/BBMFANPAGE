import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Sesuaikan dengan jalur file firebase.ts kamu
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { Newspaper, Calendar, ArrowRight, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";

export default function HeroNewsDashboard() {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // 1. Tarik Data Berita Realtime dari Firestore
  useEffect(() => {
    const q = query(collection(db, "news"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNewsList(data);
      setLoading(false);
    }, (error) => {
      console.error("Gagal memuat berita di Hero:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handler Navigasi Slider Tengah
  const nextSlide = () => {
    if (newsList.length > 0) {
      setActiveIndex((prev) => (prev + 1) % newsList.length);
    }
  };

  const prevSlide = () => {
    if (newsList.length > 0) {
      setActiveIndex((prev) => (prev - 1 + newsList.length) % newsList.length);
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-zinc-950 border border-white/10 p-12 text-center font-mono">
        <p className="text-xs text-[#FFD700] animate-pulse">MEMUAT LOG BERITA TERBARU CLOUD SECTOR...</p>
      </div>
    );
  }

  // Jika belum ada berita di database
  if (newsList.length === 0) {
    return (
      <div className="w-full bg-zinc-950 border border-white/10 p-12 text-center font-mono">
        <p className="text-xs text-zinc-500">BELUM ADA BERITA YANG DI-PUBLISH HARI INI.</p>
      </div>
    );
  }

  const featuredNews = newsList[activeIndex];

  return (
    <div className="w-full bg-zinc-950 border border-white/10 font-mono text-white mb-8">
      
      {/* HEADER MINI SUB-NAVBAR HERO */}
      <div className="flex items-center justify-between bg-zinc-900/60 border-b border-white/10 px-4 py-2 text-[10px] tracking-wider text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-bold text-zinc-300">LIVE NEWS INJECTOR V.2</span>
        </div>
        <div className="uppercase">
          Total Data Rilis: <span className="text-[#FFD700] font-bold">{newsList.length} LOGS</span>
        </div>
      </div>

      {/* GRID UTAMA RESPOFNSIF */}
      <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
        
        {/* =========================================================
            1. BAGIAN UTAMA / TENGAH (SLIDER BERITA FEATURED)
           ========================================================= */}
        <div className="lg:col-span-2 p-5 flex flex-col justify-between relative group min-h-[360px] lg:min-h-[400px]">
          
          {/* Konten Berita Terpilih */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-[9px] px-2 py-0.5 rounded font-black tracking-widest uppercase ${
                featuredNews.tag === "Event" ? "bg-purple-950 text-purple-400 border border-purple-800" :
                featuredNews.tag === "Update" ? "bg-blue-950 text-blue-400 border border-blue-800" :
                "bg-amber-950 text-[#FFD700] border border-[#FFD700]/40"
              }`}>
                {featuredNews.tag || "PENGUMUMAN"}
              </span>
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                <Calendar className="h-3 w-3" />
                {featuredNews.createdAt ? new Date(featuredNews.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' }) : "Baru Saja"}
              </div>
            </div>

            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white uppercase border-b border-white/5 pb-3 leading-snug">
              {featuredNews.title}
            </h1>

            {/* Cuplikan Isi Berita */}
            <p className="text-zinc-400 text-xs leading-relaxed mt-4 whitespace-pre-wrap max-w-2xl line-clamp-6">
              {featuredNews.content}
            </p>
          </div>

          {/* Bagian Bawah Slider: Kontrol Navigasi Manual */}
          <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-6">
            <a 
              href={`/news/${featuredNews.id}`} 
              className="inline-flex items-center gap-2 text-xs font-bold text-[#FFD700] hover:text-white group/btn transition-colors"
            >
              BACA SELENGKAPNYA <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </a>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-zinc-500 mr-2">{activeIndex + 1} / {newsList.length}</span>
              <button 
                onClick={prevSlide} 
                className="p-1.5 bg-zinc-900 border border-white/10 hover:border-[#FFD700] hover:text-[#FFD700] transition-all cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button 
                onClick={nextSlide} 
                className="p-1.5 bg-zinc-900 border border-white/10 hover:border-[#FFD700] hover:text-[#FFD700] transition-all cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================
            2. BAGIAN SAMPING KANAN (DAFTAR SIDEBAR FEED LIST)
           ========================================================= */}
        <div className="p-4 bg-zinc-950/40 flex flex-col max-h-[400px]">
          <div className="text-[10px] font-black tracking-widest text-zinc-400 uppercase mb-3 flex items-center gap-2">
            <Newspaper className="h-3.5 w-3.5 text-[#FFD700]" /> LOG INDEKS BERITA
          </div>

          {/* List Scrollable Samping */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {newsList.map((item, index) => {
              const isSelected = index === activeIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveIndex(index)}
                  className={`w-full text-left p-2.5 border transition-all flex flex-col gap-1 rounded-none cursor-pointer ${
                    isSelected 
                      ? "bg-zinc-900 border-[#FFD700] shadow-[3px_3px_0px_0px_rgba(255,215,0,0.1)]" 
                      : "bg-zinc-950/20 border-white/5 hover:border-white/20 hover:bg-zinc-900/40"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      item.tag === "Event" ? "text-purple-400 bg-purple-950/40" :
                      item.tag === "Update" ? "text-blue-400 bg-blue-950/40" :
                      "text-[#FFD700] bg-amber-950/40"
                    }`}>
                      {item.tag || "Info"}
                    </span>
                    <span className="text-[9px] text-zinc-600">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' }) : ""}
                    </span>
                  </div>
                  <h4 className={`text-xs uppercase font-bold truncate tracking-tight w-full ${
                    isSelected ? "text-[#FFD700]" : "text-zinc-300"
                  }`}>
                    {item.title}
                  </h4>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}