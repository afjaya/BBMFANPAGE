import { User, Award, Flame, Shield, LogOut, CheckCircle, MessageSquare, Briefcase, Phone } from "lucide-react";

// Perubahan struktur data lengkap sesuai instruksi bosku
export interface MemberProfile {
  name: string;
  email: string;
  username: string;
  whatsapp: string;
  tools: string;
  level: string;
  reason: string;
  role?: string;
  avatarUrl: string | null; // Untuk menyimpan link file lokal sementara
}

// 1. Pastikan di dalam Interface-nya sudah terdaftar:
interface MemberSectionProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  memberData: MemberProfile | null;
  onNavigateToAdmin?: () => void; // <-- Pastikan ini ada
}

// 2. Deklarasikan di dalam parameter fungsi (Destructuring):
export default function MemberSection({ 
  isLoggedIn, 
  onLogout, 
  memberData, 
  onNavigateToAdmin // <-- SUNTIK JUGAA BARIS INI DI SINI!
}: MemberSectionProps) {
  
  // Akun Default Fallback jika login menggunakan akun Founder Rijal Rijal
  const defaultProfile: MemberProfile = {
    name: "Rijal Rijal",
    email: "rijal@alfialijayagroup.com",
    username: "Rijal Rijal",
    whatsapp: "+62 812-xxxx-xxxx",
    tools: "OpenToonz",
    level: "Jago",
    reason: "Membangun ekosistem dan wadah creator animasi 2D terbaik di Indonesia.",
    avatarUrl: null
  };

  const currentProfile = memberData ? memberData : defaultProfile;
  const isFounder = !memberData; // Jika tidak ada data registrasi baru, berarti akun founder

  return (
    <div className="space-y-8">
      {/* Header Tab */}
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-3xl md:text-4xl font-serif font-black text-white italic tracking-tight">
          Dasbor: <span className="text-[#FFD700] not-italic">Portal Member</span>
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          Selamat datang di area eksklusif. Ini adalah kartu identitas keanggotaan aktif kamu di Bang Bro Media.
        </p>
      </div>

      {/* Main Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sisi Kiri: Foto Profil Dinamis & Tombol Keluar */}
        <div className="bg-[#0F0F0F] border border-white/10 p-6 flex flex-col items-center text-center justify-center space-y-4 rounded-none relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#FFD700]"></div>
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#FFD700]"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#FFD700]"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#FFD700]"></div>

          {/* Kotak Avatar: Jika ada unggahan file lokal tampilkan gambarnya, jika tidak gunakan Icon */}
          <div className="w-28 h-28 bg-zinc-900 border-2 border-[#FFD700] rounded-none flex items-center justify-center shadow-lg shadow-[#FFD700]/5 overflow-hidden">
            {currentProfile.avatarUrl ? (
              <img src={currentProfile.avatarUrl} alt="Foto Profil" className="w-full h-full object-cover" />
            ) : (
              <User className="h-14 w-14 text-[#FFD700]" />
            )}
          </div>

          <div className="space-y-1 w-full">
            <h3 className="text-xl font-serif font-black text-white uppercase tracking-wide">{currentProfile.name}</h3>
            <p className="text-xs font-mono text-[#FFD700] uppercase tracking-widest">{currentProfile.tools} Specialist</p>
            <p className="text-[11px] text-zinc-500 font-mono tracking-wider">@{currentProfile.username}</p>
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-900 border border-white/5 text-[10px] font-mono text-zinc-400 rounded-none uppercase">
            <Shield className="h-3 w-3 text-[#FFD700]" /> {isFounder ? "FOUNDER & LOCAL GUIDE" : `LEVEL: ${currentProfile.level}`}
          </span>
         
           {memberData?.role === "admin" && (
      <button
        onClick={() => onNavigateToAdmin ? onNavigateToAdmin() : window.location.reload()} 
        className="mt-6 w-full py-2.5 bg-red-950/40 text-[#FFD700] hover:bg-[#FFD700] hover:text-black font-mono font-black text-[10px] uppercase tracking-widest border border-[#FFD700]/30 transition-all cursor-pointer flex items-center justify-center gap-2"
      >
        <span>⚙️ MASUK BACKSTAGE ADMIN</span>
      </button>
    )}
   

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

        {/* Sisi Kanan: Informasi Detail Pendaftaran */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-zinc-900/50 border border-white/5 p-4 flex items-center gap-4">
              <div className="p-2.5 bg-black text-[#FFD700] border border-white/10"><Flame className="h-5 w-5" /></div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block">Status Akses Chat</span>
                <span className="text-sm font-bold text-emerald-400 flex items-center gap-1">AKTIF <CheckCircle className="h-3 w-3" /></span>
              </div>
            </div>
            <div className="bg-zinc-900/50 border border-white/5 p-4 flex items-center gap-4">
              <div className="p-2.5 bg-black text-[#FFD700] border border-white/10"><Award className="h-5 w-5" /></div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block">Akses Komunitas WA</span>
                <span className="text-sm font-bold text-emerald-400 flex items-center gap-1">TERVERIFIKASI <CheckCircle className="h-3 w-3" /></span>
              </div>
            </div>
          </div>

          {/* Kartu Detail Data Profil */}
          <div className="bg-zinc-900/30 border border-white/5 p-6 rounded-none space-y-4">
            <h4 className="text-xs font-bold text-white font-mono tracking-widest uppercase border-b border-white/5 pb-2">
              Kredensial & Atribut Keanggotaan
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-zinc-500 block uppercase text-[10px]">Kontak WhatsApp</span>
                <div className="flex items-center gap-2 text-zinc-200">
                  <Phone className="h-3.5 w-3.5 text-[#FFD700]" />
                  <span>{currentProfile.whatsapp}</span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-zinc-500 block uppercase text-[10px]">Email Terdaftar</span>
                <div className="flex items-center gap-2 text-zinc-200">
                  <Briefcase className="h-3.5 w-3.5 text-[#FFD700]" />
                  <span className="truncate">{currentProfile.email}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1 pt-2 border-t border-white/5">
              <span className="text-zinc-500 block uppercase text-[10px] font-mono">Alasan Bergabung Komunitas</span>
              <div className="bg-black/40 border border-white/5 p-3 text-xs text-zinc-300 font-sans italic leading-relaxed">
                <MessageSquare className="h-4 w-4 text-[#FFD700] inline mr-2 float-left" />
                "{currentProfile.reason}"
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}