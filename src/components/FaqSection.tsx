import { useState, useEffect } from "react";
import { FAQ_ITEMS } from "../data/tutorials";
import { 
  HelpCircle, 
  ChevronRight, 
  ChevronDown, 
  Sparkles, 
  BookOpen, 
  MessageSquare, 
  Send, 
  Trash2, 
  MessageCircleQuestion, 
  Users2 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
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
  serverTimestamp 
} from "firebase/firestore";

interface FaqSectionProps {
  setActiveTab: (tab: string) => void;
  currentUser?: {
    uid?: string;
    id?: string;
    displayName?: string;
    name?: string;
    role?: string;
  } | null;
}

type CategoryKey = "catAll" | "catInstall" | "catLevel" | "catRigging" | "catRender";

export default function FaqSection({ setActiveTab, currentUser }: FaqSectionProps) {
  const { t, language } = useLanguage();
  const [openId, setOpenId] = useState<string | null>("faq-01");
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("catAll");

  const [faqComments, setFaqComments] = useState<any[]>([]);
  const [newCommentAuthor, setNewCommentAuthor] = useState<{ [faqId: string]: string }>({});
  const [newCommentMessage, setNewCommentMessage] = useState<{ [faqId: string]: string }>({});
  const [commentLoading, setCommentLoading] = useState(false);

  const categories: CategoryKey[] = ["catAll", "catInstall", "catLevel", "catRigging", "catRender"];

  useEffect(() => {
    const q = query(collection(db, "faq_comments"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFaqComments(commentsData);
    }, (error) => {
      console.error("Gagal sinkronisasi komentar:", error);
    });
    return () => unsubscribe();
  }, []);

  const handleSendComment = async (faqId: string) => {
    const author = newCommentAuthor[faqId]?.trim();
    const text = newCommentMessage[faqId]?.trim();
    if (!author || !text) return;

    setCommentLoading(true);
    try {
      await addDoc(collection(db, "faq_comments"), {
        faqId,
        userId: currentUser?.uid || currentUser?.id || `guest-${Date.now()}`,
        userName: author,
        userRole: currentUser?.role || "guest",
        comment: text,
        createdAt: serverTimestamp()
      });
      setNewCommentAuthor(prev => ({ ...prev, [faqId]: "" }));
      setNewCommentMessage(prev => ({ ...prev, [faqId]: "" }));
    } catch (error) {
      console.error(error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm("Hapus komentar ini dari ruang diskusi?")) {
      try { await deleteDoc(doc(db, "faq_comments", commentId)); } catch (e) { console.error(e); }
    }
  };

  const filteredFaqs = activeCategory === "catAll"
    ? FAQ_ITEMS
    : FAQ_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <div className="space-y-12">
      
      {/* ================= HERO SECTION (SEXY & CINEMATIC) ================= */}
      <div className="relative text-center max-w-4xl mx-auto py-12 px-4 overflow-hidden border border-white/[0.03] bg-zinc-950/40 backdrop-blur-md">
        {/* Efek Pendaran Cahaya Emas di Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#FFD700]/5 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900/80 border border-white/5 text-[10px] uppercase font-black tracking-widest text-[#FFD700]">
            <Sparkles className="h-3 w-3 animate-pulse" /> {t("faqTitlePre") || "Kumpulan"} Info Teater
          </div>
          
          <h2 className="text-4xl md:text-6xl font-serif font-black text-white uppercase tracking-tight leading-none">
            Center of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-amber-200 to-[#FFD700] italic not-uppercase lowercase first-letter:uppercase">Knowledge</span>
          </h2>
          
          <p className="text-xs md:text-sm text-zinc-400 font-sans max-w-2xl mx-auto leading-relaxed pt-2">
            {t("faqDesc") || "Temukan jawaban instan seputar instalasi perangkat, konfigurasi tingkat lanjut, rigging model, hingga optimalisasi render teater di bawah ini."}
          </p>

          {/* Mini Statistik Ringkas */}
          <div className="flex items-center justify-center gap-6 pt-4 text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><MessageCircleQuestion className="h-3.5 w-3.5 text-zinc-600" /> {FAQ_ITEMS.length} Topik Utama</span>
            <span className="h-3 w-[1px] bg-white/10" />
            <span className="flex items-center gap-1.5"><Users2 className="h-3.5 w-3.5 text-zinc-600" /> Realtime Diskusi</span>
          </div>
        </div>
      </div>

      {/* Kategori Filter Tabs */}
      <div className="flex flex-wrap gap-2 justify-center max-w-3xl mx-auto">
        {categories.map((catKey) => (
          <button
            key={catKey}
            onClick={() => { setActiveCategory(catKey); setOpenId(null); }}
            className={`px-4 py-2.5 rounded-none text-[10px] font-black uppercase tracking-widest border transition-all duration-300 cursor-pointer ${
              activeCategory === catKey
                ? "bg-[#FFD700] text-black border-[#FFD700] shadow-lg shadow-[#FFD700]/10 font-black"
                : "bg-zinc-950/60 border-white/5 text-zinc-400 hover:text-white hover:border-amber-500/50"
            }`}
          >
            {t(catKey)}
          </button>
        ))}
      </div>

      {/* ================= FAQ ACCORDION + SECTOR KOMENTAR ================= */}
      <div className="max-w-4xl mx-auto space-y-4 px-2">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            const questionText = faq.question[language as "id" | "en"] || faq.question.id;
            const answerText = faq.answer[language as "id" | "en"] || faq.answer.id;
            const currentFaqComments = faqComments.filter(c => c.faqId === faq.id);

            return (
              <div
                key={faq.id}
                className={`rounded-none transition-all duration-300 border ${
                  isOpen
                    ? "bg-[#09090b] border-amber-500/80 shadow-xl shadow-black/80"
                    : "bg-zinc-900/20 border-white/[0.03] hover:border-white/10"
                }`}
              >
                {/* Tombol Pertanyaan Klik */}
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-bold text-white cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[9px] font-mono font-black tracking-wider text-[#FFD700] uppercase px-2 py-0.5 bg-zinc-950 border border-white/5 shrink-0">
                      {t(faq.category)}
                    </span>
                    <span className="text-xs md:text-sm tracking-tight font-sans text-zinc-200 group-hover:text-white transition-colors truncate">
                      {questionText}
                    </span>
                  </div>
                  <div className="shrink-0">
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4 text-[#FFD700]" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-zinc-500 group-hover:text-zinc-300" />
                    )}
                  </div>
                </button>

                {/* Area Konten Jawaban & Komentar dengan Framer Motion */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 pb-5 pt-1 space-y-5 border-t border-white/[0.03]">
                        {/* Blok Teks Jawaban */}
                        <p className="text-xs md:text-[13px] text-zinc-400 font-sans leading-relaxed bg-zinc-950/40 p-3.5 border border-white/[0.02] text-justify">
                          {answerText}
                        </p>
                        
                        {/* Live Support CTA Link */}
                        <div className="bg-zinc-950 border border-white/5 px-3 py-2 inline-flex items-center gap-2 text-[10px] font-mono text-zinc-500">
                          <BookOpen className="h-3.5 w-3.5 text-[#FFD700]" />
                          <span>
                            {t("faqCtaPre") || "Butuh bantuan lebih intens?"}
                            <button
                              type="button"
                              onClick={() => setActiveTab("chat")}
                              className="text-[#FFD700] uppercase font-black hover:underline cursor-pointer inline mx-1"
                            >
                              Live Support Chat
                            </button>
                            {t("faqCtaPost") || "sekarang juga."}
                          </span>
                        </div>

                        {/* --- KELOMPOK KOLOM KOMENTAR PREMIUM --- */}
                        <div className="pt-4 border-t border-white/5 space-y-3">
                          <div className="flex items-center justify-between text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                            <span className="flex items-center gap-1.5 text-zinc-400">
                              <MessageSquare className="h-3.5 w-3.5 text-amber-500" />
                              Ruang Diskusi Member
                            </span>
                            <span className="bg-zinc-900 px-2 py-0.5 text-zinc-400 border border-white/5 font-mono font-bold">
                              {currentFaqComments.length} Pesan
                            </span>
                          </div>

                          {/* Box Alur List Chat Komentar */}
                          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 bg-zinc-950/20 p-1 border border-white/[0.02]">
                            {currentFaqComments.length === 0 ? (
                              <p className="text-[10px] text-zinc-600 font-sans italic py-3 text-center">
                                Belum ada riwayat diskusi untuk topik ini.
                              </p>
                            ) : (
                              currentFaqComments.map((c) => {
                                const isOwnerOrAdmin = currentUser?.role === "admin" || currentUser?.uid === c.userId || currentUser?.id === c.userId;
                                return (
                                  <div key={c.id} className="bg-zinc-950/80 p-2 border border-white/[0.03] flex justify-between gap-3 group transition-colors hover:border-white/5">
                                    <div className="flex-1 space-y-0.5 min-w-0">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="text-[10px] font-bold text-zinc-300 font-sans">{c.userName}</span>
                                        <span className={`text-[7px] px-1 py-0 font-black tracking-wider uppercase ${
                                          c.userRole === "admin" ? "bg-red-600 text-white" : c.userRole === "premium" ? "bg-purple-600 text-white" : "bg-zinc-800 text-zinc-400"
                                        }`}>
                                          {c.userRole || "member"}
                                        </span>
                                      </div>
                                      <p className="text-xs text-zinc-400 font-sans leading-relaxed break-words">{c.comment}</p>
                                    </div>
                                    {isOwnerOrAdmin && (
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteComment(c.id)}
                                        className="opacity-0 group-hover:opacity-100 p-1 text-zinc-600 hover:text-red-400 transition-opacity cursor-pointer self-start"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    )}
                                  </div>
                                );
                              })
                            )}
                          </div>

                          {/* Kolom Input Text Pengiriman */}
                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="Nama"
                              value={newCommentAuthor[faq.id] || ""}
                              onChange={(e) => setNewCommentAuthor({ ...newCommentAuthor, [faq.id]: e.target.value })}
                              className="w-full bg-zinc-950 border border-white/5 px-2 py-2 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500/50"
                            />
                            <div className="flex items-center gap-1 bg-zinc-950 border border-white/5 p-1 focus-within:border-amber-500/50 transition-colors">
                              <input 
                                type="text"
                                placeholder="Pesan"
                                value={newCommentMessage[faq.id] || ""}
                                onChange={(e) => setNewCommentMessage({ ...newCommentMessage, [faq.id]: e.target.value })}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleSendComment(faq.id); }}
                                className="w-full bg-transparent text-xs text-white px-2 py-2 focus:outline-none placeholder-zinc-700 font-sans"
                              />
                              <button
                                type="button"
                                disabled={commentLoading || !newCommentAuthor[faq.id]?.trim() || !newCommentMessage[faq.id]?.trim()}
                                onClick={() => handleSendComment(faq.id)}
                                className="p-2 bg-zinc-900 text-zinc-400 border border-white/5 hover:border-[#FFD700] hover:text-[#FFD700] disabled:opacity-20 disabled:hover:border-white/5 disabled:hover:text-zinc-400 cursor-pointer shrink-0 transition-all duration-200"
                              >
                                <Send className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 text-zinc-600 bg-zinc-950/20 border border-white/5 p-8">
            <Sparkles className="h-8 w-8 text-zinc-800 animate-spin mx-auto mb-2" />
            <p className="text-xs font-mono uppercase tracking-wider">{t("faqEmpty") || "Topik tidak ditemukan."}</p>
          </div>
        )}
      </div>

    </div>
  );
}