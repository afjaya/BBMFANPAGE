// src/components/Navbar.tsx
import { MessageSquare, BookOpen, Users, HelpCircle, Flame, Menu, X, Shield, Languages } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "../data/LanguageContext";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(
    280 + Math.floor(Math.random() * 30)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers((prev) => {
        const change = Math.floor(Math.random() * 7) - 3;
        return Math.max(250, Math.min(350, prev + change));
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // 🟢 NAV ITEMS DISESUAIKAN DENGAN SKEMA BARU
  const navItems = [
    { id: "home", label: "Hot News", icon: Flame },
    { id: "tutorial", label: "Tutorials", icon: BookOpen },
    { id: "chat", label: t("liveChat") || "Live Chat AI", icon: MessageSquare, badge: "AI" },
    { id: "about", label: t("about") || "About", icon: Users },
    { id: "faq", label: t("faq") || "FAQ", icon: HelpCircle },
    { id: "admin", label: "Admin Panel", icon: Shield },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#0F0F0F]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand */}
          <div 
            onClick={() => { setActiveTab("home"); setMobileMenuOpen(false); }}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="bg-[#FFD700] p-2 rounded-sm text-black shadow-lg shadow-[#FFD700]/10 group-hover:scale-105 transition-transform">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xl font-serif font-black tracking-tighter text-white block uppercase italic">
                Bang Bro <span className="text-[#FFD700] not-italic">Media</span>
              </span>
              <span className="text-[9px] text-[#FFD700] font-mono tracking-widest -mt-1 block">
                OPENTOONZ & AI AUTHORITY
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-none text-xs font-semibold tracking-wider uppercase transition-all relative ${
                    isActive
                      ? "text-[#FFD700] border-b-2 border-[#FFD700]"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? "text-[#FFD700]" : "text-zinc-500"}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.5 text-[8px] font-black bg-[#FFD700] text-black rounded-sm animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sisi Kanan Desktop: Online Counter & Switcher Bahasa */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Online Counter */}
            <div className="flex items-center space-x-2 bg-zinc-900/80 border border-white/10 py-1.5 px-3 rounded-none">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] text-zinc-400 font-mono tracking-wider uppercase">
                <span className="text-[#FFD700] font-bold">{onlineUsers}</span> {(t as any)("onlineUsers") || "ONLINE"}
              </span>
            </div>

            {/* Language Toggle Switch */}
            <div className="flex items-center border border-white/10 p-0.5 bg-zinc-900 font-mono text-[10px] font-bold">
              <button 
                onClick={() => setLanguage("en")}
                className={`px-2 py-1 transition-all ${language === "en" ? "bg-[#FFD700] text-black" : "text-zinc-400 hover:text-white"}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage("id")}
                className={`px-2 py-1 transition-all ${language === "id" ? "bg-[#FFD700] text-black" : "text-zinc-400 hover:text-white"}`}
              >
                ID
              </button>
            </div>
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden flex items-center space-x-2">
            <button 
              onClick={() => setLanguage(language === "en" ? "id" : "en")}
              className="text-zinc-400 hover:text-white p-2 border border-white/5 bg-zinc-900/50 flex items-center gap-1 text-[10px] font-mono uppercase font-bold"
            >
              <Languages className="h-3.5 w-3.5 text-[#FFD700]" />
              {language}
            </button>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-zinc-400 hover:text-white p-2 rounded-none hover:bg-zinc-900/50"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F0F0F] border-b border-white/10 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center w-full space-x-3 px-4 py-3 rounded-none text-left font-bold text-xs uppercase tracking-wider transition-all ${
                  isActive
                    ? "bg-zinc-900 text-[#FFD700] border-l-4 border-[#FFD700]"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[8px] font-black bg-[#FFD700] text-black rounded-sm">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          
          <div className="pt-3 border-t border-white/5 flex items-center justify-between px-4">
            <span className="text-[10px] uppercase text-zinc-500 tracking-wider">Status Komunitas</span>
            <span className="text-[10px] font-mono uppercase text-emerald-400 bg-emerald-950/40 border border-emerald-900/40 px-2 py-0.5 rounded-none flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-emerald-400"></span>
              {onlineUsers} {(t as any)("onlineUsers") || "ONLINE"}
            </span>
          </div>
        </div>
      )}
    </nav>
  );
}