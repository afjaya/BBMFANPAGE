import { useState, useEffect } from "react";
import { 
  Play, 
  Calendar, 
  ChevronRight, 
  ChevronLeft, 
  Newspaper, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Send, 
  Trash2, 
  ScrollText,
  Clock
} from "lucide-react";
import { useLanguage } from "../data/LanguageContext"; 
import { db } from "../firebase";
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  setDoc, 
  serverTimestamp 
} from "firebase/firestore";

interface HomeSectionProps {
  onNavigateToResource: () => void;
  newsData: any[];
  videoData: any[];
  currentUser: any; // Menerima data user dari App.tsx untuk polling & komentar berita
}

function getYouTubeId(url: string) {
  if (!url) return "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?\??v=|=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : url;
}

export default function HomeSection({ onNavigateToResource, newsData, videoData, currentUser }: HomeSectionProps) {
  const [activeVideo, setActiveVideo] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0); 
  const { t, language } = useLanguage(); 

  // --- STATE UNTUK POLLING & KOMENTAR BERITA ---
  const [comments, setComments] = useState<any[]>([]);
  const [allVotes, setAllVotes] = useState<any[]>([]);
  const [commentAuthor, setCommentAuthor] = useState("");
  const [inputComment, setInputComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const localeFormat = language === "id" ? "id-ID" : "en-US";
  const featuredNews = newsData && newsData.length > 0 ? newsData[activeIndex] : null;

  useEffect(() => {
    if (videoData && videoData.length > 0 && !activeVideo) {
      setActiveVideo(videoData[0]);
    }
  }, [videoData, activeVideo]);

  // --- SYNC SINKRONISASI REALTIME KOMENTAR & VOTING SESUAI BERITA AKTIF ---
  useEffect(() => {
    if (!featuredNews?.id) return;

    // 1. Ambil Data Komentar Berita Bawaan Berita Terpilih
    const qComments = query(collection(db, "news_comments"), orderBy("createdAt", "asc"));
    const unsubComments = onSnapshot(qComments, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setComments(docs.filter((c: any) => c.newsId === featuredNews.id));
    });

    // 2. Ambil Data Polling Berita Terpilih
    const qVotes = collection(db, "news_polls");
    const unsubVotes = onSnapshot(qVotes, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setAllVotes(docs.filter((v: any) => v.newsId === featuredNews.id));
    });

    return () => {
      unsubComments();
      unsubVotes();
    };
  }, [featuredNews]);

