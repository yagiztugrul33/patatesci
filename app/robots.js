import { SITE_URL } from "../lib/site";

// Demo sayfaları ve API taranmasın; tanıtım sayfaları açık.
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/pazar", "/borsa", "/sat", "/giris", "/siparisler", "/api/", "/yonetim/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
