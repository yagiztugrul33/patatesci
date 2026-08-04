// patatesci marka sistemi.
// Amblem: konum pini içinde patates formu + tepesinde filiz (tarladan-konuma).
// Wordmark: küçük harf "patatesci", Inter/sistem fontu, koyu.
// Varyantlar: full (amblem+yazı+slogan) · compact (amblem+yazı) · mark (amblem).
// Ton: dark (açık zemin, varsayılan) · light (koyu zemin / görsel üstü).
// Slogan bağlamı: "isletme" → "Tarladan işletmene." · "eve" → "Tarladan eve."

const TONLAR = {
  dark: { yazi: "#1e2a24", isaret: "#2e8b63", vurgu: "#d97706", slogan: "#5c6660" },
  light: { yazi: "#ffffff", isaret: "#7fd0ab", vurgu: "#f0a84b", slogan: "#9db3a6" },
};

export function LogoMark({ tone = "dark", size = 28 }) {
  const r = TONLAR[tone] || TONLAR.dark;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M32 59C32 59 13 42 13 28 13 17.5 21.5 9.5 32 9.5s19 8 19 18.5C51 42 32 59 32 59Z"
        fill="none" stroke={r.isaret} strokeWidth="4.5" strokeLinejoin="round"
      />
      <ellipse cx="32" cy="28.5" rx="9.5" ry="7" transform="rotate(-14 32 28.5)" fill="none" stroke={r.isaret} strokeWidth="3.4" />
      <circle cx="28.6" cy="27.2" r="1.1" fill={r.isaret} />
      <circle cx="34.4" cy="30.8" r="1.1" fill={r.isaret} />
      <circle cx="35.8" cy="25.6" r="1.1" fill={r.isaret} />
      <path d="M32 9.5V4.8" stroke={r.vurgu} strokeWidth="3.2" strokeLinecap="round" />
      <path d="M32 5c0-2.7 2.2-4.3 5.4-4.3 0 2.7-2.2 4.3-5.4 4.3Z" fill={r.vurgu} />
    </svg>
  );
}

export default function Logo({ variant = "compact", tone = "dark", slogan = "isletme", size = 26 }) {
  const r = TONLAR[tone] || TONLAR.dark;
  const sloganMetni = slogan === "eve" ? "Tarladan eve." : "Tarladan işletmene.";
  if (variant === "mark") return <LogoMark tone={tone} size={size} />;
  return (
    <span
      style={{
        display: "inline-flex",
        flexDirection: variant === "full" ? "column" : "row",
        alignItems: variant === "full" ? "flex-start" : "center",
        gap: variant === "full" ? 5 : 8,
        lineHeight: 1,
      }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <LogoMark tone={tone} size={size} />
        <span style={{ fontWeight: 700, fontSize: Math.round(size * 0.82), letterSpacing: "-0.02em", color: r.yazi }}>
          patatesci
        </span>
      </span>
      {variant === "full" && (
        <span style={{ fontSize: Math.max(11, Math.round(size * 0.42)), color: r.slogan, fontWeight: 500, paddingLeft: size + 8 }}>
          {sloganMetni}
        </span>
      )}
    </span>
  );
}
