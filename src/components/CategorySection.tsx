// src/components/CategorySection.tsx

import { useState, useEffect } from "react";
import { BookOpen, Box, Film, Sparkles, Sliders, Download, FileText, CheckCircle2, Lock } from "lucide-react";
import { db } from "../firebase"; 
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { useLanguage } from "../data/LanguageContext"; // <-- TAMBAHAN: Impor Language Context

interface CategorySectionProps {
  initialSubCategory?: string;
}

export default function CategorySection({ 
  initialSubCategory
}: CategorySectionProps) {
  const { t, language } = useLanguage(); // <-- TAMBAHAN: Ambil translasi statis & status bahasa aktif
  
  const [selectedSub, setSelectedSub] = useState<string>(initialSubCategory || "ot-basic");
  const [liveResources, setLiveResources] = useState<any[]>([]);
  const [liveVideos, setLiveVideos] = useState<any[]>([]); 
  const [downloadedFiles, setDownloadedFiles] = useState<string[]>([]);

  useEffect(() => {
    if (initialSubCategory) {
      setSelectedSub(initialSubCategory);
    }
  }, [initialSubCategory]);

  // SINKRONISASI REAL-TIME DATA UTAMA DARI CLOUD FIREBASE
  useEffect(() => {
    const qRes = query(collection(db, "resources"), orderBy("createdAt", "desc"));
    const unsubscribeRes = onSnapshot(qRes, (snapshot) => {
      const resData: any[] = [];
      snapshot.forEach((doc) => {
        resData.push({ id: doc.id, ...doc.data() });
      });
      setLiveResources(resData);
    });

    const qVid = query(collection(db, "videos"), orderBy("createdAt", "desc"));
    const unsubscribeVid = onSnapshot(qVid, (snapshot) => {
      const vidData: any[] = [];
      snapshot.forEach((doc) => {
        vidData.push({ id: doc.id, ...doc.data() });
      });
      setLiveVideos(vidData);
    });

    return () => {
      unsubscribeRes();
      unsubscribeVid();
    };
  }, []);

  // MODIFIKASI: Gunakan translasi dinamis untuk label & deskripsi sub-kategori statis lokal
  const subCategories = [
    { id: "ot-basic", label: language === "en" ? "OT Basic" : "OT Dasar", description: language === "en" ? "Navigation & Drawing" : "Navigasi & Menggambar", icon: BookOpen, num: "01" },
    { id: "rigging", label: "Rigging", description: language === "en" ? "Plastic & Bone System" : "Sistem Plastic & Bone", icon: Box, num: "02" },
    { id: "animating", label: "Animating", description: language === "en" ? "XSheet & Interpolation" : "XSheet & Interpolasi", icon: Film, num: "03" },
    { id: "fx-render", label: "FX & Render", description: "Schematic Nodes, Particles", icon: Sparkles, num: "04" },
    { id: "rendering", label: "Rendering", description: language === "en" ? "Configuration & MP4/GIF" : "Konfigurasi & MP4/GIF", icon: Sliders, num: "05" },
    { id: "resources", label: language === "en" ? "Resources" : "Sumber Daya", description: language === "en" ? "Free Raw Assets" : "Bahan Mentah Gratis", icon: Download, isResource: true, num: "06" },
  ];

  const handleTabClick = (subId: string) => {
    setSelectedSub(subId);
  };

  const filteredTutorials = liveVideos.filter((t) => t.category === selectedSub);

  const handleTrackDownload = (id: string) => {
    if (!downloadedFiles.includes(id)) {
      setDownloadedFiles((prev) => [...prev, id]);
    }
  };

  // Helper cerdas penentu bahasa untuk properti objek dinamis dari Firebase
  const getDynamicContent = (item: any, field: string) => {
    const suffix = language === "en" ? "En" : "Id";
    const specificField = `${field}${suffix}`;
    
    // Jika di Firebase ada titleEn/titleId atau descriptionEn/descriptionId, pakai itu.
    // Jika tidak ada, fallback balik ke default field utamanya (title / description biasa).
    return item[specificField] || item[field] || "";
  };

  return (
    <div className="space-y-8">
      {/* Category selector grid */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 text-zinc-500">
          {language === "en" ? "Course Content & Resources" : "Materi Kursus & Resources"}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {subCategories.map((sub) => {
            const isActive = selectedSub === sub.id;
            
            return (
              <button
                key={sub.id}
                data-category-trigger={sub.id}
                onClick={() => handleTabClick(sub.id)} 
                className={`p-4 text-left transition-all border rounded-none cursor-pointer flex flex-col justify-between h-28 outline-none relative ${
                  isActive
                    ? "bg-[#FFD700] text-black border-[#FFD700] shadow-md shadow-[#FFD700]/10"
                    : "bg-zinc-900 border-white/5 text-[#E0E0E0] hover:border-[#FFD700]"
                }`}
              >
                <div className="text-[10px] font-mono tracking-widest uppercase opacity-60 flex justify-between items-center w-full">
                  <span>{sub.num}</span>
                </div>
                <div>
                  <h3 className="text-xs font-black tracking-wider uppercase block truncate">{sub.label}</h3>
                  <p className={`text-[9px] truncate -mt-0.5 ${isActive ? "text-black/70" : "text-zinc-500"}`}>{sub.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Category Display Details */}
      <div className="space-y-6">
        <div className="border-b border-white/10 pb-4">
          <h2 className="text-3xl md:text-4xl font-serif font-black text-white italic tracking-tight">
            {language === "en" ? "Learning Slot: " : "Slot Pembelajaran: "}{" "}
            <span className="text-[#FFD700] not-italic">
              {subCategories.find((s) => s.id === selectedSub)?.label}
            </span>
          </h2>
          <p className="text-sm text-zinc-400 mt-1 max-w-3xl">
            {selectedSub === "resources" 
              ? (language === "en" 
                  ? "Free download of raw rigging project files, layers backgrounds, lip-sync sets, and real asset color palette presets from Admin Bang Bro Media."
                  : "Download gratis seluruh file latihan rigging, background, set mulut lip-sync, dan presets palet warna asli kiriman Admin Bang Bro Media.")
              : (language === "en"
                  ? `Comprehensive curated tutorial video course regarding ${subCategories.find((s) => s.id === selectedSub)?.label} in OpenToonz.`
                  : `Kursus video pilihan terlengkap mengenai bab ${subCategories.find((s) => s.id === selectedSub)?.label} di OpenToonz.`)
            }
          </p>
        </div>

        {/* Konten resources publik */}
        {selectedSub === "resources" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {liveResources.map((res) => {
                const isDownloaded = downloadedFiles.includes(res.id);
                // Terjemahkan nama resource secara dinamis jika ada field namaEn / namaId di Firestore
                const translatedName = getDynamicContent(res, "name");
                const translatedCategory = getDynamicContent(res, "category") || (language === "en" ? "LIVE ASSET" : "ASET LIVE");

                return (
                  <div key={res.id} className="bg-zinc-900/60 border border-white/5 p-6 rounded-none flex flex-col justify-between hover:border-white/10 transition-all shadow-md">
                    <div className="space-y-3 pb-4">
                      <div className="flex items-start justify-between">
                        <span className="inline-flex px-2 py-0.5 bg-black text-[#FFD700] rounded-none text-[9px] font-mono font-bold uppercase tracking-wider border border-white/5">
                          {translatedCategory}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {res.createdAt ? new Date(res.createdAt).toLocaleDateString(language === "en" ? "en-US" : "id-ID") : "-"}
                        </span>
                      </div>

                      <div className="flex gap-3">
                        <div className="p-3 bg-black text-[#FFD700] rounded-none max-h-12 border border-white/10 flex items-center justify-center">
                          <FileText className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-base font-bold text-white tracking-tight leading-tight uppercase">{translatedName}</h3>
                          <p className="text-xs text-zinc-400 leading-relaxed break-all font-mono text-[11px] text-zinc-500">{res.url}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="text-xs text-zinc-500 font-mono">Status: <span className="text-zinc-400 uppercase">Cloud Verified</span></span>
                      
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => handleTrackDownload(res.id)}
                        className={`px-4 py-2 rounded-none text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all active:scale-95 ${
                          isDownloaded
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-900/30"
                            : "bg-[#FFD700] hover:bg-white text-black shadow-md"
                        }`}
                      >
                        {isDownloaded ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>{language === "en" ? "Downloaded!" : "Sudah Diklik!"}</span>
                          </>
                        ) : (
                          <>
                            <Download className="h-3.5 w-3.5" />
                            <span>{language === "en" ? "Download Asset" : "Unduh Mentahan"}</span>
                          </>
                        )}
                      </a>
                    </div>
                  </div>
                );
              })}
              {liveResources.length === 0 && (
                <div className="col-span-2 p-12 bg-zinc-900/20 border border-dashed border-white/5 text-center">
                  <p className="text-xs text-zinc-600 font-mono italic">
                    {language === "en" ? "No resource files have been uploaded to database server yet." : "Belum ada file resource yang diupload ke database server."}
                  </p>
                </div>
              )}
            </div>
          )
        ) : (
          /* JALUR UTAMA FILTER DATA LIVE VIDEO DARI DATABASE (TAB 01 - 05) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutorials.length > 0 ? (
              filteredTutorials.map((tut) => {
                // Lokalisasi konten dinamis dari database admin backstage
                const dynamicTitle = getDynamicContent(tut, "title");
                const dynamicDesc = getDynamicContent(tut, "description");
                const dynamicLevel = getDynamicContent(tut, "level") || (language === "en" ? "BEGINNER" : "PEMULA");

                return (
                  <div key={tut.id} className="bg-zinc-900/45 border border-white/5 rounded-none overflow-hidden hover:border-[#FFD700]/50 transition-all flex flex-col justify-between shadow-xl">
                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                        <span className="text-[9px] font-mono text-[#FFD700] font-bold uppercase tracking-wider">
                          {dynamicLevel}
                        </span>
                        <span className="text-xs text-zinc-500 font-mono">{tut.duration || "--:--"}</span>
                      </div>

                      <h3 className="text-sm font-bold text-white tracking-wider uppercase leading-snug line-clamp-2">
                        {dynamicTitle}
                      </h3>

                      <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                        {dynamicDesc}
                      </p>

                      {tut.points && tut.points.length > 0 && (
                        <div className="pt-2">
                          <ul className="space-y-1">
                            {tut.points.slice(0, 3).map((p: string, idx: number) => (
                              <li key={idx} className="text-[11px] text-zinc-500 line-clamp-1 flex items-start gap-1">
                                <span className="text-[#FFD700]">•</span>
                                <span>{p}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-black/40">
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {tut.createdAt ? new Date(tut.createdAt).toLocaleDateString(language === "en" ? "en-US" : "id-ID") : "Live Class"}
                      </span>
                      <a
                        href={tut.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#FFD700] hover:text-white font-black uppercase tracking-wider flex items-center gap-1 group active:scale-95"
                      >
                        <span>{language === "en" ? "Watch Video" : "Tonton Video"}</span>
                        <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                      </a>
                    </div>
                  </div>
                );
              })
            ) : (
              /* DEFAULT FALLBACK BANNER JIKA TUTORIAL DI SUB-KATEGORI KOSONG */
              <div className="col-span-full bg-zinc-900/30 border border-zinc-800 p-8 md:p-12 text-left space-y-6 max-w-4xl mx-auto backdrop-blur-sm">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono tracking-widest text-[#FFD700] uppercase bg-[#FFD700]/10 px-2.5 py-1 border border-[#FFD700]/20">
                    {language === "en" ? "Begin Your Animation Journey" : "Mulai Petualangan Animasi Kamu"}
                  </span>
                  <h3 className="text-xl md:text-2xl font-serif font-black text-white uppercase tracking-wide leading-tight pt-2">
                    {language === "en" ? "Master Production-Scale Animation with OpenToonz Ecosystem" : "Menguasai Animasi Skala Produksi dengan Ekosistem OpenToonz"}
                  </h3>
                </div>

                <div className="space-y-4 text-zinc-400 text-xs md:text-sm leading-relaxed font-sans">
                  <p>
                    {language === "en" 
                      ? "OpenToonz is not just a standard free animation app. It is the powerhouse pipeline behind legendary, high-end animated films world-wide, including timeless classics from Studio Ghibli. The secret doesn't lie in how expensive your software is, but how deeply you understand its structural pipeline workflow."
                      : "OpenToonz bukan sekadar software animasi gratisan. Software ini adalah mesin tempur utama di balik mahakarya film animasi legendaris skala internasional, termasuk karya-karya ikonik dari Studio Ghibli hingga serial populer dunia. Kuncinya tidak terletak pada seberapa mahal software yang kamu gunakan, melainkan seberapa dalam kamu menguasai alur kerja (pipeline) produksinya."}
                  </p>
                  
                  <p>
                    {language === "en"
                      ? "Through this organized structured curriculum built by the Bang Bro Media team above, you are guided step-by-step toward industrial animation masteries:"
                      : "Melalui kurikulum terstruktur yang telah disusun oleh tim Bang Bro Media di atas, kamu diajak untuk melangkah setapak demi setapak menuju standar industri profesional:"}
                  </p>

                  {/* Poin Alur Pipeline Produksi */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 bg-black/40 p-4 border border-white/5 font-mono text-[11px] text-zinc-400">
                    <div className="space-y-1">
                      <p className="text-[#FFD700] font-bold">
                        {language === "en" ? "1. PRE-PRODUCTION & DRAWING PHASE" : "1. FASE PRA-PRODUKSI & DRAWING"}
                      </p>
                      <p>
                        {language === "en" ? "Understand essential navigation controls and vector/raster raw drawing drawing mechanics directly on canvas." : "Pahami navigasi esensial dan teknik drawing vektor/raster langsung di canvas OpenToonz."}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[#FFD700] font-bold">
                        {language === "en" ? "2. RIGGING & PLASTIC TOOL PHASE" : "2. FASE RIGGING & PLASTIC TOOL"}
                      </p>
                      <p>
                        {language === "en" ? "Build flexible skeletons bone setup and mesh layout models to heavily cut execution times." : "Bangun sistem tulang (bone) dan mesh karakter yang fleksibel untuk memangkas waktu produksi."}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[#FFD700] font-bold">
                        {language === "en" ? "3. ANIMATING & INTERPOLATION PHASE" : "3. FASE ANIMATING & INTERPOLATION"}
                      </p>
                      <p>
                        {language === "en" ? "Harness the XSheet spreadsheets, handle frame structures, and control smooth interpolations." : "Kendalikan XSheet, kelola penomoran frame, dan kuasai transisi antar-keyframe dengan halus."}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[#FFD700] font-bold">
                        {language === "en" ? "4. POST-PRODUCTION (FX & RENDER)" : "4. FASE PASCA-PRODUKSI (FX & RENDER)"}
                      </p>
                      <p>
                        {language === "en" ? "Formulate composite visual nodes inside Schematic Views and export ready-to-air MP4/GIF outputs." : "Racik efek visual memukau lewat Schematic Nodes dan ekspor hasil akhir ke format MP4/GIF siap edar."}
                      </p>
                    </div>
                  </div>

                  <p className="italic border-l-2 border-[#FFD700] pl-4 text-zinc-300 font-serif my-4">
                    {language === "en"
                      ? '"Every master animator starts their journey by mastering the smallest single button available in their production software."'
                      : '"Setiap animator besar memulai langkahnya dari memahami fungsi tombol terkecil di software-nya."'}
                  </p>

                  <p>
                    {language === "en"
                      ? "Don't just watch from the sidelines. Select any of the learning modules above, exploit all provided free downloadable resources assets, and generate your signature scale production work today!"
                      : "Jangan hanya menjadi penonton. Pilih salah satu Slot Pembelajaran di atas sekarang, manfaatkan file Resources mentahan gratis yang sudah disediakan, dan mulailah membangun portofolio animasi skala produksi pertamamu hari ini!"}
                  </p>
                </div>

                <div className="pt-4 flex flex-wrap gap-3 border-t border-white/5 items-center justify-between text-[11px] font-mono text-zinc-500">
                  <p>{language === "en" ? "Pipeline Standard: Studio Ghibli Base Spec" : "Pipeline Standard: Studio Ghibli Base Spec"}</p>
                  <div className="flex gap-4">
                    <span className="text-emerald-500">● Real-time Course Active</span>
                    <span>V.1.0.0</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}