import { useState, useEffect } from "react";
import { LanguageProvider } from './data/LanguageContext';
import Navbar from "./components/Navbar";
import { db } from "./firebase"; 
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import AboutSection from "./components/AboutSection";
import FaqSection from "./components/FaqSection";
import AdminPanel from "./components/AdminPanel"; 
import LoginModal from "./components/LoginModal";
import PrivacyPolicySection from "./components/PrivacyPolicySection";
import { MemberProfile } from "./components/MemberSection";
import LiveChat from "./components/LiveChat"; // <--- Live Chat Tetap Dipakai
import { Sparkles, MessageSquare, ArrowDown, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home"); // 'home' | 'tutorial' | 'chat' | 'about' | 'privacy' | 'admin' | 'user'
  const [newsList, setNewsList] = useState<any[]>([]);
  const [tutorialList, setTutorialList] = useState<any[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [activeMemberData, setActiveMemberData] = useState<MemberProfile | null>(null);

  const getSortValue = (value: any) => {
    if (!value) return 0;
    if (typeof value?.toDate === "function") return value.toDate().getTime();
    if (value instanceof Date) return value.getTime();
    if (typeof value === "string") {
      const parsed = Date.parse(value);
      return Number.isNaN(parsed) ? 0 : parsed;
    }
    return Number(value) || 0;
  };

  // --- REALTIME SINKRONISASI DATABASE FIREBASE ---
  useEffect(() => {
    // 1. Ambil Hot News (Hasil autofeed.py atau Firestore)
    const qNews = query(collection(db, "news"), orderBy("createdAt", "desc"));
    const unsubscribeNews = onSnapshot(qNews, (snapshot) => {
      const news: any[] = [];
      snapshot.forEach((doc) => news.push({ id: doc.id, ...doc.data() }));

      const sortedNews = [...news].sort((a, b) => getSortValue(b.createdAt) - getSortValue(a.createdAt));
      setNewsList(sortedNews);
    });

    // 2. Ambil Tutorial (Manual Posting Admin)
    const qTutorials = query(collection(db, "tutorials"), orderBy("createdAt", "desc"));
    const unsubscribeTutorials = onSnapshot(qTutorials, (snapshot) => {
      const tuts: any[] = [];
      snapshot.forEach((doc) => tuts.push({ id: doc.id, ...doc.data() }));
      setTutorialList(tuts);
    });

    return () => {
      unsubscribeNews();
      unsubscribeTutorials();
    };
  }, []);

  // Update selected article ketika ganti tab antara Home & Tutorial
  useEffect(() => {
    setIsExpanded(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (activeTab === "home" && newsList.length > 0) {
      setSelectedArticle(newsList[0]);
    } else if (activeTab === "tutorial" && tutorialList.length > 0) {
      setSelectedArticle(tutorialList[0]);
    } else {
      setSelectedArticle(null);
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "home" && newsList.length > 0) {
      setSelectedArticle(newsList[0]);
    }
  }, [activeTab, newsList]);

  const handleLoginSuccess = (username: string, profileData?: MemberProfile) => {
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
    setActiveMemberData(profileData || null);
    if (profileData?.role === "admin") {
      setActiveTab("admin");
    }
  };

  const currentFeedList = activeTab === "tutorial" ? tutorialList : newsList;

  const handleAdminAccess = () => {
    if (isLoggedIn && activeMemberData?.role === "admin") {
      setActiveTab("admin");
      return;
    }

    setIsLoginModalOpen(true);
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#0F0F0F] text-[#E0E0E0] flex flex-col font-sans antialiased selection:bg-[#FFD700] selection:text-black">
        
        {/* NAVBAR */}
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
          
          {/* BANNER PROMO LIVE CHAT AI (Tampil di Home & Tutorial) */}
          {(activeTab === "home" || activeTab === "tutorial") && (
            <div className="mb-6 bg-black border border-[#FFD700]/30 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-[#FFD700] font-medium flex items-center gap-2 uppercase tracking-wide">
                <Sparkles className="h-4 w-4 animate-pulse flex-shrink-0 text-[#FFD700]" />
                <span>Have questions about AI & OpenToonz? Ask our AI tutor now!</span>
              </span>
              <button
                onClick={() => setActiveTab("chat")}
                className="text-[10px] font-black uppercase tracking-widest bg-[#FFD700] hover:bg-white active:scale-95 text-black px-4 py-2 flex items-center gap-1.5 transition-all cursor-pointer flex-shrink-0"
              >
                <MessageSquare className="h-3 w-3" />
                <span>Open Live Chat AI</span>
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* 🟢 HALAMAN HOME (NEWS) & TUTORIAL */}
              {(activeTab === "home" || activeTab === "tutorial") && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                  {/* 📌 MAIN FEED READER (8 Column) */}
                  <main className="lg:col-span-8 space-y-8 order-1">
                    
                    {/* 🌟 FULL ARTICLE DISPLAY (HERO) */}
                    {selectedArticle ? (
                      <article className="bg-black border border-zinc-800 p-6 sm:p-8 shadow-xl relative">
                        <div className="flex items-center space-x-2 text-xs text-[#FFD700] mb-3 font-mono">
                          <span className="bg-[#FFD700]/10 border border-[#FFD700]/30 px-2 py-0.5 uppercase tracking-wider text-[10px]">
                            {selectedArticle.category || (activeTab === "tutorial" ? "Tutorial" : "Hot News")}
                          </span>
                          <span>•</span>
                          <span className="text-zinc-500">
                            {selectedArticle.createdAt 
                              ? new Date(selectedArticle.createdAt?.toDate ? selectedArticle.createdAt.toDate() : selectedArticle.createdAt).toLocaleDateString("en-US", { day: 'numeric', month: 'long', year: 'numeric' })
                              : "Latest"}
                          </span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-black text-white leading-snug mb-4 uppercase tracking-tight">
                          {selectedArticle.title}
                        </h1>

                        <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-6 font-light">
                          {selectedArticle.excerpt || selectedArticle.description}
                        </p>

                        <hr className="border-zinc-800 my-6" />

                        {/* Article Content / Body */}
                        <div className={`prose prose-invert max-w-none text-zinc-300 text-sm leading-relaxed space-y-4 font-sans ${
                          !isExpanded ? "line-clamp-6 overflow-hidden" : ""
                        }`}>
                          {(selectedArticle.content || selectedArticle.description || "").split('\n').map((para: string, i: number) => (
                            <p key={i}>{para}</p>
                          ))}
                        </div>

                        {/* Read More Toggle */}
                        {!isExpanded && (
                          <div className="pt-6">
                            <button
                              onClick={() => setIsExpanded(true)}
                              className="w-full py-3 bg-[#FFD700] text-black font-black uppercase text-xs tracking-widest hover:bg-white active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <span>Read Full Article</span>
                              <ArrowDown className="h-4 w-4" />
                            </button>
                          </div>
                        )}

                        {selectedArticle.source_url && (
                          <div className="mt-8 pt-4 border-t border-zinc-800 text-[11px] font-mono text-zinc-500 flex justify-between items-center">
                            <span>Source: News Portal</span>
                            <a 
                              href={selectedArticle.source_url} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-[#FFD700] hover:underline flex items-center gap-1"
                            >
                              <span>Original Site</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        )}
                      </article>
                    ) : (
                      <div className="p-12 text-center bg-black border border-zinc-800 text-zinc-500 font-mono text-xs">
                        No content available yet.
                      </div>
                    )}

                    {/* 📚 LIST JUDUL ARTIKEL SEBELUMNYA (CLICKABLE) */}
                    <section className="space-y-4">
                      <h2 className="text-xs font-mono font-bold text-[#FFD700] uppercase tracking-widest border-l-2 border-[#FFD700] pl-3">
                        {activeTab === "tutorial" ? "More Tutorials" : "Related News"}
                      </h2>

                      <div className="space-y-2">
                        {currentFeedList.map((art) => (
                          <div
                            key={art.id}
                            onClick={() => {
                              setSelectedArticle(art);
                              setIsExpanded(false);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className={`p-4 border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                              selectedArticle?.id === art.id
                                ? "bg-zinc-900 border-[#FFD700]"
                                : "bg-black border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/50"
                            }`}
                          >
                            <div>
                              <span className="text-[9px] font-mono text-[#FFD700] uppercase tracking-wider block mb-0.5">
                                {art.category || "General"}
                              </span>
                              <h3 className="font-bold text-white text-xs sm:text-sm hover:text-[#FFD700] transition">
                                {art.title}
                              </h3>
                            </div>
                            <span className="text-[10px] font-mono text-zinc-500 whitespace-nowrap">
                              {art.createdAt 
                                ? new Date(art.createdAt?.toDate ? art.createdAt.toDate() : art.createdAt).toLocaleDateString("en-US", { day: 'numeric', month: 'short' })
                                : ""}
                            </span>
                          </div>
                        ))}
                      </div>
                    </section>
                  </main>

                  {/* 📌 RIGHT SIDEBAR ADSENSE (4 Column) */}
                  <aside className="lg:col-span-4 order-2">
                    <div className="lg:sticky lg:top-24 space-y-6">
                      <div className="text-[10px] font-mono text-[#FFD700]/70 uppercase tracking-widest border-b border-zinc-800 pb-1">
                        Sponsored / Advertisements
                      </div>

                      {[1, 2, 3].map((box) => (
                        <div
                          key={box}
                          className="w-full h-64 bg-black border border-zinc-800 flex flex-col items-center justify-center p-4 text-center hover:border-zinc-700 transition"
                        >
                          <span className="text-[10px] font-mono text-[#FFD700] border border-[#FFD700]/30 px-2 py-0.5 mb-2">
                            Google Adsense Spot #{box}
                          </span>
                          <p className="text-[11px] text-zinc-500">Responsive Ad Unit</p>
                        </div>
                      ))}
                    </div>
                  </aside>
                </div>
              )}

              {/* 🟢 FITUR LIVE CHAT (TANPA KUNCI LOGIN) */}
              {activeTab === "chat" && <LiveChat />}

              {/* 🟢 TAB LAINNYA */}
              {activeTab === "about" && <AboutSection />}
              {activeTab === "faq" && <FaqSection setActiveTab={setActiveTab} currentUser={activeMemberData} />}
              {activeTab === "privacy" && <PrivacyPolicySection />}

              {activeTab === "admin" && (
                isLoggedIn && activeMemberData?.role === "admin" ? (
                  <AdminPanel />
                ) : (
                  <div className="p-8 border border-red-500/30 bg-black text-center max-w-md mx-auto my-12 font-mono">
                    <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-3">⚠️ AKSES KHUSUS ADMIN</p>
                    <button 
                      onClick={handleAdminAccess}
                      className="px-4 py-2 bg-[#FFD700] text-black font-bold text-xs uppercase tracking-wider cursor-pointer hover:bg-white"
                    >
                      {isLoggedIn ? "Akses ditolak" : "Login Sebagai Admin"}
                    </button>
                  </div>
                )
              )}

            </motion.div>
          </AnimatePresence>
        </main>

        {/* FOOTER LEGALITAS ADSENSE */}
        <footer className="px-8 py-6 bg-black border-t border-zinc-800 text-zinc-400 flex flex-col md:flex-row justify-between items-center mt-16 font-mono text-[10px] gap-4">
          <div className="font-bold uppercase tracking-widest text-[#FFD700]">
            © {new Date().getFullYear()} Bang Bro Media — OpenToonz & AI Authority
          </div>
          <div className="flex gap-6 font-bold uppercase text-[9px]">
            <button onClick={() => setActiveTab("about")} className="hover:underline cursor-pointer">About Us</button>
            <button onClick={() => setActiveTab("privacy")} className="hover:underline cursor-pointer">Privacy Policy</button>
            <button onClick={() => setActiveTab("faq")} className="hover:underline cursor-pointer">Contact / FAQ</button>
          </div>
        </footer>

        {/* LOGIN MODAL KHUSUS ADMIN */}
        <LoginModal 
          isOpen={isLoginModalOpen} 
          onLoginSuccess={handleLoginSuccess} 
          onClose={() => setIsLoginModalOpen(false)} 
        />

      </div>
    </LanguageProvider>
  );
}