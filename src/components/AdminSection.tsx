import { useState, useEffect } from "react";
import { 
  FileText, Video, Users, Trophy, Gift, Plus, 
  Trash2, ShieldAlert, UserMinus, Edit3, Check, X
} from "lucide-react";
import { MemberProfile } from "./MemberSection";

interface AdminSectionProps {
  registeredMembers: MemberProfile[];
}

type AdminTab = "news" | "videos" | "members" | "challenges" | "doorprize";

// Interface pendukung untuk fitur edit inline berita
interface EditNewsFields {
  title: string;
  content: string;
  tag: string;
}

export default function AdminSection({ registeredMembers }: AdminSectionProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("news");

  // --- LOCAL MEMBER STATE WRAPPER ---
  const [localMembers, setLocalMembers] = useState<MemberProfile[]>(registeredMembers);

  // Sinkronisasi jika sewaktu-waktu data dari props berubah
  useEffect(() => {
    setLocalMembers(registeredMembers);
  }, [registeredMembers]);

  // --- MOCK STATES (SIMULASI DATA RUTE A) ---
  const [newsList, setNewsList] = useState([
    { id: 1, title: "Grup WA Komunitas Resmi Dibuka!", category: "Info Penting", tag: "Info Penting", content: "Kini wadah interaksi resmi antar-animator lokal telah resmi dibuka melalui WhatsApp Group. Silakan cek pin chat untuk tautan masuk.", date: "2026-06-19" },
    { id: 2, title: "Tips Mengoptimalkan Peg-Bar di OpenToonz", category: "Materi", tag: "Materi", content: "Panduan teknis mempercepat workflow tweening tradisional menggunakan penataan peg-bar node schematic studio secara efisien.", date: "2026-06-18" }
  ]);
  const [videoList, setVideoList] = useState([
    { id: 1, title: "Tutorial Rigging Karakter Moho 14", link: "https://youtube.com/...", category: "Moho" },
    { id: 2, title: "Dasar Schematic Node OpenToonz FX", link: "https://youtube.com/...", category: "OpenToonz" }
  ]);
  const [challenges, setChallenges] = useState([
    { id: 1, title: "Challenge Loop Animation 2D: Merdeka!", deadline: "2026-08-17", points: 150 }
  ]);
  const [prizes, setPrizes] = useState([
    { id: 1, name: "Kaos Eksklusif Bang Bro Media", stock: 5, pointsRequired: 300 }
  ]);

  // Form Inputs States
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Info Penting");
  const [newContent, setNewContent] = useState(""); // DITAMBAHKAN: State untuk textarea berita baru
  
  const [vTitle, setVTitle] = useState("");
  const [vLink, setVLink] = useState("");
  const [vCat, setVCat] = useState("OpenToonz");
  const [cTitle, setCTitle] = useState("");
  const [cDeadline, setCDeadline] = useState("");
  const [cPoints, setCPoints] = useState(100);

  // States pendukung untuk fitur inline editing berita
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNewsFields, setEditNewsFields] = useState<EditNewsFields>({ title: "", content: "", tag: "" });

  // Winner Spinner State
  const [winnerName, setWinnerName] = useState<string | null>(null);

  // --- HANDLERS ---
  const handleAddNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    
    setNewsList([
      { 
        id: Date.now(), 
        title: newTitle, 
        category: newCategory, 
        tag: newCategory, 
        content: newContent, 
        date: new Date().toISOString().split('T')[0] 
      }, 
      ...newsList
    ]);
    
    // Reset Form
    setNewTitle("");
    setNewContent("");
  };

  // Handler untuk menyimpan perubahan edit berita (Mock Engine/Firebase Ready)
  const handleSaveEdit = (type: "news", id: number, fields: EditNewsFields) => {
    if (type === "news") {
      setNewsList(newsList.map(item => 
        item.id === id 
          ? { ...item, title: fields.title, content: fields.content, category: fields.tag, tag: fields.tag } 
          : item
      ));
      setEditingId(null);
    }
  };

  // Handler untuk menghapus item umum
  const handleDelete = (type: "news", id: number) => {
    if (type === "news") {
      setNewsList(newsList.filter(news => news.id !== id));
    }
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vTitle || !vLink) return;
    setVideoList([{ id: Date.now(), title: vTitle, link: vLink, category: vCat }, ...videoList]);
    setVTitle(""); setVLink("");
  };

  const handleAddChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cTitle || !cDeadline) return;
    setChallenges([{ id: Date.now(), title: cTitle, deadline: cDeadline, points: Number(cPoints) }, ...challenges]);
    setCTitle(""); setCDeadline("");
  };

  // Handler fungsi Suspend Member
  const handleSuspendMember = (username: string, memberName: string) => {
    const konfirmasi = window.confirm(`Apakah kamu yakin ingin men-suspend @${username} (${memberName}), bosku?`);
    if (konfirmasi) {
      setLocalMembers(localMembers.filter(member => member.username !== username));
      alert(`Sobat @${username} berhasil di-suspend dari sistem local dashboard!`);
    }
  };

  const acakDoorprize = () => {
    if (localMembers.length === 0) {
      setWinnerName("Belum ada member terdaftar, bosku!");
      return;
    }
    const indexAcak = Math.floor(Math.random() * localMembers.length);
    setWinnerName(localMembers[indexAcak].name);
  };

  // Navigasi Tab Admin
  const tabs = [
    { id: "news", label: "Info Terbaru", icon: FileText },
    { id: "videos", label: "Update Video", icon: Video },
    { id: "members", label: "Manajemen Member", icon: Users },
    { id: "challenges", label: "Challenge", icon: Trophy },
    { id: "doorprize", label: "Doorprize Spinner", icon: Gift },
  ];

  return (
    <div className="space-y-6 bg-black min-h-screen text-zinc-300">
      {/* Header Dashboard Admin */}
      <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-black text-white italic tracking-tight flex items-center gap-2">
            CONTROL CENTER: <span className="text-[#FFD700] not-italic">DASHBOARD ADMIN</span>
          </h2>
          <p className="text-xs text-zinc-500 font-mono mt-1">Otoritas penuh manajemen konten fanpage & member komunitas.</p>
        </div>
        <div className="bg-red-950/20 border border-red-500/20 px-3 py-1.5 flex items-center gap-2 text-[10px] font-mono text-red-400 uppercase tracking-widest">
          <ShieldAlert className="h-4 w-4" /> Mode Admin Aktif
        </div>
      </div>

      {/* Navigasi Tab */}
      <div className="flex flex-wrap gap-1 border-b border-white/5 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`flex items-center gap-1.5 px-3 py-2 text-[10px] font-mono uppercase tracking-wider transition-all border rounded-none cursor-pointer
                ${isActive 
                  ? "bg-[#FFD700] text-black font-bold border-[#FFD700]" 
                  : "bg-transparent text-zinc-500 border-transparent hover:text-white hover:bg-zinc-900"
                }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* --- KONTEN AKTIF BERDASARKAN TAB --- */}
      <div className="bg-[#0F0F0F] border border-white/10 p-6 relative">
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#FFD700]"></div>
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#FFD700]"></div>

        {/* TAB 1: NEWS & INFO */}
        {activeTab === "news" && (
          <div className="space-y-6">
            {/* FORM INPUT BERITA BARU */}
            <form onSubmit={handleAddNews} className="space-y-4 bg-black p-4 border border-white/5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block">Judul Info Terbaru</label>
                  <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Contoh: Jadwal Live Streaming Minggu Ini" className="w-full bg-zinc-900 border border-white/10 p-2 text-xs text-white focus:border-[#FFD700] font-mono rounded-none" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block">Kategori / Tag Slider</label>
                  <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full bg-zinc-900 border border-white/10 p-2 text-xs text-white focus:border-[#FFD700] font-mono rounded-none">
                    <option value="Info Penting">🚨 Info Penting</option>
                    <option value="Materi">📚 Materi</option>
                    <option value="Event">🔥 Event</option>
                    <option value="Update">⚙️ Update</option>
                  </select>
                </div>
              </div>

              {/* Input Textarea untuk Isi Konten Berita */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-zinc-400 block">Isi Pengumuman / Konten Detail Berita</label>
                <textarea value={newContent} onChange={(e) => setNewContent(e.target.value)} rows={4} placeholder="Tulis rincian informasi di sini agar terbaca di slider dashboard utama..." className="w-full bg-zinc-900 border border-white/10 p-2 text-xs text-white focus:border-[#FFD700] font-mono rounded-none resize-none" required />
              </div>

              <div className="flex justify-end">
                <button type="submit" className="bg-[#FFD700] text-black hover:bg-white font-mono font-bold text-xs uppercase py-2.5 px-6 rounded-none flex items-center justify-center gap-1 transition-all cursor-pointer">
                  <Plus className="h-4 w-4" /> Publish Info
                </button>
              </div>
            </form>

            {/* DAFTAR MANAJEMEN BERITA AKTIF */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase text-white tracking-widest border-b border-white/5 pb-1">
                Kelola Log Pengumuman Aktif ({newsList.length})
              </h4>
              {newsList.length === 0 ? (
                <p className="text-zinc-500 text-xs py-4 text-center font-mono">Belum ada log berita aktif di database.</p>
              ) : (
                newsList.map((news) => {
                  const jailbreakTag = news.tag || news.category || "Info Penting";
                  const isEditing = editingId === news.id;

                  return (
                    <div key={news.id} className="bg-zinc-900/50 p-3 border border-white/5 text-xs font-mono flex flex-col gap-3">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                        
                        {isEditing ? (
                          /* Mode Edit Aktif */
                          <div className="flex-1 flex flex-col gap-2 w-full">
                            <div className="flex gap-2">
                              <select value={editNewsFields.tag} onChange={(e) => setEditNewsFields({ ...editNewsFields, tag: e.target.value })} className="bg-zinc-900 text-xs text-white p-1.5 border border-white/10 focus:outline-none">
                                <option value="Info Penting">Info Penting</option>
                                <option value="Materi">Materi</option>
                                <option value="Event">Event</option>
                                <option value="Update">Update</option>
                              </select>
                              <input type="text" value={editNewsFields.title} onChange={(e) => setEditNewsFields({ ...editNewsFields, title: e.target.value })} className="bg-zinc-900 text-xs text-white p-1.5 border border-[#FFD700] flex-1 focus:outline-none" />
                            </div>
                            <textarea value={editNewsFields.content} onChange={(e) => setEditNewsFields({ ...editNewsFields, content: e.target.value })} rows={3} className="w-full bg-zinc-900 border border-white/10 p-2 text-xs text-white focus:outline-none resize-none" />
                          </div>
                        ) : (
                          /* Mode Tampilan Normal */
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="px-1.5 py-0.5 bg-zinc-800 text-[#FFD700] text-[9px] uppercase border border-white/5 font-black">
                                {jailbreakTag}
                              </span>
                              <span className="text-zinc-200 font-sans font-bold text-sm uppercase tracking-tight">{news.title}</span>
                              <span className="text-[10px] text-zinc-500 ml-auto">{news.date}</span>
                            </div>
                            <p className="text-zinc-400 text-xs font-sans line-clamp-2 pl-1 leading-relaxed">{news.content || "Tidak ada detail konten."}</p>
                          </div>
                        )}

                        {/* PANEL DUA TOMBOL AKSI */}
                        <div className="flex items-center gap-1.5 self-end md:self-center ml-auto pl-2">
                          {isEditing ? (
                            <>
                              <button type="button" onClick={() => handleSaveEdit("news", news.id, editNewsFields)} className="p-1.5 bg-emerald-950 text-emerald-400 border border-emerald-900 hover:bg-emerald-600 hover:text-white cursor-pointer"><Check className="h-3.5 w-3.5" /></button>
                              <button type="button" onClick={() => setEditingId(null)} className="p-1.5 bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-600 hover:text-white cursor-pointer"><X className="h-3.5 w-3.5" /></button>
                            </>
                          ) : (
                            <>
                              <button type="button" onClick={() => { setEditingId(news.id); setEditNewsFields({ title: news.title, content: news.content || "", tag: jailbreakTag }); }} className="p-1.5 bg-zinc-900 border border-white/5 text-zinc-400 hover:border-[#FFD700] hover:text-[#FFD700] cursor-pointer"><Edit3 className="h-3.5 w-3.5" /></button>
                              <button type="button" onClick={() => handleDelete("news", news.id)} className="p-1.5 bg-red-950/40 border border-red-900/50 text-red-400 hover:bg-red-600 hover:text-white cursor-pointer"><Trash2 className="h-3.5 w-3.5" /></button>
                            </>
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 2: UPDATE VIDEO */}
        {activeTab === "videos" && (
          <div className="space-y-6">
            <form onSubmit={handleAddVideo} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end bg-black p-4 border border-white/5">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-zinc-400 block">Judul Video Tutorial</label>
                <input type="text" value={vTitle} onChange={(e) => setVTitle(e.target.value)} placeholder="Cara Bikin Efek Ledakan" className="w-full bg-zinc-900 border border-white/10 p-2 text-xs text-white focus:border-[#FFD700] rounded-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-zinc-400 block">Link Embed YouTube</label>
                <input type="text" value={vLink} onChange={(e) => setVLink(e.target.value)} placeholder="https://youtube.com/watch?v=..." className="w-full bg-zinc-900 border border-white/10 p-2 text-xs text-white focus:border-[#FFD700] rounded-none font-mono" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-zinc-400 block">Software Kategori</label>
                <select value={vCat} onChange={(e) => setVCat(e.target.value)} className="w-full bg-zinc-900 border border-white/10 p-2 text-xs text-white focus:border-[#FFD700] font-mono rounded-none">
                  <option value="OpenToonz">OpenToonz</option>
                  <option value="Moho">Moho</option>
                  <option value="Adobe Animate">Adobe Animate</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <button type="submit" className="bg-[#FFD700] text-black hover:bg-white font-mono font-bold text-xs uppercase py-2.5 rounded-none flex items-center justify-center gap-1 transition-all cursor-pointer"><Plus className="h-4 w-4" /> Tambah Video</button>
            </form>

            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase text-white tracking-widest border-b border-white/5 pb-1">Koleksi Video Terunggah</h4>
              {videoList.map((video) => (
                <div key={video.id} className="flex justify-between items-center bg-zinc-900/50 p-3 border border-white/5 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-[#FFD700] font-bold text-[10px] uppercase bg-black px-2 py-0.5 border border-white/5">{video.category}</span>
                    <span className="text-zinc-200 font-sans">{video.title}</span>
                  </div>
                  <button onClick={() => setVideoList(videoList.filter(v => v.id !== video.id))} className="text-red-400 hover:text-red-600 cursor-pointer"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MANAJEMEN MEMBER */}
        {activeTab === "members" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h4 className="text-xs font-mono font-bold uppercase text-white tracking-widest">Database Member Komunitas Saat Ini</h4>
              <span className="text-[10px] font-mono text-[#FFD700] bg-zinc-900 px-2 py-0.5 border border-white/5">TOTAL: {localMembers.length} SOBAT</span>
            </div>

            {localMembers.length === 0 ? (
              <p className="text-xs font-mono text-zinc-500 italic py-4 text-center">Belum ada member aktif di daftar ini, bosku.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-zinc-950 text-zinc-400 text-[10px] uppercase">
                      <th className="p-3">Nama</th>
                      <th className="p-3">Username & WA</th>
                      <th className="p-3">Tools / Level</th>
                      <th className="p-3">Status Kontrol</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {localMembers.map((member, index) => (
                      <tr key={index} className="hover:bg-zinc-900/30">
                        <td className="p-3 font-bold text-white font-sans">{member.name}</td>
                        <td className="p-3">
                          <span className="text-zinc-400 block text-[11px]">@{member.username}</span>
                          <span className="text-emerald-400 text-[11px]">{member.whatsapp}</span>
                        </td>
                        <td className="p-3">
                          <span className="text-[#FFD700] font-bold block">{member.tools}</span>
                          <span className="text-zinc-500 text-[10px] uppercase">Level: {member.level}</span>
                        </td>
                        <td className="p-3">
                          <button 
                            onClick={() => handleSuspendMember(member.username, member.name)}
                            className="text-red-400 hover:text-red-500 hover:underline flex items-center gap-1 text-[10px] uppercase cursor-pointer"
                          >
                            <UserMinus className="h-3 w-3" /> Suspend
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CHALLENGE */}
        {activeTab === "challenges" && (
          <div className="space-y-6">
            <form onSubmit={handleAddChallenge} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end bg-black p-4 border border-white/5">
              <div className="space-y-1 col-span-1 md:col-span-2">
                <label className="text-[10px] font-mono uppercase text-zinc-400 block">Nama / Topik Challenge Baru</label>
                <input type="text" value={cTitle} onChange={(e) => setCTitle(e.target.value)} placeholder="Contoh: Animasi Efek Air Mengalir (Fluid)" className="w-full bg-zinc-900 border border-white/10 p-2 text-xs text-white focus:border-[#FFD700] rounded-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-zinc-400 block">Deadline</label>
                <input type="date" value={cDeadline} onChange={(e) => setCDeadline(e.target.value)} className="w-full bg-zinc-900 border border-white/10 p-2 text-xs text-white focus:border-[#FFD700] rounded-none font-mono" />
              </div>
              <button type="submit" className="bg-[#FFD700] text-black hover:bg-white font-mono font-bold text-xs uppercase py-2.5 rounded-none flex items-center justify-center gap-1 transition-all cursor-pointer"><Plus className="h-4 w-4" /> Rilis Misi</button>
            </form>

            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase text-white tracking-widest border-b border-white/5 pb-1">Tantangan yang Sedang Berjalan</h4>
              {challenges.map((c) => (
                <div key={c.id} className="flex justify-between items-center bg-zinc-900/50 p-3 border border-white/5 text-xs font-mono">
                  <div>
                    <span className="text-[#FFD700] font-bold mr-2">🔥 +{c.points} XP</span>
                    <span className="text-zinc-200 font-sans">{c.title}</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-400">
                    <span>Batas: <b className="text-red-400">{c.deadline}</b></span>
                    <button onClick={() => setChallenges(challenges.filter(ch => ch.id !== c.id))} className="text-red-400 hover:text-red-600 cursor-pointer"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: DOORPRIZE SPINNER ACCUMULATOR */}
        {activeTab === "doorprize" && (
          <div className="space-y-6 text-center py-6 bg-black/40 border border-white/5">
            <div className="max-w-md mx-auto space-y-4">
              <div className="p-3 bg-zinc-900 border border-[#FFD700]/30">
                <h4 className="text-xs font-mono font-bold uppercase text-zinc-400 tracking-wider">Sistem Pengundian Acak Digital</h4>
                <p className="text-[11px] text-zinc-500 font-sans mt-0.5">Sistem akan memilih secara adil 1 nama pemenang dari database pendaftar lokal saat ini.</p>
              </div>

              {/* TAMPILAN DISPLAY PEMENANG CYBER */}
              <div className="h-28 bg-zinc-950 border-2 border-dashed border-[#FFD700]/60 flex flex-col items-center justify-center p-4 relative overflow-hidden">
                {winnerName ? (
                  <div className="space-y-1 animate-pulse">
                    <span className="text-[9px] uppercase tracking-widest font-mono text-[#FFD700] bg-[#FFD700]/10 px-2 py-0.5 border border-[#FFD700]/20">✓ PEMENANG SAH</span>
                    <h3 className="text-2xl font-serif font-black text-white tracking-wide uppercase">{winnerName}</h3>
                  </div>
                ) : (
                  <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest">Mesin Spinner Siap Dihentakkan</span>
                )}
              </div>

              <button
                onClick={acakDoorprize}
                className="w-full py-3 bg-[#FFD700] text-black hover:bg-white font-mono font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 rounded-none cursor-pointer"
              >
                <Gift className="h-4 w-4" />
                <span>Kocok Nama Pemenang Doorprize</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}