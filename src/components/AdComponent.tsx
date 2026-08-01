import { useEffect } from "react";

interface AdComponentProps {
  slot: string; // ID Slot Iklan dari dashboard AdSense lu nanti
  format?: "auto" | "fluid" | "rectangle";
  responsive?: "true" | "false";
  className?: string;
}

export default function AdComponent({
  slot,
  format = "auto",
  responsive = "true",
  className = "",
}: AdComponentProps) {
  useEffect(() => {
    try {
      // Memicu push iklan ke array adsbygoogle milik Google
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, []);

  return (
    <div className={`w-full overflow-hidden my-4 text-center ${className}`}>
      {/* Teks penanda kecil agar estetik dan transparan bagi user */}
      <span className="text-[9px] font-mono tracking-widest text-zinc-600 block mb-1 uppercase">
        SPONSORED ADVERTISEMENT
      </span>
      
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-8960108261064180" // ID Publisher Lu
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}