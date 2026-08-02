import { useState, useEffect } from "react";
import { BookOpen, Box, Film, Sparkles, Layers, FileText, Download, CheckCircle2 } from "lucide-react";
import { db } from "../firebase"; 
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

interface CategorySectionProps {
  initialSoftware?: string;
}

export default function CategorySection({ initialSoftware }: CategorySectionProps) {
  const [selectedSub, setSelectedSub] = useState<string>(initialSoftware || "opentoonz-tahoma");
  const [liveTutorials, setLiveTutorials] = useState<any[]>([]);
  const [liveResources, setLiveResources] = useState<any[]>([]);
  const [downloadedFiles, setDownloadedFiles] = useState<string[]>([]);

  useEffect(() => {
    if (initialSoftware) {
      setSelectedSub(initialSoftware);
    }
  }, [initialSoftware]);

  // SINKRONISASI REAL-TIME DATA UNTUK SOFTWARE YANG DIPILIH
  useEffect(() => {
    let unsubscribeTut = () => {};

    if (selectedSub === "resources") {
      // Ambil data resources jika tab resources yang diklik
      const qRes = query(collection(db, "resources"), orderBy("createdAt", "desc"));
      const unsubscribeRes = onSnapshot(qRes, (snapshot) => {
        const resData: any[] = [];
        snapshot.forEach((doc) => {
          resData.push({ id: doc.id, ...doc.data() });
        });
        setLiveResources(resData);
      });
      return () => unsubscribeRes();
    } else {
      // Ambil data tutorial sesuai software ID yang aktif
      const qTut = query(
        collection(db, "tutorials"),
        where("softwareId", "==", selectedSub),
        orderBy("createdAt", "desc")
      );

      unsubscribeTut = onSnapshot(qTut, (snapshot) => {
        const tutData: any[] = [];
        snapshot.forEach((doc) => {
          tutData.push({ id: doc.id, ...doc.data() });
        });
        setLiveTutorials(tutData);
      }, (error) => {
        console.error("Firestore Listen Error:", error);
      });
    }

    return () => unsubscribeTut();
  }, [selectedSub]);

  // PETA 5 SOFTWARE ANIMASI UTAMA + RESOURCES
  const subCategories = [
    { id: "opentoonz-tahoma", label: "OpenToonz / Tahoma", description: "Studio Ghibli 2D Pipeline", icon: BookOpen, num: "01" },
    { id: "moho", label: "Moho Animation", description: "Professional Vector Rigging", icon: Box, num: "02" },
    { id: "blender", label: "Blender 2D/3D", description: "Grease Pencil & 3D Mesh", icon: Film, num: "03" },
    { id: "adobe-animate", label: "Adobe Animate", description: "Interactive & Frame Animation", icon: Sparkles, num: "04" },
    { id: "toon-boom", label: "Toon Boom Harmony", description: "Industry Standard Cut-out", icon: Layers, num: "05" },
    { id: "resources", label: "Free Resources", description: "Raw Assets & Rig Presets", icon: Download, isResource: true, num: "06" },
  ];

  const handleTabClick = (subId: string) => {
    setSelectedSub(subId);
  };

  const handleTrackDownload = (id: string) => {
    if (!downloadedFiles.includes(id)) {
      setDownloadedFiles((prev) => [...prev, id]);
    }
  };

  const currentCategoryObj = subCategories.find((s) => s.id === selectedSub);

  return (
    <div className="space-y-8">
      {/* Category selector grid */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 text-zinc-500 font-mono">
          ANIMATION ENGINE HUBS
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {subCategories.map((sub) => {
            const isActive = selectedSub === sub.id;
            
            return (
              <button
                key={sub.id}
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
            Hub: <span className="text-[#FFD700] not-italic">{currentCategoryObj?.label}</span>
          </h2>
          <p className="text-sm text-zinc-400 mt-1 max-w-3xl">
            {selectedSub === "resources" 
              ? "Free downloadable raw project files, character rigs, background layers, and color palettes provided by Bang Bro Media team."
              : `Curated step-by-step production tutorials, workflows, and guides specifically for ${currentCategoryObj?.label}.`
            }
          </p>
        </div>

        {/* CONTEN RESOURCES TAB (06) */}
        {selectedSub === "resources" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {liveResources.map((res) => {
              const isDownloaded = downloadedFiles.includes(res.id);

              return (
                <div key={res.id} className="bg-zinc-900/60 border border-white/5 p-6 rounded-none flex flex-col justify-between hover:border-white/10 transition-all shadow-md">
                  <div className="space-y-3 pb-4">
                    <div className="flex items-start justify-between">
                      <span className="inline-flex px-2 py-0.5 bg-black text-[#FFD700] rounded-none text-[9px] font-mono font-bold uppercase tracking-wider border border-white/5">
                        {res.category || "RAW ASSET"}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {res.createdAt ? new Date(res.createdAt).toLocaleDateString("en-US") : "-"}
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <div className="p-3 bg-black text-[#FFD700] rounded-none max-h-12 border border-white/10 flex items-center justify-center">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-white tracking-tight leading-tight uppercase">{res.name}</h3>
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
                          <span>Downloaded!</span>
                        </>
                      ) : (
                        <>
                          <Download className="h-3.5 w-3.5" />
                          <span>Download Asset</span>
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
                  No resource files have been uploaded yet.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* JALUR UTAMA FILTER TUTORIAL BERDASARKAN SOFTWARE (TAB 01 - 05) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveTutorials.length > 0 ? (
              liveTutorials.map((tut) => (
                <div key={tut.id} className="bg-zinc-900/45 border border-white/5 rounded-none overflow-hidden hover:border-[#FFD700]/50 transition-all flex flex-col justify-between shadow-xl">
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                      <span className="text-[9px] font-mono text-[#FFD700] font-bold uppercase tracking-wider">
                        {tut.level || "INTERMEDIATE"}
                      </span>
                      <span className="text-xs text-zinc-500 font-mono">{tut.readTime || "5 MIN READ"}</span>
                    </div>

                    <h3 className="text-sm font-bold text-white tracking-wider uppercase leading-snug line-clamp-2">
                      {tut.title}
                    </h3>

                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                      {tut.description}
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
                      {tut.createdAt ? new Date(tut.createdAt.seconds * 1000).toLocaleDateString("en-US") : "Live Tutorial"}
                    </span>
                    <a
                      href={tut.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#FFD700] hover:text-white font-black uppercase tracking-wider flex items-center gap-1 group active:scale-95"
                    >
                      <span>Read Guide</span>
                      <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                    </a>
                  </div>
                </div>
              ))
            ) : (
              /* BANNER KOSONG SAAT AUTOFED BELUM ISI DATA SOFTWARE INI */
              <div className="col-span-full bg-zinc-900/30 border border-zinc-800 p-8 md:p-12 text-left space-y-6 max-w-4xl mx-auto backdrop-blur-sm">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono tracking-widest text-[#FFD700] uppercase bg-[#FFD700]/10 px-2.5 py-1 border border-[#FFD700]/20">
                    {currentCategoryObj?.label} Hub
                  </span>
                  <h3 className="text-xl md:text-2xl font-serif font-black text-white uppercase tracking-wide leading-tight pt-2">
                    Production-Grade Animation Tutorials
                  </h3>
                </div>

                <div className="space-y-4 text-zinc-400 text-xs md:text-sm leading-relaxed font-sans">
                  <p>
                    Welcome to the dedicated tutorial hub for <strong>{currentCategoryObj?.label}</strong>. Our AI Autofeeder is actively scanning industry feeds to generate structured step-by-step guides for this engine.
                  </p>
                  <p className="italic border-l-2 border-[#FFD700] pl-4 text-zinc-300 font-serif my-4">
                    "Great animation isn't about software complexity, it's about mastering key principles and pipeline efficiency."
                  </p>
                </div>

                <div className="pt-4 flex flex-wrap gap-3 border-t border-white/5 items-center justify-between text-[11px] font-mono text-zinc-500">
                  <p>Status: Waiting for Autofeeder Queue</p>
                  <span className="text-[#FFD700]">● Hub Active</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}