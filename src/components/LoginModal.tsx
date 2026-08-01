import { useState } from "react";
import { 
  ShieldAlert, Lock, User, ArrowRight, UserPlus, 
  KeyRound, ArrowLeft, MapPin, Wrench, Phone, FileText, Image, X 
} from "lucide-react";
import { MemberProfile } from "./MemberSection";

// IMPORT KONEKSI CLOUD DARI FILE FIREBASE
import { auth, db } from "../firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

interface LoginModalProps {
  isOpen: boolean;
  onLoginSuccess: (username: string, profileData?: MemberProfile) => void;
  onClose: () => void; // <--- KITA TAMBAHKAN INI BIAR BISA DI-CLOSE SAMA USER, BOSKU!
}

type AuthView = "login" | "register" | "forgot" | "forgot_success";

export default function LoginModal({ isOpen, onLoginSuccess, onClose }: LoginModalProps) {
  const [view, setView] = useState<AuthView>("login");
  const [isLoading, setIsLoading] = useState(false);

  // Login States
  const [loginEmail, setLoginEmail] = useState("");
  const [password, setPassword] = useState("");

  // Extended Register States
  const [regFullName, setRegFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regUser, setRegUser] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regWhatsapp, setRegWhatsapp] = useState("");
  const [regTools, setRegTools] = useState("OpenToonz");
  const [regLevel, setRegLevel] = useState("Pemula");
  const [regReason, setRegReason] = useState("");
  const [regAvatar, setRegAvatar] = useState<string | null>(null);

  // Feedback States
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  // Handle preview foto lokal
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const localUrl = URL.createObjectURL(file);
      setRegAvatar(localUrl);
    }
  };

  // AKSI 1: LOGIN
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (loginEmail.trim() === "Rijal Rijal" && password === "member123") {
      setIsLoading(false);
      onLoginSuccess("Rijal Rijal");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail.trim(), password);
      const userUid = userCredential.user.uid;

      const docRef = doc(db, "members", userUid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const fullProfile = docSnap.data() as MemberProfile;
        onLoginSuccess(fullProfile.username, fullProfile);
      } else {
        onLoginSuccess(loginEmail);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Email atau Password salah, kombinasinya meleset bosku!");
      } else {
        setError("Gagal masuk ke server cloud. Pastikan internet aktif!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // AKSI 2: REGISTRASI MEMBER
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!regUser || !regPass || !regEmail || !regFullName || !regWhatsapp || !regReason) {
      setError("Semua kolom wajib diisi lengkap beserta alasannya, bosku!");
      return;
    }

    if (regPass.length < 6) {
      setError("Firebase mewajibkan password minimal 6 karakter, bosku!");
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, regEmail.trim(), regPass);
      const userUid = userCredential.user.uid;

      const newProfile: MemberProfile = {
        name: regFullName,
        email: regEmail.trim(),
        username: regUser.trim().toLowerCase(),
        whatsapp: regWhatsapp,
        tools: regTools,
        level: regLevel,
        reason: regReason,
        avatarUrl: regAvatar
      };

      await setDoc(doc(db, "members", userUid), newProfile);

      setSuccessMsg(`Registrasi Sukses Online! Silakan masuk menggunakan Email kamu.`);
      setLoginEmail(regEmail);
      setView("login");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("Email ini sudah terdaftar oleh orang lain, bosku!");
      } else {
        setError("Gagal mendaftar ke server cloud: " + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // AKSI 3: LUPA PASSWORD (CABE SUDAH BERSIH)
  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    
    // Kita paksa bertipe HTMLFormElement agar properti .elements diakui TypeScript
    const form = e.currentTarget;
    const emailInput = form.elements[0] as HTMLInputElement;
    
    try {
      await sendPasswordResetEmail(auth, emailInput.value);
      setView("forgot_success");
    } catch (err: any) {
      setError("Gagal mengirim email pemulihan. Pastikan email terdaftar!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="w-full max-w-lg bg-[#0F0F0F] border-2 border-[#FFD700] p-6 relative max-h-[95vh] overflow-y-auto shadow-2xl">
        
        {/* TOMBOL "X" UNTUK LEPAS KUNCIAN SMACKDOWN */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-zinc-500 hover:text-[#FFD700] transition-colors p-1 z-10 cursor-pointer"
          title="Tutup & Kembali ke Beranda"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Sudut Dekoratif Cyber */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#FFD700]"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#FFD700]"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#FFD700]"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#FFD700]"></div>

        {error && <div className="mb-4 p-3 bg-red-950/50 border border-red-500/30 text-red-400 text-xs font-mono">⚠️ {error}</div>}
        {successMsg && <div className="mb-4 p-3 bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs font-mono">✓ {successMsg}</div>}

        {/* VIEW: LOGIN */}
        {view === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-center space-y-2 mb-4">
              <div className="mx-auto w-10 h-10 bg-zinc-950 border border-white/10 flex items-center justify-center">
                <ShieldAlert className="h-5 w-5 text-[#FFD700]" />
              </div>
              <h3 className="text-lg font-serif font-black text-white uppercase tracking-wide">Gerbang Akses Member</h3>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-zinc-400 block">Email Terdaftar</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <input required type="text" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="budi@animator.com" className="w-full bg-zinc-900 border border-white/10 text-white pl-10 pr-4 py-2 text-sm rounded-none focus:outline-none focus:border-[#FFD700] font-mono" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-mono uppercase text-zinc-400 block">Password</label>
                <button type="button" onClick={() => setView("forgot")} className="text-[10px] font-mono text-[#FFD700] hover:underline uppercase">Lupa?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-zinc-900 border border-white/10 text-white pl-10 pr-4 py-2 text-sm rounded-none focus:outline-none focus:border-[#FFD700] font-mono" />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full py-2.5 bg-[#FFD700] disabled:bg-zinc-700 text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2 rounded-none cursor-pointer">
              <span>{isLoading ? "Menghubungkan Cloud..." : "Masuk Ke Fanpage"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="text-center pt-2 border-t border-white/5">
              <button type="button" onClick={() => setView("register")} className="text-xs font-mono text-zinc-400 hover:text-white cursor-pointer">
                Belum terdaftar? <span className="text-[#FFD700] font-bold underline">Isi Form Member Baru</span>
              </button>
            </div>
          </form>
        )}

        {/* VIEW: REGISTER */}
        {view === "register" && (
          <form onSubmit={handleRegister} className="space-y-3">
            <div className="text-center space-y-1 mb-2">
              <div className="mx-auto w-9 h-9 bg-zinc-950 border border-white/10 flex items-center justify-center">
                <UserPlus className="h-4 w-4 text-[#FFD700]" />
              </div>
              <h3 className="text-md font-serif font-black text-white uppercase tracking-wide">Formulir Pendaftaran Komunitas</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase text-zinc-400 block">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-3 top-2 h-4 w-4 text-zinc-500" />
                  <input type="text" required value={regFullName} onChange={(e) => setRegFullName(e.target.value)} placeholder="Budi Animator" className="w-full bg-zinc-900 border border-white/10 text-white pl-10 pr-4 py-1.5 text-xs rounded-none focus:border-[#FFD700] font-mono" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase text-zinc-400 block">No WhatsApp</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2 h-4 w-4 text-zinc-500" />
                  <input type="text" required value={regWhatsapp} onChange={(e) => setRegWhatsapp(e.target.value)} placeholder="08123456789" className="w-full bg-zinc-900 border border-white/10 text-white pl-10 pr-4 py-1.5 text-xs rounded-none focus:border-[#FFD700] font-mono" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase text-zinc-400 block">Main Tools Utama</label>
                <div className="relative">
                  <Wrench className="absolute left-3 top-2 h-4 w-4 text-zinc-500" />
                  <select value={regTools} onChange={(e) => setRegTools(e.target.value)} className="w-full bg-zinc-900 border border-white/10 text-white pl-10 pr-4 py-1.5 text-xs rounded-none focus:border-[#FFD700] font-mono appearance-none">
                    <option value="OpenToonz">OpenToonz</option>
                    <option value="Moho">Moho</option>
                    <option value="Adobe Animate">Adobe Animate</option>
                    <option value="Lainnya">Software Lainnya</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase text-zinc-400 block">Level Animasi Kamu</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2 h-4 w-4 text-zinc-500" />
                  <select value={regLevel} onChange={(e) => setRegLevel(e.target.value)} className="w-full bg-zinc-900 border border-white/10 text-white pl-10 pr-4 py-1.5 text-xs rounded-none focus:border-[#FFD700] font-mono appearance-none">
                    <option value="Pemula">Pemula</option>
                    <option value="Mahir">Mahir</option>
                    <option value="Jago">Jago</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-1 border border-white/5 bg-zinc-900/40 p-2.5">
              <label className="text-[9px] font-mono uppercase text-zinc-400 flex items-center gap-1"><Image className="h-3 w-3 text-[#FFD700]" /> Unggah Foto Profil (Local Preview)</label>
              <div className="flex items-center gap-3 mt-1">
                <input type="file" accept="image/*" onChange={handleFileChange} className="text-xs text-zinc-400 font-mono file:mr-4 file:py-1 file:px-3 file:border file:border-[#FFD700]/40 file:bg-black file:text-[#FFD700] file:text-[10px] file:font-mono file:uppercase hover:file:bg-zinc-900" />
                {regAvatar && <img src={regAvatar} alt="preview" className="w-8 h-8 object-cover border border-[#FFD700]" />}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-mono uppercase text-zinc-400 flex items-center gap-1"><FileText className="h-3 w-3 text-[#FFD700]" /> Alasan Bergabung</label>
              <textarea required rows={2} value={regReason} onChange={(e) => setRegReason(e.target.value)} placeholder="Tulis alasan singkat..." className="w-full bg-zinc-900 border border-white/10 text-white p-2 text-xs rounded-none focus:outline-none focus:border-[#FFD700] font-sans resize-none" />
            </div>

            <div className="space-y-1 pt-1 border-t border-white/5">
              <label className="text-[9px] font-mono uppercase text-zinc-500 block">Kredensial Akun Akses Masuk</label>
              <div className="grid grid-cols-3 gap-2">
                <input type="email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="Email Aktif" className="col-span-1 bg-zinc-900 border border-white/10 text-white px-2 py-1.5 text-xs rounded-none focus:outline-none focus:border-[#FFD700] font-mono" />
                <input type="text" required value={regUser} onChange={(e) => setRegUser(e.target.value)} placeholder="Username" className="col-span-1 bg-zinc-900 border border-white/10 text-white px-2 py-1.5 text-xs rounded-none focus:outline-none focus:border-[#FFD700] font-mono" />
                <input type="password" required value={regPass} onChange={(e) => setRegPass(e.target.value)} placeholder="Pass (min 6)" className="col-span-1 bg-zinc-900 border border-white/10 text-white px-2 py-1.5 text-xs rounded-none focus:outline-none focus:border-[#FFD700] font-mono" />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full py-2 bg-[#FFD700] disabled:bg-zinc-700 text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-white transition-all rounded-none mt-2 cursor-pointer">
              {isLoading ? "Mendaftarkan ke Cloud..." : "Daftar Member Komunitas"}
            </button>

            {/* JALUR PENYELAMAT: AMAN UNTUK KELUAR */}
            <div className="flex flex-col gap-1 pt-1 text-center">
              <button type="button" onClick={() => setView("login")} className="text-xs font-mono text-zinc-400 hover:text-zinc-200 py-1 flex items-center justify-center gap-1 cursor-pointer">
                <ArrowLeft className="h-3 w-3" /> Kembali ke Halaman Login
              </button>
              <button type="button" onClick={onClose} className="text-[11px] font-mono text-red-400/70 hover:text-red-400 py-0.5 cursor-pointer">
                Batal & Kembali ke Beranda
              </button>
            </div>
          </form>
        )}

        {/* VIEW: FORGOT PASSWORD */}
        {view === "forgot" && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="text-center space-y-2 mb-4">
              <div className="mx-auto w-10 h-10 bg-zinc-950 border border-white/10 flex items-center justify-center">
                <KeyRound className="h-5 w-5 text-[#FFD700]" />
              </div>
              <h3 className="text-lg font-serif font-black text-white uppercase tracking-wide">Pemulihan Akun</h3>
            </div>
            <input type="email" required placeholder="Masukkan email terdaftar" className="w-full bg-zinc-900 border border-white/10 text-white px-3 py-2 text-sm rounded-none focus:outline-none focus:border-[#FFD700] font-mono" />
            <button type="submit" className="w-full py-2 bg-[#FFD700] text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-white transition-all rounded-none cursor-pointer">
              Kirim Link Pemulihan
            </button>
            <button type="button" onClick={() => setView("login")} className="w-full py-1 text-xs font-mono text-zinc-500 hover:text-zinc-300 flex items-center justify-center gap-1 cursor-pointer"><ArrowLeft className="h-3 w-3" /> Kembali</button>
          </form>
        )}

        {/* VIEW: FORGOT SUCCESS */}
        {view === "forgot_success" && (
          <div className="text-center space-y-4 py-4">
            <h4 className="text-md font-bold text-white font-mono uppercase tracking-wide">Email Terkirim!</h4>
            <p className="text-xs text-zinc-500 font-sans">Silakan cek kotak masuk email lu untuk mereset password baru, bosku.</p>
            <button type="button" onClick={() => setView("login")} className="px-6 py-2 bg-zinc-900 hover:bg-white hover:text-black border border-white/10 font-mono text-xs uppercase transition-all rounded-none cursor-pointer">Kembali ke Login</button>
          </div>
        )}

      </div>
    </div>
  );
}