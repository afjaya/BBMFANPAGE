// src/components/AboutSection.tsx
import { Flame, Video, Heart, Youtube, Globe, GraduationCap } from "lucide-react";
import logo from "../logo.png";
import { useLanguage } from "../data/LanguageContext"; // <--- Mengambil logic bahasa dari context

export default function AboutSection() {
  const { t } = useLanguage(); // <--- Fungsi sakti untuk memanggil teks sesuai bahasa browser

  // Array values kita bungkus di dalam komponen agar fungsi t() bisa terbaca secara dinamis
  const values = [
    {
      title: t("valTitleFree"),
      desc: t("valDescFree"),
      icon: GraduationCap,
    },
    {
      title: t("valTitleComm"),
      desc: t("valDescComm"),
      icon: Globe,
    },
    {
      title: t("valTitleStruct"),
      desc: t("valDescStruct"),
      icon: Video,
    },
  ];

  return (
    <div className="space-y-12">
      {/* Visual Header */}
      <div className="relative text-center max-w-3xl mx-auto space-y-4 py-6">
        <div className="mx-auto w-12 h-12 bg-[#FFD700]/10 border border-[#FFD700]/20 text-[#FFD700] flex items-center justify-center rounded-none">
          <Flame className="h-6 w-6 animate-pulse" />
        </div>
        <h2 className="text-4xl md:text-5xl font-serif font-black text-white tracking-tight leading-none uppercase">
          {t("aboutHeaderTitle1")} <br />
          <span className="text-[#FF0000]">{t("aboutHeaderTitle2")}</span>
        </h2>
        <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-sans max-w-2xl mx-auto pb-4 border-b border-white/5">
          {t("aboutHeaderDesc")}
        </p>
      </div>

      {/* Grid of core values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {values.map((v, idx) => {
          const Icon = v.icon;
          return (
            <div key={idx} className="bg-zinc-900 border border-white/5 p-8 rounded-none hover:border-[#FFD700] transition-all shadow-md space-y-4">
              <div className="bg-black border border-white/10 text-[#FFD700] rounded-none w-10 h-10 flex items-center justify-center">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-widest uppercase">{v.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">{v.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Meet the Founder section with attractive card */}
      <div className="bg-[#0F0F0F] border border-white/10 p-8 md:p-12 rounded-none grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="md:col-span-1 flex flex-col items-center text-center space-y-3">
          <div className="relative">
            <div className="w-32 h-32 rounded-none bg-[#FFD700] flex items-center justify-center shadow-2xl relative z-10 p-3">
              <img
                src={logo}
                alt="Bang Bro Media Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="absolute inset-0 bg-[#FFD700] rounded-none blur-xl opacity-10 mt-2"></div>
          </div>
          <div>
            <h4 className="text-lg font-bold text-white tracking-tight uppercase">Bang Bro</h4>
            <p className="text-[10px] text-[#FFD700] font-mono tracking-widest uppercase">{t("founderRole")}</p>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#FFD700]/10 text-[#FFD700] text-[10px] font-bold rounded-none font-mono border border-[#FFD700]/20 uppercase tracking-widest">
            {t("founderNote")}
          </span>
          <h3 className="text-xl md:text-2xl font-serif font-bold text-white italic tracking-tight">
            {t("founderQuote")}
          </h3>
          <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-sans">
            {t("founderDesc")}
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <a 
              href="https://www.youtube.com/@BangBroMedia" 
              target="_blank" 
              referrerPolicy="no-referrer"
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 border border-transparent text-white rounded-none text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer"
            >
              <Youtube className="h-4 w-4" />
              <span>YouTube Channel</span>
            </a>
            <div className="px-5 py-2.5 bg-zinc-900 border border-white/10 text-zinc-300 rounded-none text-xs font-semibold flex items-center gap-2">
              <Heart className="h-4 w-4 text-rose-500 animate-pulse fill-rose-500" />
              <span>{t("supportedBy")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}