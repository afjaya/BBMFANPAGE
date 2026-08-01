import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Trash2, Edit3, Check, X, Film, Newspaper, Download, RefreshCw, Users, ShieldAlert } from "lucide-react";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<"news" | "video" | "resource" | "manage">("news");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // State Input Form Tambah Baru
  const [newsTitle, setNewsTitle] = useState("");
  const [newsContent, setNewsContent] = useState("");
  const [newsTag, setNewsTag] = useState("Pengumuman");

  // State Input Video
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [level, setLevel] = useState("PEMULA"); 
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState(""); 
  const [category, setCategory] = useState("ot-basic"); 

  const [resName, setResName] = useState("");
  const [resUrl, setResUrl] = useState("");
  const [resCategory, setResCategory] = useState("Aset Mentah");

  // State untuk List Management Data Live
  const [allNews, setAllNews] = useState<any[]>([]);
  const [allVideos, setAllVideos] = useState<any[]>([]);
  const [allResources, setAllResources] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]); 

  // State Pelacak Data yang Sedang Diedit (Inline Edit)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNewsFields, setEditNewsFields] = useState({ title: "", tag: "", content: "" });
  
  // State Edit Video
  const [editVideoFields, setEditVideoFields] = useState({ 
    title: "", 
    url: "", 
    category: "", 
    level: "PEMULA", 
    duration: "", 
    description: "", 
    points: "" 
  });
  const [editResourceFields, setEditResourceFields] = useState({ name: "", category: "", url: "" });
  
  // State Edit Member/User status
  const [editUserFields, setEditUserFields] = useState({ role: "member", status: "active" });

  // 1. Tarik Semua Data dari Firebase (Realtime Data)
  useEffect(() => {
    const qNews = query(collection(db, "news"), orderBy("createdAt", "desc"));
    const unsubNews = onSnapshot(qNews, (snap) => {
      setAllNews(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const qVid = query(collection(db, "videos"), orderBy("createdAt", "desc"));
    const unsubVid = onSnapshot(qVid, (snap) => {
      setAllVideos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const qRes = query(collection(db, "resources"), orderBy("createdAt", "desc"));
    const unsubRes = onSnapshot(qRes, (snap) => {
      setAllResources(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const qUsers = query(collection(db, "members"));
    const unsubUsers = onSnapshot(qUsers, (snap) => {
      setAllUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => {
      console.error("Gagal menarik data member:", err);
    });

    return () => {
      unsubNews();
      unsubVid();
      unsubRes();
      unsubUsers();
    };
  }, []);

  // 2. Fungsi Hapus Data
  const handleDelete = async (collectionName: string, id: string) => {
    if (window.confirm(`Bosku, yakin mau hapus item ini dari database permanent?`)) {
      try {
        setIsLoading(true);
        await deleteDoc(doc(db, collectionName, id));
        setMessage("✓ Data berhasil dimusnahkan dari server!");
      } catch (err: any) {
        setMessage("⚠️ Gagal menghapus: " + err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 3. Fungsi Simpan Perubahan Edit (Firebase Update)
  const handleSaveEdit = async (collectionName: string, id: string, updatedData: any) => {
    try {
      setIsLoading(true);
      const docRef = doc(db, collectionName, id);

      let dataToSave = { ...updatedData };
      if (collectionName === "videos" && typeof updatedData.points === "string") {
        dataToSave.points = updatedData.points.split(",").map((p: string) => p.trim()).filter(Boolean);
      }

      await updateDoc(docRef, dataToSave);
      setMessage("✓ Perubahan data sukses disimpan ke cloud!");
      setEditingId(null); 
    } catch (err: any) {
      setMessage("⚠️ Gagal mengupdate data: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Fungsi Upload Tambah Data Baru
  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true); setMessage("");
    try {
      await addDoc(collection(db, "news"), { title: newsTitle, content: newsContent, tag: newsTag, createdAt: new Date().toISOString() });
      setMessage("✓ Berita Komunitas berhasil mengudara!");
      setNewsTitle(""); setNewsContent("");
    } catch (err: any) { setMessage("⚠️ Gagal: " + err.message); } finally { setIsLoading(false); }
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true); setMessage("");
    try {
      await addDoc(collection(db, "videos"), { 
        title: videoTitle, 
        url: videoUrl, 
        level,
        duration,
        description,
        category,
        points: points.split(",").map(p => p.trim()).filter(Boolean),
        createdAt: new Date().toISOString() 
      });
      setMessage("✓ Video Slot Pembelajaran berhasil ditautkan!");
      setVideoTitle(""); setVideoUrl(""); setDuration(""); setDescription(""); setPoints("");
    } catch (err: any) { setMessage("⚠️ Gagal: " + err.message); } finally { setIsLoading(false); }
  };

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true); setMessage("");
    try {
      await addDoc(collection(db, "resources"), { name: resName, url: resUrl, category: resCategory, createdAt: new Date().toISOString() });
      setMessage("✓ Resource file sukses masuk ke list cloud!");
      setResName(""); setResUrl("");
    } catch (err: any) { setMessage("⚠️ Gagal: " + err.message); } finally { setIsLoading(false); }
  };

  return (
    <div className="bg-zinc-950 p-6 border border-white/10 max-w-4xl mx-auto my-10 font-mono">
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-black text-[#FFD700] uppercase tracking-wider">BANG BRO BACKSTAGE ADMIN</h2>
          <p className="text-[10px] text-zinc-500">Kekuasaan Penuh Manajemen Database Cloud</p>
        </div>
        {isLoading && <RefreshCw className="h-4 w-4 text-[#FFD700] animate-spin" />}
      </div>

      {message && <div className="mb-4 p-3 bg-zinc-900 border border-[#FFD700]/30 text-xs text-[#FFD700]">{message}</div>}

      {/* Navigasi Tab Utama */}
      <div className="grid grid-cols-4 gap-1 mb-6">
        <button type="button" onClick={() => { setActiveTab("news"); setMessage(""); setEditingId(null); }} className={`py-2 text-xs uppercase font-bold border rounded-none ${activeTab === "news" ? "bg-[#FFD700] text-black border-[#FFD700]" : "bg-zinc-900 text-zinc-400 border-white/5 hover:border-white/20"}`}>+ News</button>
        <button type="button" onClick={() => { setActiveTab("video"); setMessage(""); setEditingId(null); }} className={`py-2 text-xs uppercase font-bold border rounded-none ${activeTab === "video" ? "bg-[#FFD700] text-black border-[#FFD700]" : "bg-zinc-900 text-zinc-400 border-white/5 hover:border-white/20"}`}>+ Video</button>
        <button type="button" onClick={() => { setActiveTab("resource"); setMessage(""); setEditingId(null); }} className={`py-2 text-xs uppercase font-bold border rounded-none ${activeTab === "resource" ? "bg-[#FFD700] text-black border-[#FFD700]" : "bg-zinc-900 text-zinc-400 border-white/5 hover:border-white/20"}`}>+ Resource</button>
        <button type="button" onClick={() => { setActiveTab("manage"); setMessage(""); }} className={`py-2 text-xs uppercase font-bold border rounded-none ${activeTab === "manage" ? "bg-red-600 text-white border-red-600" : "bg-zinc-900 text-red-400 border-white/5 hover:bg-red-950/20"}`}>⚙️ Kelola ({allNews.length + allVideos.length + allResources.length + allUsers.length})</button>
      </div>

      {/* ================= FORM INPUT TAMBAH BARU ================= */}
      {activeTab === "news" && (
        <form onSubmit={handleAddNews} className="space-y-4">
          <div>
            <label className="text-[11px] uppercase text-zinc-400 block mb-1">Judul Pengumuman</label>
            <input type="text" required value={newsTitle} onChange={(e) => setNewsTitle(e.target.value)} className="w-full bg-zinc-900 border border-white/10 p-2 text-sm text-white focus:outline-none focus:border-[#FFD700]" />
          </div>
          <div>
            <label className="text-[11px] uppercase text-zinc-400 block mb-1">Kategori Tag</label>
            <select value={newsTag} onChange={(e) => setNewsTag(e.target.value)} className="w-full bg-zinc-900 border border-white/10 p-2 text-sm text-white focus:outline-none">
              <option value="Pengumuman">Pengumuman</option>
              <option value="Event">Event Komunitas</option>
              <option value="Update">Update Sistem</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] uppercase text-zinc-400 block mb-1">Isi Berita</label>
            <textarea required rows={4} value={newsContent} onChange={(e) => setNewsContent(e.target.value)} className="w-full bg-zinc-900 border border-white/10 p-2 text-sm text-white focus:outline-none focus:border-[#FFD700]" />
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-[#FFD700] text-black py-2.5 font-black text-xs uppercase tracking-wider hover:bg-white transition-all">Publish Berita</button>
        </form>
      )}

      {activeTab === "video" && (
        <form onSubmit={handleAddVideo} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] uppercase text-zinc-400 block mb-1">Pilih Slot Kategori Tab</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-zinc-900 border border-white/10 p-2 text-sm text-white focus:outline-none">
                <option value="ot-basic">01. OT BASIC (Navigasi & Drawing)</option>
                <option value="rigging">02. RIGGING (Plastic & Bone)</option>
                <option value="animating">03. ANIMATING (XSheet & Interp)</option>
                <option value="fx-render">04. FX & RENDER (Schematic Nodes)</option>
                <option value="rendering">05. RENDERING (Config MP4/GIF)</option>
                <option value="resources">06. RESOURCES (Bahan Mentah)</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] uppercase text-zinc-400 block mb-1">Tingkat Kesulitan (Badge)</label>
              <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full bg-zinc-900 border border-white/10 p-2 text-sm text-white focus:outline-none">
                <option value="PEMULA">PEMULA (Kuning)</option>
                <option value="MAHIR">MAHIR (Oranye)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="text-[11px] uppercase text-zinc-400 block mb-1">Judul Tutorial Video</label>
              <input type="text" required value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} className="w-full bg-zinc-900 border border-white/10 p-2 text-sm text-white focus:outline-none focus:border-[#FFD700]" placeholder="Misal: PRINSIP SQUASH & STRETCH..." />
            </div>
            <div>
              <label className="text-[11px] uppercase text-zinc-400 block mb-1">Durasi Video</label>
              <input type="text" required value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full bg-zinc-900 border border-white/10 p-2 text-sm text-white focus:outline-none focus:border-[#FFD700]" placeholder="Contoh: 15:30" />
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase text-zinc-400 block mb-1">Link URL YouTube</label>
            <input type="url" required value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="w-full bg-zinc-900 border border-white/10 p-2 text-sm text-white focus:outline-none focus:border-[#FFD700]" placeholder="https://www.youtube.com/watch?v=..." />
          </div>

          <div>
            <label className="text-[11px] uppercase text-zinc-400 block mb-1">Deskripsi Singkat Materi</label>
            <textarea required rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-zinc-900 border border-white/10 p-2 text-sm text-white focus:outline-none focus:border-[#FFD700]" placeholder="Jelaskan ringkasan materi pembelajaran video ini..." />
          </div>

          <div>
            <label className="text-[11px] uppercase text-zinc-400 block mb-1">Poin Pembelajaran (Pisahkan dengan tanda Koma ',')</label>
            <input type="text" value={points} onChange={(e) => setPoints(e.target.value)} className="w-full bg-zinc-900 border border-white/10 p-2 text-sm text-white focus:outline-none focus:border-[#FFD700]" placeholder="Membuat keyframe, Mengatur kemiringan kurva, Atur grafik efek" />
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-[#FFD700] text-black py-2.5 font-black text-xs uppercase tracking-wider hover:bg-white transition-all">Tautkan Video ke Slot Pembelajaran</button>
        </form>
      )}

      {activeTab === "resource" && (
        <form onSubmit={handleAddResource} className="space-y-4">
          <div>
            <label className="text-[11px] uppercase text-zinc-400 block mb-1">Nama File / Resource Asset</label>
            <input type="text" required value={resName} onChange={(e) => setResName(e.target.value)} className="w-full bg-zinc-900 border border-white/10 p-2 text-sm text-white focus:outline-none focus:border-[#FFD700]" />
          </div>
          <div>
            <label className="text-[11px] uppercase text-zinc-400 block mb-1">Kategori Label Sub</label>
            <select value={resCategory} onChange={(e) => setResCategory(e.target.value)} className="w-full bg-zinc-900 border border-white/10 p-2 text-sm text-white focus:outline-none">
              <option value="Aset Mentah">Aset Mentah</option>
              <option value="Palette">Color Palette Preset</option>
              <option value="Rigging">Kumpulan Bone Rigging</option>
              <option value="Background">Scene Background</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] uppercase text-zinc-400 block mb-1">Link Download</label>
            <input type="url" required value={resUrl} onChange={(e) => setResUrl(e.target.value)} className="w-full bg-zinc-900 border border-white/10 p-2 text-sm text-white focus:outline-none focus:border-[#FFD700]" />
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-[#FFD700] text-black py-2.5 font-black text-xs uppercase tracking-wider hover:bg-white transition-all">Unggah Mentahan</button>
        </form>
      )}

      {/* ================= TAB MANAGEMENT KELOLA ================= */}
      {activeTab === "manage" && (
        <div className="space-y-6 max-h-[550px] overflow-y-auto pr-2">
          
          {/* 1. KELOLA MEMBER DATABASE */}
          <div className="border border-white/5 p-3 bg-zinc-900/20">
            <h3 className="text-xs font-black text-white bg-zinc-900 px-3 py-1.5 flex items-center justify-between uppercase tracking-wider border-l-2 border-amber-500">
              <span className="flex items-center gap-2"><Users className="h-3.5 w-3.5 text-amber-500" /> Kelola Members ({allUsers.length})</span>
            </h3>
            <div className="mt-2 divide-y divide-white/5">
              {allUsers.length === 0 ? (
                <p className="text-zinc-500 text-xs py-4 text-center">Belum ada member terdata di cloud Firestore (Koleksi: members).</p>
              ) : (
                allUsers.map((user) => {
                  const isEditing = editingId === user.id;
                  return (
                    <div key={user.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5">
                      {isEditing ? (
                        <div className="flex-1 flex flex-wrap gap-2 w-full bg-zinc-900 p-2 border border-amber-500">
                          <div className="text-xs text-white font-bold w-full truncate">{user.email}</div>
                          <select value={editUserFields.role} onChange={(e) => setEditUserFields({ ...editUserFields, role: e.target.value })} className="bg-zinc-950 text-xs text-white p-1 border border-white/10">
                            <option value="member">MEMBER biasa</option>
                            <option value="premium">PREMIUM VIP</option>
                            <option value="admin">ADMIN BACKSTAGE</option>
                          </select>
                          <select value={editUserFields.status} onChange={(e) => setEditUserFields({ ...editUserFields, status: e.target.value })} className="bg-zinc-950 text-xs text-white p-1 border border-white/10">
                            <option value="active">ACTIVE (Lolos)</option>
                            <option value="banned">BANNED (Blokir)</option>
                          </select>
                        </div>
                      ) : (
                        <div className="truncate flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-zinc-200 font-bold">{user.displayName || user.name || "No Name"}</span>
                            <span className={`text-[8px] px-1.5 py-0.5 rounded uppercase font-black ${
                              user.role === 'admin' ? 'bg-red-600 text-white' : user.role === 'premium' ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-zinc-400'
                            }`}>
                              {user.role || "member"}
                            </span>
                            {user.status === "banned" && (
                              <span className="text-[8px] bg-red-950 text-red-400 border border-red-800 px-1.5 py-0.5 rounded flex items-center gap-1 uppercase">
                                <ShieldAlert className="h-2 w-2" /> Blocked
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-zinc-500 truncate mt-0.5">{user.email || "Tanpa Email"}</p>
                        </div>
                      )}
                      <div className="flex gap-1 justify-end items-center">
                        {isEditing ? (
                          <>
                            <button type="button" onClick={() => handleSaveEdit("members", user.id, editUserFields)} className="p-1.5 bg-emerald-950 text-emerald-400 border border-emerald-900 hover:bg-emerald-600 hover:text-white cursor-pointer"><Check className="h-3.5 w-3.5" /></button>
                            <button type="button" onClick={() => setEditingId(null)} className="p-1.5 bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-600 hover:text-white cursor-pointer"><X className="h-3.5 w-3.5" /></button>
                          </>
                        ) : (
                          <>
                            <button type="button" onClick={() => { 
                              setEditingId(user.id); 
                              setEditUserFields({ 
                                role: user.role || "member", 
                                status: user.status || "active" 
                              }); 
                            }} className="p-1.5 bg-zinc-900 border border-white/5 text-zinc-400 hover:border-amber-500 hover:text-amber-500 cursor-pointer" title="Ubah Role/Status"><Edit3 className="h-3.5 w-3.5" /></button>
                            <button type="button" onClick={() => handleDelete("members", user.id)} className="p-1.5 bg-red-950/40 border border-red-900/50 text-red-400 hover:bg-red-600 hover:text-white cursor-pointer" title="Hapus Permanen Akun"><Trash2 className="h-3.5 w-3.5" /></button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          
          {/* 2. MANAGEMENT NEWS */}
          <div className="border border-white/5 p-3 bg-zinc-900/20">
            <h3 className="text-xs font-black text-white bg-zinc-900 px-3 py-1.5 flex items-center gap-2 uppercase tracking-wider border-l-2 border-[#FFD700]">
              <Newspaper className="h-3.5 w-3.5 text-[#FFD700]" /> Kelola Berita ({allNews.length})
            </h3>
            <div className="mt-2 divide-y divide-white/5">
              {allNews.map((news) => {
                const isEditing = editingId === news.id;
                return (
                  <div key={news.id} className="py-3 flex flex-col gap-2">
                    {isEditing ? (
                      <div className="flex flex-col gap-2 w-full">
                        <div className="flex gap-2">
                          <select 
                            value={editNewsFields.tag} 
                            onChange={(e) => setEditNewsFields({ ...editNewsFields, tag: e.target.value })} 
                            className="bg-zinc-900 text-xs text-white p-1 border border-white/10 focus:outline-none"
                          >
                            <option value="Info Penting">Info Penting</option>
                            <option value="Materi">Materi</option>
                            <option value="Event">Event</option>
                            <option value="Update">Update</option>
                          </select>
                          <input 
                            type="text" 
                            value={editNewsFields.title} 
                            onChange={(e) => setEditNewsFields({ ...editNewsFields, title: e.target.value })} 
                            className="bg-zinc-900 text-xs text-white p-1 border border-[#FFD700] flex-1 focus:outline-none" 
                          />
                        </div>
                        <textarea 
                          value={editNewsFields.content} 
                          onChange={(e) => setEditNewsFields({ ...editNewsFields, content: e.target.value })} 
                          rows={2} 
                          placeholder="Edit rincian isi berita di sini..."
                          className="w-full bg-zinc-900 border border-white/10 p-2 text-xs text-white focus:outline-none resize-none" 
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="truncate">
                            <span className="text-[9px] bg-zinc-800 text-[#FFD700] font-mono px-1.5 py-0.5 border border-white/5 mr-2 uppercase">
                              {news.tag || news.category || "Info Penting"}
                            </span>
                            <span className="text-xs text-zinc-300 font-bold uppercase font-sans">{news.title}</span>
                          </div>
                          <div className="flex gap-1 justify-end shrink-0">
                            <button 
                              type="button" 
                              onClick={() => { 
                                setEditingId(news.id); 
                                setEditNewsFields({ 
                                  title: news.title, 
                                  tag: news.tag || news.category || "Info Penting",
                                  content: news.content || "" 
                                }); 
                              }} 
                              className="p-1.5 bg-zinc-900 border border-white/5 text-zinc-400 hover:border-[#FFD700] hover:text-[#FFD700] cursor-pointer"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button 
                              type="button" 
                              onClick={() => handleDelete("news", news.id)} 
                              className="p-1.5 bg-red-950/40 border border-red-900/50 text-red-400 hover:bg-red-600 hover:text-white cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-[11px] text-zinc-500 font-sans line-clamp-1 pl-1">
                          {news.content || "Tidak ada detail konten."}
                        </p>
                      </div>
                    )}
                    {isEditing && (
                      <div className="flex gap-1 justify-end">
                        <button type="button" onClick={() => handleSaveEdit("news", news.id, editNewsFields)} className="p-1.5 bg-emerald-950 text-emerald-400 border border-emerald-900 hover:bg-emerald-600 hover:text-white cursor-pointer"><Check className="h-3.5 w-3.5" /></button>
                        <button type="button" onClick={() => setEditingId(null)} className="p-1.5 bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-600 hover:text-white cursor-pointer"><X className="h-3.5 w-3.5" /></button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. MANAGEMENT VIDEOS */}
          <div className="border border-white/5 p-3 bg-zinc-900/20">
            <h3 className="text-xs font-black text-white bg-zinc-900 px-3 py-1.5 flex items-center gap-2 uppercase tracking-wider border-l-2 border-[#FFD700]">
              <Film className="h-3.5 w-3.5 text-[#FFD700]" /> Kelola Video Teater ({allVideos.length})
            </h3>
            <div className="mt-2 divide-y divide-white/5">
              {allVideos.map((vid) => {
                const isEditing = editingId === vid.id;
                return (
                  <div key={vid.id} className="py-3 flex flex-col justify-between gap-2">
                    {isEditing ? (
                      <div className="flex-1 space-y-2 w-full bg-zinc-900 p-3 border border-[#FFD700]">
                        <div className="grid grid-cols-2 gap-2">
                          <select value={editVideoFields.category} onChange={(e) => setEditVideoFields({ ...editVideoFields, category: e.target.value })} className="bg-zinc-950 text-[11px] text-white p-1 border border-white/10">
                            <option value="ot-basic">01. OT BASIC</option>
                            <option value="rigging">02. RIGGING</option>
                            <option value="animating">03. ANIMATING</option>
                            <option value="fx-render">04. FX & RENDER</option>
                            <option value="rendering">05. RENDERING</option>
                            <option value="resources">06. RESOURCES</option>
                          </select>
                          <select value={editVideoFields.level} onChange={(e) => setEditVideoFields({ ...editVideoFields, level: e.target.value })} className="bg-zinc-950 text-[11px] text-white p-1 border border-white/10">
                            <option value="PEMULA">PEMULA</option>
                            <option value="MAHIR">MAHIR</option>
                          </select>
                        </div>
                        <input type="text" value={editVideoFields.title} onChange={(e) => setEditVideoFields({ ...editVideoFields, title: e.target.value })} className="w-full bg-zinc-950 text-xs text-white p-1 border border-white/10" placeholder="Judul Video" />
                        <div className="grid grid-cols-3 gap-2">
                          <input type="text" value={editVideoFields.duration} onChange={(e) => setEditVideoFields({ ...editVideoFields, duration: e.target.value })} className="col-span-1 bg-zinc-950 text-xs text-white p-1 border border-white/10" placeholder="Durasi" />
                          <input type="text" value={editVideoFields.url} onChange={(e) => setEditVideoFields({ ...editVideoFields, url: e.target.value })} className="col-span-2 bg-zinc-950 text-xs text-white p-1 border border-white/10" placeholder="URL YouTube" />
                        </div>
                        <textarea value={editVideoFields.description} onChange={(e) => setEditVideoFields({ ...editVideoFields, description: e.target.value })} className="w-full bg-zinc-950 text-xs text-white p-1 border border-white/10" placeholder="Deskripsi" rows={2} />
                        <input type="text" value={editVideoFields.points} onChange={(e) => setEditVideoFields({ ...editVideoFields, points: e.target.value })} className="w-full bg-zinc-950 text-xs text-white p-1 border border-white/10" placeholder="Poin-poin dipisah koma" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-2 w-full">
                        <div className="truncate">
                          <span className="text-[8px] bg-zinc-800 text-[#FFD700] px-1.5 py-0.5 rounded mr-2 uppercase font-black">{vid.category || "ot-basic"}</span>
                          <span className="text-xs text-zinc-300 font-bold uppercase">{vid.title}</span>
                          <p className="text-[9px] text-zinc-500 truncate">{vid.url}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-1 justify-end items-center mt-1">
                      {isEditing ? (
                        <>
                          <button type="button" onClick={() => handleSaveEdit("videos", vid.id, editVideoFields)} className="p-1.5 bg-emerald-950 text-emerald-400 border border-emerald-900 hover:bg-emerald-600 hover:text-white cursor-pointer"><Check className="h-3.5 w-3.5" /></button>
                          <button type="button" onClick={() => setEditingId(null)} className="p-1.5 bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-600 hover:text-white cursor-pointer"><X className="h-3.5 w-3.5" /></button>
                        </>
                      ) : (
                        <>
                          <button type="button" onClick={() => { 
                            setEditingId(vid.id); 
                            setEditVideoFields({ 
                              title: vid.title, 
                              url: vid.url,
                              category: vid.category || "ot-basic",
                              level: vid.level || "PEMULA",
                              duration: vid.duration || "",
                              description: vid.description || "",
                              points: vid.points ? vid.points.join(", ") : ""
                            }); 
                          }} className="p-1.5 bg-zinc-900 border border-white/5 text-zinc-400 hover:border-[#FFD700] hover:text-[#FFD700] cursor-pointer"><Edit3 className="h-3.5 w-3.5" /></button>
                          <button type="button" onClick={() => handleDelete("videos", vid.id)} className="p-1.5 bg-red-950/40 border border-red-900/50 text-red-400 hover:bg-red-600 hover:text-white cursor-pointer"><Trash2 className="h-3.5 w-3.5" /></button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. MANAGEMENT RESOURCES */}
          <div className="border border-white/5 p-3 bg-zinc-900/20">
            <h3 className="text-xs font-black text-white bg-zinc-900 px-3 py-1.5 flex items-center gap-2 uppercase tracking-wider border-l-2 border-[#FFD700]">
              <Download className="h-3.5 w-3.5 text-[#FFD700]" /> Kelola Resources Mentahan ({allResources.length})
            </h3>
            <div className="mt-2 divide-y divide-white/5">
              {allResources.length === 0 ? (
                <p className="text-zinc-500 text-xs py-4 text-center">Belum ada resource mentahan di database.</p>
              ) : (
                allResources.map((res) => {
                  const isEditing = editingId === res.id;
                  return (
                    <div key={res.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
                      {isEditing ? (
                        <div className="flex-1 flex gap-2 w-full">
                          <select value={editResourceFields.category} onChange={(e) => setEditResourceFields({ ...editResourceFields, category: e.target.value })} className="bg-zinc-900 text-xs text-white p-1 border border-white/10 focus:outline-none">
                            <option value="Aset Mentah">Aset Mentah</option>
                            <option value="Palette">Palette</option>
                            <option value="Rigging">Rigging</option>
                            <option value="Background">Background</option>
                          </select>
                          <input type="text" value={editResourceFields.name} onChange={(e) => setEditResourceFields({ ...editResourceFields, name: e.target.value })} className="bg-zinc-900 text-xs text-white p-1 border border-[#FFD700] flex-1 focus:outline-none" placeholder="Nama resource..." />
                          <input type="url" value={editResourceFields.url} onChange={(e) => setEditResourceFields({ ...editResourceFields, url: e.target.value })} className="bg-zinc-900 text-xs text-white p-1 border border-white/10 flex-1 focus:outline-none" placeholder="URL Link..." />
                        </div>
                      ) : (
                        <div className="truncate flex-1">
                          <span className="text-[9px] bg-zinc-800 text-[#FFD700] px-1.5 py-0.5 rounded mr-2 uppercase font-black">{res.category || "Aset Mentah"}</span>
                          <span className="text-xs text-zinc-300 font-bold uppercase">{res.name}</span>
                          <p className="text-[9px] text-zinc-500 truncate mt-0.5 pl-1">{res.url || "Tidak ada URL"}</p>
                        </div>
                      )}
                      <div className="flex gap-1 justify-end items-center">
                        {isEditing ? (
                          <>
                            <button type="button" onClick={() => handleSaveEdit("resources", res.id, editResourceFields)} className="p-1.5 bg-emerald-950 text-emerald-400 border border-emerald-900 hover:bg-emerald-600 hover:text-white cursor-pointer"><Check className="h-3.5 w-3.5" /></button>
                            <button type="button" onClick={() => setEditingId(null)} className="p-1.5 bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-600 hover:text-white cursor-pointer"><X className="h-3.5 w-3.5" /></button>
                          </>
                        ) : (
                          <>
                            <button type="button" onClick={() => { setEditingId(res.id); setEditResourceFields({ name: res.name, category: res.category || "Aset Mentah", url: res.url || "" }); }} className="p-1.5 bg-zinc-900 border border-white/5 text-zinc-400 hover:border-[#FFD700] hover:text-[#FFD700] cursor-pointer"><Edit3 className="h-3.5 w-3.5" /></button>
                            <button type="button" onClick={() => handleDelete("resources", res.id)} className="p-1.5 bg-red-950/40 border border-red-900/50 text-red-400 hover:bg-red-600 hover:text-white cursor-pointer"><Trash2 className="h-3.5 w-3.5" /></button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}