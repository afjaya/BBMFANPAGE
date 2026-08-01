import { useState } from "react";
import { User, Award, Flame, Palette, Shield, ExternalLink, LogOut } from "lucide-react";

// 1. DEKLARASI PROPS: Biar TypeScript tahu komponen ini menerima data status & fungsi logout
interface UserSectionProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

export default function UserSection({ isLoggedIn, onLogout }: UserSectionProps) {
  // State simulasi data profil pengguna / creator
  const [profile] = useState({
    name: "Rijal Rijal",
    role: "2D Animator & Creator",
    organization: "Alfiali Jaya Group",
    location: "Denpasar, Indonesia",
    level: "Local Guide & OpenToonz Enthusiast",
    joinedDate: "Mei 2026",
    stats: [
      { label: "Project Animasi", value: "12+", icon: Flame },
      { label: "Level Keahlian", value: "Pro", icon: Award },
      { label: "Aset Kreatif", value: "8", icon: Palette },
    ],
    skills: ["2D Loop Animation", "Plastic & Bone Rigging", "Schematic Nodes FX", "Vector Drawing"]
  });

  return (
    <div className="space-y-8">
      {/* Header Tab */}
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-3xl md:text-4xl font-serif font-black text-white italic tracking-tight">
          Ruang Kreatif: <span className="text-[#FFD700] not-italic">Profil Kreator</span>
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          Kelola informasi profil, pantau statistik belajar, dan lencana kontribusi kamu di OpenToonz Indonesia.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Avatar & Name */}
        <div className="bg-[#0F0F0F] border border-white/10 p-6 flex flex-col items-center text-center justify-center space-y-4 rounded-none relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#FFD700]"></div>
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#FFD700]"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#FFD700]"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#FFD700]"></div>

          <div className="w-24 h-24 bg-zinc-900 border-2 border-[#FFD700] rounded-none flex items-center justify-center shadow-lg shadow-[#FFD700]/5">
            <User className="h-12 w-12 text-[#FFD700]" />
          </div>

          <div className="space-y-1 w-full">
            <h3 className="text-xl font-serif font-black text-white uppercase tracking-wide">{profile.name}</h3>
            <p className="text-xs font-mono text-[#FFD700] uppercase tracking-widest">{profile.role}</p>
            <p className="text-[11px] text-zinc-500 font-sans">{profile.organization} • {profile.location}</p>
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-900 border border-white/5 text-[10px] font-mono text-zinc-400 rounded-none uppercase">
            <Shield className="h-3 w-3 text-[#FFD700]" /> {profile.level}
          </span>

          {/* 2. TOMBOL LOGOUT: Hanya muncul kalau member terdeteksi sedang login */}
          {isLoggedIn && (
            <button
              onClick={onLogout}
              className="w-full mt-4 py-2 bg-red-950/40 hover:bg-red-600 border border-red-500/30 text-red-400 hover:text-white font-mono text-[10px] font-bold uppercase tracking-widest transition-all rounded-none flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="h-3 w-3" />
              <span>Keluar dari Member</span>
            </button>
          )}
        </div>

        {/* Right Side: Stats & Skills */}
        <div className="lg:col-span-2 space-y-6">
          {/* Grid Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {profile.stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-zinc-900/50 border border-white/5 p-4 rounded-none flex items-center gap-4">
                  <div className="p-2.5 bg-black text-[#FFD700] border border-white/10">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block">{stat.label}</span>
                    <span className="text-lg font-black text-white font-mono">{stat.value}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Skills Area */}
          <div className="bg-zinc-900/30 border border-white/5 p-6 rounded-none space-y-3">
            <h4 className="text-xs font-bold text-white font-mono tracking-widest uppercase border-b border-white/5 pb-2">
              Spesialisasi & Skill Terverifikasi
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              {profile.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-black border border-white/10 text-xs font-mono text-zinc-300 rounded-none uppercase tracking-wide"
                >
                  ■ {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Quick External Links / Integrations */}
          <div className="border border-white/10 bg-[#0F0F0F] p-4 flex flex-col sm:flex-row justify-between items-center gap-4 rounded-none">
            <div className="text-left">
              <span className="text-[10px] font-mono text-[#FFD700] uppercase block tracking-wider">Integrasi Portofolio</span>
              <p className="text-xs text-zinc-400">Hubungkan halaman ini dengan ekosistem software eksternal milikmu.</p>
            </div>
            <div className="flex gap-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-zinc-900 hover:bg-white hover:text-black border border-white/10 text-[10px] font-mono text-zinc-300 font-bold uppercase tracking-wider flex items-center gap-1 transition-all"
              >
                <span>GitHub Project</span>
                <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href="https://fiverr.com"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-zinc-900 hover:bg-white hover:text-black border border-white/10 text-[10px] font-mono text-zinc-300 font-bold uppercase tracking-wider flex items-center gap-1 transition-all"
              >
                <span>Fiverr Gigs</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}