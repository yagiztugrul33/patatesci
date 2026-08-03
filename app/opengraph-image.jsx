import { ImageResponse } from "next/og";

// Paylaşım kartı (Open Graph görseli) — SVG/JSX'ten build sırasında PNG üretilir.
export const runtime = "edge";
export const alt = "patatesçi — Türkiye'nin sebze-meyve ağı kuruluyor";
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
          <div style={{ width: "22px", height: "22px", borderRadius: "999px", background: "#2e8b63", display: "flex" }} />
          <div style={{ fontSize: "42px", fontWeight: 700, display: "flex" }}>patatesçi</div>
        </div>
        <div style={{ fontSize: "76px", fontWeight: 700, marginTop: "34px", lineHeight: 1.12, maxWidth: "980px", display: "flex" }}>
          Türkiye'nin sebze-meyve ağı kuruluyor.
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "18px", marginTop: "30px" }}>
          <div style={{ fontSize: "40px", color: "#7fd0ab", display: "flex" }}>81 ilde</div>
          <div style={{ width: "8px", height: "8px", borderRadius: "999px", background: "#7fd0ab", display: "flex" }} />
          <div style={{ fontSize: "40px", color: "#9db3a6", display: "flex" }}>Uygulama yakında</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
