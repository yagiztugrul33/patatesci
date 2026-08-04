import { ImageResponse } from "next/og";

// Paylaşım kartı (Open Graph görseli) — SVG/JSX'ten build sırasında PNG üretilir.
export const runtime = "edge";
export const alt = "patatesci — Tarladan işletmene, aracısız toptan tedarik";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0f1d16",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <svg width="52" height="52" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 59C32 59 13 42 13 28 13 17.5 21.5 9.5 32 9.5s19 8 19 18.5C51 42 32 59 32 59Z" fill="none" stroke="#7fd0ab" strokeWidth="4.5" strokeLinejoin="round" />
            <ellipse cx="32" cy="28.5" rx="9.5" ry="7" transform="rotate(-14 32 28.5)" fill="none" stroke="#7fd0ab" strokeWidth="3.4" />
            <circle cx="28.6" cy="27.2" r="1.1" fill="#7fd0ab" />
            <circle cx="34.4" cy="30.8" r="1.1" fill="#7fd0ab" />
            <circle cx="35.8" cy="25.6" r="1.1" fill="#7fd0ab" />
            <path d="M32 9.5V4.8" stroke="#f0a84b" strokeWidth="3.2" strokeLinecap="round" />
            <path d="M32 5c0-2.7 2.2-4.3 5.4-4.3 0 2.7-2.2 4.3-5.4 4.3Z" fill="#f0a84b" />
          </svg>
          <div style={{ fontSize: "44px", fontWeight: 700, display: "flex" }}>patatesci</div>
        </div>
        <div style={{ fontSize: "76px", fontWeight: 700, marginTop: "34px", lineHeight: 1.12, maxWidth: "1000px", display: "flex" }}>
          Tarladan işletmene. Tonuyla, aracısız.
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "18px", marginTop: "30px" }}>
          <div style={{ fontSize: "40px", color: "#7fd0ab", display: "flex" }}>Toptan tedarik · 81 il</div>
          <div style={{ width: "8px", height: "8px", borderRadius: "999px", background: "#7fd0ab", display: "flex" }} />
          <div style={{ fontSize: "40px", color: "#9db3a6", display: "flex" }}>Uygulama yakında</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
