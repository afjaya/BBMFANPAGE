import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicySection() {
  return (
    <div className="max-w-4xl mx-auto bg-zinc-900/40 border border-white/5 p-6 md:p-10 font-sans text-zinc-300 leading-relaxed space-y-6">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-6 text-center md:text-left flex flex-col md:flex-row items-center gap-4">
        <div className="p-3 bg-[#FFD700]/10 border border-[#FFD700]/20 text-[#FFD700]">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-black text-white uppercase tracking-wide">
            Privacy Policy
          </h1>
          <p className="text-xs font-mono text-zinc-500 mt-1">
            Terakhir Diperbarui: 2 Juli 2026 | Bang Bro Media
          </p>
        </div>
      </div>

      {/* Konten Utama */}
      <div className="space-y-6 text-sm text-zinc-400">
        <p>
          Di **Bang Bro Media — OpenToonz Authority**, yang dapat diakses melalui platform web kami, salah satu prioritas utama kami adalah privasi pengunjung kami. Dokumen Kebijakan Privasi ini berisi jenis informasi yang dikumpulkan dan dicatat oleh Bang Bro Media dan bagaimana kami menggunakannya.
        </p>

        <h2 className="text-base font-bold uppercase text-[#FFD700] tracking-wider pt-2">
          1. Informasi yang Kami Kumpulkan
        </h2>
        <p>
          Ketika Anda mendaftar sebagai member untuk membuka fitur eksklusif, kami mengumpulkan informasi minimal yang diperlukan untuk fungsionalitas akun, seperti nama pengguna (username) dan alamat email Anda melalui sistem autentikasi kami yang aman.
        </p>
        <p>
          Pada fitur <strong>Live Support AI Chat</strong>, pesan atau pertanyaan yang Anda ajukan dikirimkan ke sistem asisten kecerdasan buatan (AI) kami untuk memberikan solusi tutorial OpenToonz secara <i>real-time</i>. Kami tidak menyalahgunakan atau menjual riwayat percakapan tersebut kepada pihak ketiga.
        </p>

        <h2 className="text-base font-bold uppercase text-[#FFD700] tracking-wider pt-2">
          2. Log Files (Berkas Catatan)
        </h2>
        <p>
          Bang Bro Media mengikuti prosedur standar menggunakan berkas catatan (log files). Berkas ini mencatat pengunjung ketika mereka mengunjungi situs web. Informasi yang dikumpulkan oleh log files termasuk alamat protokol internet (IP), jenis peramban (browser), Penyedia Layanan Internet (ISP), tanggal dan waktu, halaman perujuk, dan mungkin jumlah klik. Ini tidak terkait dengan informasi yang dapat diidentifikasi secara pribadi.
        </p>

        <h2 className="text-base font-bold uppercase text-[#FFD700] tracking-wider pt-2">
          3. Google AdSense & Cookies Pihak Ketiga
        </h2>
        <p>
          Situs web kami menayangkan iklan yang disediakan oleh <strong>Google AdSense</strong>. Google, sebagai vendor pihak ketiga, menggunakan cookies untuk menayangkan iklan di situs kami. Penggunaan cookie DART oleh Google memungkinkannya menayangkan iklan kepada pengguna kami berdasarkan kunjungan mereka ke situs ini dan situs lainnya di Internet.
        </p>
        <p>
          Anda dapat memilih untuk membatalkan penggunaan cookie DART dengan mengunjungi Kebijakan Privasi jaringan iklan dan konten Google di URL berikut:{" "}
          <a 
            href="https://policies.google.com/technologies/ads" 
            target="_blank" 
            rel="noreferrer" 
            className="text-[#FFD700] hover:underline break-all font-mono text-xs"
          >
            https://policies.google.com/technologies/ads
          </a>
        </p>

        <h2 className="text-base font-bold uppercase text-[#FFD700] tracking-wider pt-2">
          4. Kebijakan Privasi Pihak Ketiga
        </h2>
        <p>
          Kebijakan Privasi Bang Bro Media tidak berlaku untuk pengiklan atau situs web lain. Kami menyarankan Anda untuk berkonsultasi dengan masing-masing Kebijakan Privasi dari vendor iklan pihak ketiga ini (seperti Google AdSense dan Firebase Analytics) untuk informasi yang lebih rinci.
        </p>

        <h2 className="text-base font-bold uppercase text-[#FFD700] tracking-wider pt-2">
          5. Persetujuan
        </h2>
        <p>
          Dengan menggunakan situs web kami, Anda dengan ini menyetujui Kebijakan Privasi kami dan menyetujui syarat dan ketentuannya.
        </p>

        <h2 className="text-base font-bold uppercase text-[#FFD700] tracking-wider pt-2">
          6. Kontak Kami
        </h2>
        <p>
          Jika Anda memiliki pertanyaan tambahan atau memerlukan informasi lebih lanjut tentang Kebijakan Privasi kami, jangan ragu untuk menghubungi kami melalui email resmi di:{" "}
          <span className="text-white font-mono bg-black px-2 py-0.5 border border-white/5">
            bangbromedia@gmail.com
          </span>
        </p>
      </div>

      {/* Footer Penutup */}
      <div className="pt-4 border-t border-white/5 text-center">
        <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
          © {new Date().getFullYear()} Bang Bro Media — OpenToonz Authority Verified Document
        </p>
      </div>

    </div>
  );
}