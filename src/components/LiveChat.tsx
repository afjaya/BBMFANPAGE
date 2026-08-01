// src/components/LiveChat.tsx

import { useState, useRef, useEffect, FormEvent } from "react";
import { ChatMessage } from "../types";
import { Send, HelpCircle, Bot, User, Trash2, Sparkles } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { askGeminiBangBro } from "../services/gemini";
import { useLanguage } from "../data/LanguageContext";

export default function LiveChat() {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Inisialisasi atau update pesan sambutan pertama secara dinamis mengikuti bahasa aktif
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length <= 1) {
        return [
          {
            id: "init-01",
            role: "model",
            content: t("chatInit"),
            timestamp: new Date(),
          },
        ];
      }
      return prev;
    });
  }, [language]);

  // Transliterasi Suggestion Chips
  const suggestionChips = [
    t("chipRig"),
    t("chipFFmpeg"),
    t("chipLevel"),
    t("chipFx"),
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const [messageCount, setMessageCount] = useState(messages.length);

useEffect(() => {
  // Kita cek apakah ada pesan baru yang masuk ke dalam array
  if (messages.length > messageCount) {
    const lastMessage = messages[messages.length - 1];

    // Jika yang masuk adalah pesan dari USER, atau pesan pertama kali dari BOT/SYSTEM, baru kita scroll ke bawah
    if (lastMessage.role === "user" || messages.length === 2) {
      scrollToBottom();
    }
    
    // Update jumlah pesan terakhir
    setMessageCount(messages.length);
  }
}, [messages, messageCount]);

// Jalankan scroll ke bawah sekali saja saat AI sedang bersiap memikirkan jawaban (loading mulai menyala)
useEffect(() => {
  if (isLoading) {
    scrollToBottom();
  }
}, [isLoading]);

  const sendMessageToAPI = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputVal("");
    setIsLoading(true);

    try {
  let historyPayload = [...messages, userMessage].filter(
    (msg) => msg.role === "user" || msg.role === "model"
  );

  // TRIK INSTAN: Suntikkan instruksi bahasa paksa di awal array payload sebelum ditembak ke API
  const languageInstruction: ChatMessage = {
    id: `lang-instruction`,
    role: "user", // Gunakan 'user' jika backend Anda memfilter ketat role system
    content: language === "en" 
      ? "[SYSTEM NOTE: From now on, please respond entirely in English with a friendly animator tutor style!]" 
      : "[SYSTEM NOTE: Mulai sekarang, jawablah menggunakan Bahasa Indonesia dengan gaya santai khas Bang Bro!]",
    timestamp: new Date()
  };

  // Masukkan instruksi di urutan pertama history agar AI sadar context bahasa terbaru
  historyPayload = [languageInstruction, ...historyPayload];

  // Todong AI dengan payload yang sudah disisipi instruksi bahasa
  const aiResponseText = await askGeminiBangBro(historyPayload,);
      
      const responseMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "model",
        content: aiResponseText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, responseMessage]);
    } catch (err: any) {
      console.error("Chat error:", err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "system",
        content: t("chatErrConn"),
        timestamp: new Date(),
        status: "error",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessageToAPI(inputVal);
  };

  const clearChatHistory = () => {
    if (window.confirm(t("chatConfirmClear"))) {
      setMessages([
        {
          id: `init-${Date.now()}`,
          role: "model",
          content: t("chatCleared"),
          timestamp: new Date(),
        }
      ]);
    }
  };

  const renderFormattedMessage = (content: string) => {
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="text-[#FFD700] font-extrabold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-14rem)] min-h-[500px]">
      
      {/* Side info panel */}
      <div className="lg:col-span-1 bg-zinc-900 border border-white/5 p-6 rounded-none flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-black border border-white/10 text-[#FFD700] rounded-none">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-serif font-black text-white tracking-tight text-base uppercase italic">{t("chatSideTitle")}</h3>
              <p className="text-[9px] text-[#FFD700] font-mono uppercase tracking-wider">{t("chatSideSub")}</p>
            </div>
          </div>

          <div className="h-px bg-white/10"></div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-300 font-mono uppercase tracking-widest">{t("chatSideTopics")}</h4>
            <ul className="space-y-2 font-sans text-xs">
              <li className="text-zinc-400 flex items-start gap-2">
                <span className="text-[#FFD700] font-bold">•</span>
                <span>{t("chatSideT1")}</span>
              </li>
              <li className="text-zinc-400 flex items-start gap-2">
                <span className="text-[#FFD700] font-bold">•</span>
                <span>{t("chatSideT2")}</span>
              </li>
              <li className="text-zinc-400 flex items-start gap-2">
                <span className="text-[#FFD700] font-bold">•</span>
                <span>{t("chatSideT3")}</span>
              </li>
              <li className="text-zinc-400 flex items-start gap-2">
                <span className="text-[#FFD700] font-bold">•</span>
                <span>{t("chatSideT4")}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Live Active Status box */}
        <div className="space-y-4 pt-4 border-t border-white/5">
          <div className="bg-black p-4 rounded-none space-y-3 border border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">{t("chatStatus")}</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-none text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 uppercase tracking-widest">
                <span className="h-1 w-1 rounded-full bg-emerald-400 animate-ping"></span>
                ONLINE
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">{t("chatSpeed")}</span>
              <span className="text-[11px] text-zinc-300 font-bold uppercase tracking-widest">{t("chatSpeedVal")}</span>
            </div>
          </div>

          <button
            onClick={clearChatHistory}
            className="w-full py-2 bg-black hover:bg-zinc-900 text-zinc-500 hover:text-red-400 border border-white/5 rounded-none text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>{t("chatClearBtn")}</span>
          </button>
        </div>
      </div>

      {/* Primary chat layout console */}
      <div className="lg:col-span-3 bg-zinc-900/30 border border-white/5 rounded-none flex flex-col overflow-hidden h-full shadow-2xl">
        
        {/* Chat Console Header */}
        <div className="px-6 py-4 bg-zinc-900 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-none bg-[#FFD700] text-black flex items-center justify-center font-serif font-black italic text-lg shadow-md">
                BB
              </div>
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-black"></div>
            </div>
            <div>
              <h3 className="font-serif font-black text-white text-base leading-none uppercase italic">Bang Bro Support</h3>
              <p className="text-[10px] text-[#FFD700] font-mono mt-1 flex items-center gap-1 uppercase tracking-widest">
                <Sparkles className="h-3 w-3 text-[#FFD700]" />
                {t("chatSubTitle")}
              </p>
            </div>
          </div>
        </div>

        {/* Message Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-zinc-850">
          {messages.map((msg) => {
            const isBot = msg.role === "model";
            const isSystem = msg.role === "system";
            
            if (isSystem) {
              return (
                <div key={msg.id} className="mx-auto text-center max-w-sm">
                  <span className="inline-flex bg-red-950/20 border border-red-900/30 px-3 py-1.5 rounded-none text-[11px] text-red-400 uppercase font-mono">
                    {msg.content}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isBot ? "" : "ml-auto flex-row-reverse"}`}
              >
                {/* Avatar Icon */}
                <div className={`p-2 rounded-none h-9 w-9 flex items-center justify-center flex-shrink-0 border ${
                  isBot 
                    ? "bg-black text-[#FFD700] border-white/10" 
                    : "bg-zinc-800 text-zinc-300 border-white/5"
                }`}>
                  {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>

                {/* Message Bubble container */}
                <div className={`p-4 rounded-none text-xs md:text-sm leading-relaxed space-y-1.5 ${
                  isBot
                    ? "bg-zinc-900 text-zinc-200 border border-white/5"
                    : "bg-[#FFD700] text-black font-semibold"
                }`}>
                  <p className="whitespace-pre-line">{isBot ? renderFormattedMessage(msg.content) : msg.content}</p>
                  <span className={`block text-[9px] font-mono text-right ${isBot ? "text-zinc-500" : "text-black/60"}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Simulated loader typing */}
          {isLoading && (
            <div className="flex gap-3 max-w-[80%]">
              <div className="p-2 rounded-none h-9 w-9 flex items-center justify-center flex-shrink-0 bg-black text-[#FFD700] border border-white/10">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-zinc-900 text-zinc-400 p-4 rounded-none flex items-center gap-1.5 border border-white/5">
                <span className="dot animate-bounce bg-zinc-400 h-1.5 w-1.5 rounded-full inline-block"></span>
                <span className="dot animate-bounce bg-zinc-400 h-1.5 w-1.5 rounded-full inline-block [animation-delay:0.2s]"></span>
                <span className="dot animate-bounce bg-zinc-400 h-1.5 w-1.5 rounded-full inline-block [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Quick Chips */}
        <div className="px-6 py-2.5 bg-black border-t border-white/5 flex flex-wrap gap-2 items-center overflow-x-auto select-none no-scrollbar">
          <HelpCircle className="h-3.5 w-3.5 text-zinc-500 flex-shrink-0" />
          {suggestionChips.map((chip, i) => (
            <button
              key={i}
              type="button"
              disabled={isLoading}
              onClick={() => sendMessageToAPI(chip)}
              className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-[#FFD700] bg-zinc-900 border border-white/5 hover:border-[#FFD700]/30 px-2.5 py-1 rounded-none transition-all whitespace-nowrap cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Bottom Submission Form */}
        <div className="p-4 bg-black border-t border-white/5">
          <form onSubmit={handleFormSubmit} className="flex gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              disabled={isLoading}
              placeholder={t("chatPlaceholder")}
              className="flex-1 bg-zinc-900 border border-white/10 rounded-none px-4 py-3 text-xs md:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFD700]"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isLoading}
              className="px-5 bg-[#FFD700] hover:bg-white disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-black uppercase tracking-wider rounded-none transition-all flex items-center justify-center cursor-pointer active:scale-95"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}