# ONAY KUYRUĞU — 5 Ağustos 2026 (güncel)

## Operatör onayı ZORUNLU (global/güvenlik etkisi)
1. **claude-mem hafıza motoru** — `npx claude-mem install`: `~/.claude` altına
   global hook + kalıcı arka plan worker + SQLite DB kurar. Skill dosyaları
   kuruldu ama **motor olmadan oturumlar arası hafıza çalışmıyor**.
2. **OmniRoute gateway** — global npm paketi + `localhost:20128`'de kalıcı
   sunucu ve **tüm LLM trafiğinin üçüncü taraf bir ara sunucudan geçmesi**.
   API anahtarı uydurulmadı, hiçbir sağlayıcı bağlanmadı. Onay verilirse
   ucuz/pahalı kanalları (`auto/cheap`, `auto/coding`) yapılandırılacak.
3. **superpowers SessionStart hook'u** — global yapılandırma değişikliği.
4. **Strix güvenlik taraması** — makinede **Docker yok**; Docker + LLM API
   anahtarı gerekli. Yerine manuel batarya + kalıcı E2E (25 senaryo) koşuluyor.

## Bilgi/sır bekleyenler
5. **Notion "ücretsiz Google araçları" + 2 Instagram reel** — **URL
   paylaşılmadı**, içerik uydurulmadı (`docs/ARAC-NOTLARI.md`). Bağlantılar
   gelirse özetlenir. Not: reel video içeriği doğrudan izlenemez; ancak
   açıklama/altyazı metni üzerinden çıkarım yapılabilir.
6. **PSP (ödeme kuruluşu) fiyat teklifi** — finans motorunda havale %1 TEMSİLİ.
7. **Upstash Redis** — ön kayıt kalıcılığı (şu an Vercel `/tmp`, örnek ömrüyle
   sınırlı) **ve** dağıtık hız sınırı. İkisi de bu env'e bağlı.
8. **Gerçek alan adı** — `lib/site.js` tek satır.
9. **Sigorta brokeri** (8 madde) + hammaliye tarifesi için esnaf odası.
10. **TİO/R2 yetki belgesi kararı** (273.244 ₺ + ÜDY3/ODY3) — nakliye
    pazaryeri geliri bu karara kadar kapalı.
11. **Avukat onayı** — kural kitabı ve sözleşme şablonları (taslak ibareli).

## ihaleal
12. **Vercel → ihaleal → Settings → Deployment Protection → kapat** — staging
    preview'ı Vercel login duvarı arkasında; dış denetçi göremiyor.
13. **`npm run typecheck` no-op** — kök tsconfig solution-style; `-p
    tsconfig.app.json` yapılmalı, ama önce **30 mevcut TS hatası** kapatılmalı.
14. Mobil imzalama sırları (`cap add ios` + Apple sertifikaları + Android
    keystore) → CI workflow'ları ancak bundan sonra.
15. `.env.local`: VITE_SUPABASE_URL / ANON_KEY.

## remaxboss
16. ~~`origin/staging` dalı **yok** — push için dal açılmalı.~~ **ÇÖZÜLDÜ
    (5 Ağu 16:20):** dal açıldı, 6 commit uzağa gitti,
    `origin/staging = 58fba03f8e6a951327a3a0e23a8d0d044f254e4b` (lokal ile birebir).
    Soğuk klon uzaktan çekildi: `npm ci` 114.1 sn · `npm run build` ✓ 74.8 sn ·
    `npm test` **40/40** 12.3 sn. Kalan: Supabase anahtarları + `ADMIN_EMAILS`.
16b. **Vercel → remax-boss-v2 → Deployment Protection → kapat** (veya bypass
    token ver) — staging preview build'i `success`
    (https://remax-boss-v2-d7jbezzni-yagizo.vercel.app) ama URL `302 → vercel.com/sso-api`
    veriyor; **sayfa içeriği doğrulanamadı**. (ihaleal'daki 12. maddeyle aynı sorun.)
16c. **Karar:** `staging` → `master` PR açılsın mı?
    https://github.com/yagiztugrul33/remax-boss-v2/pull/new/staging — `master` dokunulmadı.
17. `/en/ekibimiz/<slug>` İngilizce açıklamaları — RE/MAX program adlarının
    ("MAXX Sistem", "RAPP Sistem") kurumsal İngilizcesi teyit edilmeli.

## Teknik borç (onay gerekmez, sıradaki turlarda)
18. **patatesci Perf 81 → 90+** (Next 16 hidrasyon maliyeti; güvenlik için
    bilinçli takas). **Denenip ÖLÇÜMLE ELENEN iki yol — tekrar denenmesin:**
    (a) `next/dynamic` ile fold altı lazy: skor **83 → 78** (ek parça indirme
    maliyeti kazancı yedi), geri alındı. (b) CSS `contain` ile layout
    izolasyonu: skor **83 → 75**, Style & Layout 3.271 → 4.325 ms, geri alındı.
    **Gerçek darboğaz ölçüldü: Style & Layout 3.271 ms, Script yalnız 542 ms**
    — yani JS değil, DOM/layout hacmi. Sıradaki aday: ana sayfadaki 8 telefon
    mockup'ının DOM'unu küçültmek (her biri onlarca iç içe SVG/div) veya fold
    altı Story bölümlerini sunucuda ayrı rotaya taşımak. Ölçüm bu makinede
    gürültülü (paralel ajanlarla ±5 puan oynuyor) — karar için sakin makinede
    veya PageSpeed Insights ile ölçülmeli.
19. Bahsedilen `patatesci-vitrin-guvenlik.bundle` / `ihaleal-ts-kapanisi.bundle`
    ve `f45236a` / `62b4108` SHA'ları **bu makinede yok** — başka bir oturumda
    üretilmişse aktarılmalı.
20. `_skills` klon dizini silinebilir; patatesci'de commit karışması oldu
    (paralel oturumda `git add -A` kullanılmamalı).