// --- AMBIL USER ID SECARA FLEKSIBEL (Menggunakan email/username jika ID kosong) ---
const currentUserId = currentUser?.uid || currentUser?.id || currentUser?.userId || currentUser?.email || currentUser?.username;
// TARUH INI UNTUK MENGINTIP ISI USER DI INSPECT CONSOLE BROWSER
console.log("Isi objek currentUser yang diterima:", currentUser);
console.log("Hasil currentUserId yang terbaca:", currentUserId);

  // --- KALKULASI HASIL KUESIONER VOTE ---
  const totalVotes = allVotes.length;
  const agreeVotes = allVotes.filter(v => v.vote === "agree").length;
  const disagreeVotes = allVotes.filter(v => v.vote === "disagree").length;
  const userVote = allVotes.find(v => v.userId === currentUserId)?.vote;

  // --- ACTION HANDLERS FIXED & OPTIMIZED ---
  const handleVote = async (type: "agree" | "disagree") => {
    const guestId = `guest-${Date.now()}`;
    const votingUserId = currentUserId || guestId;

    if (!featuredNews?.id) {
      alert("Data pengumuman berita tidak valid.");
      return;
    }

    const voteId = `${featuredNews.id}_${votingUserId}`;
    try {
      await setDoc(doc(db, "news_polls", voteId), {
        newsId: featuredNews.id,
        userId: votingUserId,
        vote: type,
        timestamp: serverTimestamp()
      });
      console.log("Berhasil mengirim tanggapan kuesioner!");
    } catch (e) {
      console.error("Gagal mengisi kuesioner:", e);
      alert("Terjadi kesalahan sistem saat mengirim tanggapan kuesioner.");
    }
  };

  const handleSendComment = async () => {
    const author = commentAuthor.trim();
    const message = inputComment.trim();

    if (!author || !message) return;

    if (!featuredNews?.id) {
      alert("Data pengumuman berita tidak valid.");
      return;
    }

    setCommentLoading(true);
    try {
      await addDoc(collection(db, "news_comments"), {
        newsId: featuredNews.id,
        userId: currentUserId || `guest-${Date.now()}`,
        userName: author,
        userRole: currentUser?.role || "guest",
        comment: message,
        createdAt: serverTimestamp()
      });
      setCommentAuthor("");
      setInputComment("");
      console.log("Komentar berhasil dikirim!");
    } catch (e) {
      console.error("Gagal mengirim tanggapan:", e);
      alert("Terjadi kesalahan sistem saat mengirim komentar.");
    } finally {
      setCommentLoading(false);
    }
  };

  const nextSlide = () => {
    if (newsData && newsData.length > 0) {
      setActiveIndex((prev) => (prev + 1) % newsData.length);
    }
  };

  const prevSlide = () => {
    if (newsData && newsData.length > 0) {
      setActiveIndex((prev) => (prev - 1 + newsData.length) % newsData.length);
    }
  };

  return (
    <div className="space-y-10">
      
      {/* =========================================================================
          HERO SECTION BARU: NEWS DASHBOARD SLIDER DENGAN SCROLL & FITUR INTERAKTIF
          ========================================================================= */}
      {newsData && newsData.length > 0 ? (
        <div className="w-full bg-[#0F0F0F] border border-white/10 font-mono text-white rounded-sm overflow-hidden">
          
          {/* HEADER MINI SUB-NAVBAR HERO SLIDER */}
          <div className="flex items-center justify-between bg-zinc-900/40 border-b border-white/10 px-4 py-2 text-[10px] tracking-wider text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-zinc-300 uppercase">{t("portalTag") || "LIVE NEWS INJECTOR"}</span>
            </div>
            <div className="uppercase hidden sm:block">
              TOTAL UPDATE: <span className="text-[#FFD700] font-bold">{newsData.length} DATA LOGS</span>
            </div>
          </div>

          {/* GRID SPLIT LAYOUT SLIDER & SIDEBAR FEED */}
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            
            {/* 1. BAGIAN UTAMA / TENGAH (HIGHLIGHT SLIDER BERITA UTAMA) */}
            {featuredNews && (
              <div className="lg:col-span-2 p-6 flex flex-col justify-between relative min-h-[340px] md:min-h-[380px] bg-gradient-to-br from-[#0F0F0F] to-zinc-950">
                <div className="absolute top-0 right-0 opacity-[0.03] blur-3xl bg-[#FFD700] w-64 h-64 rounded-full pointer-events-none"></div>
                
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-[9px] px-2 py-0.5 rounded-sm font-black tracking-widest uppercase ${
                      featuredNews.tag === "Event" ? "bg-purple-950/80 text-purple-400 border border-purple-800" :
                      featuredNews.tag === "Update" ? "bg-blue-950/80 text-blue-400 border border-blue-800" :
                      "bg-amber-950/80 text-[#FFD700] border border-[#FFD700]/40"
                    }`}>
                      {featuredNews.tag || "NEWS"}
                    </span>
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                      <Calendar className="h-3 w-3" />
                      {featuredNews.createdAt ? new Date(featuredNews.createdAt).toLocaleDateString(localeFormat) : "-"}
                    </div>
                  </div>

                  <h1 className="text-xl md:text-3xl font-serif font-black tracking-tight text-white uppercase border-b border-white/5 pb-3 leading-tight italic">
                    {featuredNews.title}
                  </h1>

                  <div className="max-h-[220px] overflow-y-auto pr-2 mt-4 custom-scrollbar bg-black/10 p-2">
                    <p className="text-zinc-300 text-xs font-sans leading-relaxed whitespace-pre-line text-justify">
                      {featuredNews.content}
                    </p>
                  </div>

                  {/* ================= QUIZ / KUESIONER RESUPON DI BAWAH KONTEN NEWS ================= */}
                  <div className="border border-white/5 bg-zinc-950/40 p-3 mt-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#FFD700]" />
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                        <ScrollText className="h-3.5 w-3.5 text-[#FFD700]" />
                        <span>Kuesioner Respon Member</span>
                      </div>
                      <p className="text-[11px] text-zinc-300 font-sans font-medium">
                        Bagaimana tanggapanmu mengenai informasi berita di atas? Apakah kamu setuju?
                      </p>
                      
                      <div className="grid grid-cols-2 gap-3 max-w-xs pt-0.5">
                        <button
                          type="button"
                          onClick={() => handleVote("agree")}
                          className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                            userVote === "agree"
                              ? "bg-emerald-600 border-emerald-500 text-white"
                              : "bg-zinc-900 border-white/5 text-zinc-400 hover:text-white hover:border-emerald-500/30"
                          }`}
                        >
                          <ThumbsUp className="h-3 w-3" />
                          Setuju {totalVotes > 0 && `(${Math.round((agreeVotes / totalVotes) * 100)}%)`}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleVote("disagree")}
                          className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                            userVote === "disagree"
                              ? "bg-red-600 border-red-500 text-white"
                              : "bg-zinc-900 border-white/5 text-zinc-400 hover:text-white hover:border-red-500/30"
                          }`}
                        >
                          <ThumbsDown className="h-3 w-3" />
                          Tidak Setuju {totalVotes > 0 && `(${Math.round((disagreeVotes / totalVotes) * 100)}%)`}
                        </button>
                      </div>

                      {totalVotes > 0 && (
                        <p className="text-[9px] font-mono text-zinc-500">
                          📊 Partisipasi: {totalVotes} log suara ({agreeVotes} Setuju, {disagreeVotes} Tidak Setuju)
                        </p>
                      )}
                    </div>
                  </div>

                  {/* ================= FITUR DISKUSI KOMENTAR NEWS AKTIF ================= */}
                  <div className="border border-white/5 bg-zinc-900/10 p-3 mt-4 space-y-3">
                    <div className="flex items-center gap-1.5 text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                      <MessageSquare className="h-3.5 w-3.5 text-amber-500" />
                      <span>Tanggapan Diskusi Pengumuman ({comments.length})</span>
                    </div>

                    <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1 bg-zinc-950/30 p-1.5">
                      {comments.length === 0 ? (
                        <p className="text-[10px] text-zinc-600 italic font-sans py-2 text-center">
                          Belum ada tanggapan masuk. Ketik opini pertamamu di bawah.
                        </p>
                      ) : (
                        comments.map((c) => {
                          const isAuthorizedToDelete = currentUser?.role === "admin" || currentUserId === c.userId;
                          return (
                            <div key={c.id} className="bg-zinc-950/80 p-2 border border-white/[0.02] flex justify-between gap-3 group">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-[10px] font-bold text-zinc-300">{c.userName}</span>
                                  <span className={`text-[6px] px-1 py-0.2 font-black uppercase ${
                                    c.userRole === "admin" ? "bg-red-600 text-white" : c.userRole === "premium" ? "bg-purple-600 text-white" : "bg-zinc-800 text-zinc-400"
                                  }`}>
                                    {c.userRole}
                                  </span>
                                </div>
                                <p className="text-[11px] text-zinc-400 mt-0.5 font-sans break-words">{c.comment}</p>
                              </div>
                              {isAuthorizedToDelete && (
                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (window.confirm("Hapus tanggapan diskusi ini?")) {
                                      await deleteDoc(doc(db, "news_comments", c.id));
                                    }
                                  }}
                                  className="opacity-0 group-hover:opacity-100 p-0.5 text-zinc-600 hover:text-red-400 self-start transition-opacity cursor-pointer"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Nama"
                        value={commentAuthor}
                        onChange={(e) => setCommentAuthor(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/10 px-2 py-1.5 text-xs text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-[#FFD700]"
                      />
                      <div className="flex items-center gap-1.5 bg-zinc-900 border border-white/10 p-1 focus-within:border-[#FFD700]/70 focus-within:bg-zinc-850 transition-all">
                        <input 
                          type="text"
                          placeholder="Pesan"
                          value={inputComment}
                          onChange={(e) => setInputComment(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") handleSendComment(); }}
                          className="w-full bg-transparent text-xs text-zinc-100 px-2 py-1.5 focus:outline-none placeholder-zinc-400 font-sans font-medium"
                        />
                        <button
                          type="button"
                          disabled={commentLoading || !commentAuthor.trim() || !inputComment.trim()}
                          onClick={handleSendComment}
                          className="p-1.5 bg-zinc-900 text-zinc-400 border border-white/5 hover:border-[#FFD700] hover:text-[#FFD700] disabled:opacity-20 cursor-pointer shrink-0 transition-all"
                        >
                          <Send className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Kontrol Navigasi Manual Bawah Slider */}
                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-6">
                  <span className="inline-flex items-center gap-2 text-xs font-bold text-[#FFD700] uppercase tracking-wider">
                    {t("newsTitle") || "BERITA TERBARU"}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-zinc-500 font-mono mr-2">{activeIndex + 1} / {newsData.length}</span>
                    <button 
                      onClick={prevSlide} 
                      className="p-1.5 bg-zinc-900/80 border border-white/10 hover:border-[#FFD700] hover:text-[#FFD700] transition-all cursor-pointer rounded-sm"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={nextSlide} 
                      className="p-1.5 bg-zinc-900/80 border border-white/10 hover:border-[#FFD700] hover:text-[#FFD700] transition-all cursor-pointer rounded-sm"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. BAGIAN SAMPING KANAN (DAFTAR SIDEBAR INDEX FEED LIST) */}
            <div className="p-4 bg-black/40 flex flex-col h-[340px] md:h-auto md:max-h-[380px]">
              <div className="text-[10px] font-black tracking-widest text-zinc-400 uppercase mb-3 flex items-center gap-2 border-b border-white/5 pb-2">
                <Newspaper className="h-3.5 w-3.5 text-[#FFD700]" /> {t("playlistTitle") ? "NEWS INDEX INDEX" : "LOG INDEKS BERITA"}
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {newsData.map((item, index) => {
                  const isSelected = index === activeIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveIndex(index)}
                      className={`w-full text-left p-2.5 border transition-all flex flex-col gap-1 rounded-sm cursor-pointer block outline-none ${
                        isSelected 
                          ? "bg-zinc-900 border-[#FFD700] shadow-sm translate-x-1" 
                          : "bg-zinc-900/20 border-white/5 hover:border-white/20 hover:bg-zinc-900/40"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded-sm uppercase ${
                          item.tag === "Event" ? "text-purple-400 bg-purple-950/40" :
                          item.tag === "Update" ? "text-blue-400 bg-blue-950/40" :
                          "text-[#FFD700] bg-amber-950/40"
                        }`}>
                          {item.tag || "Info"}
                        </span>
                        <span className="text-[9px] text-zinc-600">
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString(localeFormat, { day: 'numeric', month: 'short' }) : ""}
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
      ) : (
        <div className="relative overflow-hidden rounded-sm bg-[#0F0F0F] border border-white/10 p-8 md:p-12 text-center">
          <p className="text-xs text-zinc-500 font-mono italic">{t("newsEmpty") || "Belum ada log berita berkala yang dirilis."}</p>
        </div>
      )}

      {/* =========================================================================
          FEATURED VIDEO THEATER SECTION (TETAP DIPERTAHANKAN)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#FFD700] flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#FFD700] animate-ping"></span>
              {t("theaterTitle")}
            </h2>
            <span className="text-xs text-zinc-500 font-mono uppercase tracking-widest">{t("theaterStatus")}</span>
          </div>

          <div className="relative aspect-video rounded-sm overflow-hidden bg-black border border-white/10 group shadow-2xl">
            {activeVideo && activeVideo.url ? (
              <iframe
                id="youtube-embed"
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${getYouTubeId(activeVideo.url)}?autoplay=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 p-6 text-center">
                <Play className="h-16 w-16 text-[#FFD700] mb-2 animate-pulse" />
                <p className="font-serif italic text-white text-lg">{t("theaterEmpty")}</p>
              </div>
            )}
          </div>

          {activeVideo && (
            <div className="bg-zinc-900 border border-white/5 p-6 rounded-sm space-y-3">
              <div className="flex flex-wrap gap-2 items-center text-[10px] uppercase font-mono tracking-wider text-zinc-400">
                <span className="bg-[#FFD700] text-black px-2 py-0.5 rounded-sm font-bold">
                  {t("theaterTag")}
                </span>
                <span className="flex items-center gap-1 ml-auto">
                  <Calendar className="h-3 w-3 text-zinc-500" />
                  {activeVideo.createdAt ? new Date(activeVideo.createdAt).toLocaleDateString(localeFormat) : "-"}
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-serif font-black text-white italic tracking-tight">{activeVideo.title}</h3>
              <p className="text-zinc-400 text-xs font-mono break-all text-zinc-500">Source: {activeVideo.url}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 pb-2 border-b border-white/10 flex items-center justify-between">
            <span>{t("playlistTitle")}</span>
            <span className="text-xs font-mono text-[#FFD700] bg-zinc-900 border border-white/10 px-2.5 py-0.5 rounded-sm uppercase">
              {videoData.length} {t("playlistCountSuffix")}
            </span>
          </h2> 

          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {videoData.map((video) => {
              const isActive = activeVideo?.id === video.id;
              return (
                <button
                  key={video.id}
                  onClick={() => setActiveVideo(video)}
                  className={`w-full text-left p-4 rounded-sm transition-all border block outline-none cursor-pointer ${
                    isActive
                      ? "bg-zinc-900 border-[#FFD700] shadow-md shadow-[#FFD700]/5 translate-x-1"
                      : "bg-zinc-900/40 border-white/5 hover:border-[#FFD700]/40"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-sm mt-0.5 flex items-center justify-center ${
                      isActive 
                        ? "bg-[#FFD700] text-black font-bold" 
                        : "bg-zinc-800 text-zinc-400"
                    }`}>
                      <Play className="h-3 w-3" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="text-xs font-bold text-white leading-snug line-clamp-2 uppercase tracking-wide">
                        {video.title}
                      </h4>
                      <span className="text-[9px] font-mono text-zinc-500 block">
                        {t("addedText")}: {video.createdAt ? new Date(video.createdAt).toLocaleDateString(localeFormat) : "-"}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
            {videoData.length === 0 && (
              <p className="text-xs text-zinc-600 font-mono italic p-2">{t("playlistEmpty")}</p>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          DAFTAR FEED BERITA BAWAH (UNTUK ADSENSE/BACKUP)
          ========================================================================= */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#FFD700] pb-2 border-b border-white/10 flex items-center gap-2">
          <Newspaper className="h-4 w-4" />
          <span>{t("newsTitle")}</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {newsData.map((news) => (
            <div key={news.id} className="p-5 bg-zinc-900/60 border border-white/10 rounded-sm flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wide border-b border-white/5 pb-2 mb-2">{news.title}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans whitespace-pre-line">{news.content}</p>
              </div>
              <span className="text-[9px] text-zinc-600 font-mono mt-4 block">
                {t("publishedAt")}: {news.createdAt ? new Date(news.createdAt).toLocaleDateString(localeFormat) : "-"}
              </span>
            </div>
          ))}
          {newsData.length === 0 && (
            <div className="col-span-2 p-6 bg-zinc-900/20 border border-dashed border-white/5 text-center">
              <p className="text-xs text-zinc-600 font-mono italic">{t("newsEmpty")}</p>
            </div>
          )}
        </div>
      </div>

      {/* ROADMAP CARD INFO */}
      <div className="border border-white/10 bg-[#0F0F0F] p-6 md:p-8 rounded-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-serif font-bold text-white italic tracking-tight">{t("ctaTitle")}</h3>
            <p className="text-zinc-400 text-xs md:text-sm">{t("ctaDesc")}</p>
          </div>
          <button 
            type="button"
            className="group inline-flex items-center gap-2 bg-[#FFD700] text-black font-black uppercase tracking-widest text-xs py-3 px-6 rounded-none transition-all cursor-pointer shadow-lg hover:bg-white active:scale-95"
            onClick={onNavigateToResource}
          >
            <span>{t("ctaButton")}</span>
            <ChevronRight className="h-4 w-4 text-black group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

    </div>
  );
}