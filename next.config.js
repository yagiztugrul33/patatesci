/** @type {import('next').NextConfig} */
// Güvenlik başlıkları (Ö4 bulgusu ORTA-1): clickjacking, MIME sniffing,
// karışık içerik ve referrer sızıntısına karşı temel savunma.
const guvenlikBasliklari = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  {
    // Next.js runtime'ı inline script kullanır; stil için Google Fonts'a izin verilir.
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // sürüm parmak izini gizle
  async headers() {
    return [{ source: "/:path*", headers: guvenlikBasliklari }];
  },
};
module.exports = nextConfig;
