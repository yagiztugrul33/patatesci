# HESAP RAPORU — ölçüm ve doğrulama
5 Ağustos 2026 · Yeni kod yazılmadı; yalnız ölçüm, sayım ve doğrulama.
**Kanıtsız satır yok:** her rakamın yanında kaynağı var. Panel gerektiren işler
`docs/OPERATOR-YAPILACAKLAR.md`'ye atıfla geçilmiştir.

---

## 1. TOKEN — kıyas verisi YOK, baz alınıyor

**Ölçüm sonucu: claude-mem'de kayıtlı gözlem sayısı = 0.**

| Kanıt | Değer | Kaynak |
|---|---|---|
| Kurulan sürüm | claude-mem **13.13.1** | `~/.claude/plugins/installed_plugins.json` |
| Worker | **çalışıyor** — PID 6408, port 37777, uptime 9.843 sn | `worker-service.cjs status` |
| Veritabanı | `claude-mem.db` **4 KB** (boş şema) + WAL 1.947 KB | `~/.claude-mem` dizin listesi |
| **Kaydedilen olay** | **`eventCount: 0`** | `~/.claude-mem/backfill.json` |
| Log'da gözlem kaydı | **0 satır** (48 satırın tamamı sistem/başlangıç) | `logs/claude-mem-2026-08-05.log` |

**Dürüst sonuç:** Kurulum bu oturumun **sonuna doğru** yapıldı ve hook'lar
(`SessionStart`, `UserPromptSubmit`, `PostToolUse`, `PreToolUse`, `Stop`)
bir sonraki oturumdan itibaren yazmaya başlıyor — kurulum çıktısının kendi
ifadesiyle: *"Memory injection starts on your second session in a project."*

Bu yüzden **"önce/sonra" kıyaslaması yapılamaz**; herhangi bir tasarruf yüzdesi
yazmak uydurma olurdu. **Bu oturum bazdır (baseline).** Ölçüm bir sonraki
oturumda başlar; o zaman `mem-search` ile enjekte edilen bağlam ve tasarruf
somut olarak ölçülebilir.

Daha önce `docs/MOTOR-KARARI.md`'de yazılan "%10–20 tasarruf" ifadesi de
**tahmindir ve orada DOĞRULANAMADI olarak etiketlenmiştir** — bu raporda da
doğrulanmamış sayılır.

---

## 2. STRIX — kurulamıyor (tek deneme, kanıtlı); manuel batarya sonuçları

**Docker kontrolü (tek deneme):**

| Kontrol | Sonuç |
|---|---|
| `docker --version` | **komut yok** |
| `Get-Command docker` | **bulunamadı** |
| Docker Desktop kurulu mu | **False** (`Program Files\Docker\...` yok) |
| winget'te mevcut mu | **Evet** — `Docker.DockerDesktop 4.85.0` |

**Sonuç:** Strix çalıştırılamıyor. Kurulum, **operatör onayı gerektiren**
bir sistem kurulumudur (Docker Desktop + LLM API anahtarı) → panel/karar işi
olarak `OPERATOR-YAPILACAKLAR` kapsamındadır. Bu turda **kurulmadı**.

**Yerine koşulan manuel batarya — tüm bulgular tek tabloda:**

| # | Seviye | Bulgu | PoC (düzeltme öncesi) | Durum |
|---|---|---|---|---|
| K-1 | **KRİTİK** | IDOR: sipariş tarafı olmayan kullanıcı işlem yapabiliyordu (ceza tetikliyordu) | `POST /api/orders {"id":1,"aksiyon":"ileri"}` üçüncü kullanıcıyla → **200** | **KAPALI** → 403 |
| Y-1 | YÜKSEK | Sınırsız tonaj/fiyat | `{"ton":1e308}` → **201** | **KAPALI** → 422 |
| Y-2 | YÜKSEK | Menşe serbest metin (kirli veri) | `{"mense":"<script>…"}` → **201** | **KAPALI** → 422 + NFC |
| Y-3 | YÜKSEK | Hız sınırı yok | 20 ardışık kayıt → **20 kabul** | **KAPALI** → 429 |
| Y-4 | YÜKSEK | postcss/next zinciri (GHSA-6g55, GHSA-r28c) | `npm audit` → 2 yüksek | **KAPALI** → Next 16, audit 0 |
| O-1 | ORTA | Güvenlik başlıkları eksik | `curl -I` → CSP/HSTS/XFO yok | **KAPALI** |
| O-2 | ORTA | Bozuk JSON 5xx dönüyordu | `-d 'json-degil'` → **503** | **KAPALI** → 400 |
| O-3 | ORTA | Prototip kirletme temizlenmiyordu | `__proto__` gövdede geçiyordu | **KAPALI** |
| D-1 | DÜŞÜK | Hız sınırı bellek içi (serverless'ta paylaşılmıyor) | — | **AÇIK** (Upstash'e bağlı) |

**Canlı doğrulama (taze, önbelleksiz):**
`"kritikAcik":0,"yuksekAcik":0` — `GET /api/denetim`, SHA `acb989d`.

Temiz çıkanlar (aynı bataryada): oturumsuz yazma 401 (3 uç) · IDOR-okuma
sızıntısı yok · SQL/NoSQL payload 422 · KVKK sızıntısı yok · hardcoded sır
taraması **bulgu yok**.

---

## 3. UYGULANMA ORANI

Bu oturumda verilen tüm talepler (kronolojik), tek tek durumlandırıldı.

| # | Talep | Durum |
|---|---|---|
| 1 | Kurulum: gh auth, klon, npm install, build, dev sunucu | **UYGULANDI-CANLI** |
| 2 | Kurumsal dönüşüm (emoji sıfır, dil, palet, güven, metadata) | **UYGULANDI-CANLI** |
| 3 | Tanıtım sitesi (uygulama tanıtımı, mockup'lar) | **UYGULANDI-CANLI** |
| 4 | Lansman reklam sitesi (81 il, illüstrasyon, hikâyeler) | **UYGULANDI-CANLI** |
| 5 | Yayın hazırlığı: robots + sitemap + noindex | **UYGULANDI-CANLI** |
| 6 | Ön kayıt kalıcılığı (Upstash **kodu**) | **UYGULANDI** (kod) / env **KARAR-BEKLİYOR** |
| 7 | Hareket + renk cilası (10 madde) | **UYGULANDI-CANLI** |
| 8 | Ton bazlı toptan dönüşüm + belge otomasyonu | **UYGULANDI-CANLI** |
| 9 | Logo + slogan sistemi (4 varyant + brand.md) | **UYGULANDI-CANLI** |
| 10 | "patatesci" yazım düzeltmesi (16 dosya) | **UYGULANDI-CANLI** |
| 11 | Şeffaf ticaret: kural kitabı + 86 senaryo + kod | **UYGULANDI-CANLI** |
| 12 | Sigorta & teminat sistemi (risk haritası, DOĞRULANAMADI listesi) | **UYGULANDI-CANLI** |
| 13 | Teslimat seviyeleri S0–S4 + teklif blokesi + sözleşme | **UYGULANDI-CANLI** |
| 14 | Canlı katalog (hal tam listesi, otomatik türetme) | **UYGULANDI-CANLI** |
| 15 | Bilyoner fiyat kilidi (snapshot → %3 → çift onay → kilit) | **UYGULANDI-CANLI** |
| 16 | Min 1 ton istisnasız | **UYGULANDI-CANLI** |
| 17 | Finans motoru + /yonetim/hesap + TİO araştırması | **UYGULANDI-CANLI** |
| 18 | Gıda borsası (fındık/fıstık/çay, menşe, sertifika, 81 il gerçek harita) | **UYGULANDI-CANLI** |
| 19 | Güvenlik turu (IDOR + 6 bulgu) | **UYGULANDI-CANLI** |
| 20 | `/api/denetim` dış denetçi ucu + no-store | **UYGULANDI-CANLI** |
| 21 | Next 16 geçişi (Y-4 kapanışı) | **UYGULANDI-CANLI** |
| 22 | Kalıcı E2E bataryası (25 senaryo) | **UYGULANDI-CANLI** |
| 23 | Skill kurulumu (44 skill × 2 repo) | **UYGULANDI** (repolarda) |
| 24 | claude-mem motoru (yerel) | **UYGULANDI** / hafıza ölçümü **1. maddede baz** |
| 25 | ihaleal renk dönüşümü (15 sayfa 0/0) | **YAPILDI-DOĞRULANAMADI** (SSO) |
| 26 | ihaleal sadeleştirme (6 modül kartı, Ctrl+K, skeleton, AA) | **YAPILDI-DOĞRULANAMADI** (SSO) |
| 27 | ihaleal typecheck (30→0, sahte yeşil düzeltildi) | **YAPILDI-DOĞRULANAMADI** (SSO) |
| 28 | ihaleal perf (71→76) | **YAPILDI-DOĞRULANAMADI** (SSO) |
| 29 | remaxboss sağlık taraması + SEO + tel: | **YAPILDI-DOĞRULANAMADI** (SSO) |
| 30 | remaxboss staging push + PR #1 | **UYGULANDI** (PR açık) / merge **KARAR-BEKLİYOR** |
| 31 | patatesci perf 84→90 | **KISMEN** — DOM ölçülü küçüldü, **skor DOĞRULANAMADI** |
| 32 | Katalog sayısı tutarlılığı | **UYGULANDI-CANLI** |
| 33 | Kalıcı kural (tek ağaç tek oturum → CLAUDE.md) | **UYGULANDI** |
| 34 | Motor karar notu + operatör yapılacaklar listesi | **UYGULANDI** |
| 35 | Strix güvenlik taraması | **KUYRUKTA** (Docker yok) |
| 36 | OmniRoute | **KARAR-BEKLİYOR** (öneri: kurulmasın) |
| 37 | Notion + 2 Instagram reel incelemesi | **KUYRUKTA** (URL paylaşılmadı) |
| 38 | Bahsedilen bundle'lar / `f45236a`+`62b4108` | **YAPILAMADI** (bu makinede yok) |

### Oranlar (38 talep)

| Durum | Adet | Oran |
|---|---|---|
| **UYGULANDI-CANLI** (canlı curl ile doğrulanmış) | **21** | **%55,3** |
| **UYGULANDI** (yapıldı, canlı doğrulama gerektirmiyor: skill/CLAUDE.md/PR/motor) | **5** | %13,2 |
| **YAPILDI-DOĞRULANAMADI** (kod push'lu, SSO duvarı nedeniyle canlı kanıt yok) | **5** | %13,2 |
| **KISMEN** (ölçülü kazanım var, hedef kanıtlanamadı) | **1** | %2,6 |
| **KARAR-BEKLİYOR** (operatör) | **3** | %7,9 |
| **KUYRUKTA** (dış bağımlılık: Docker / URL) | **2** | %5,3 |
| **YAPILAMADI** (girdi bu makinede yok) | **1** | %2,6 |

**Tamamlanan iş oranı: %81,7** (UYGULANDI-CANLI + UYGULANDI + YAPILDI-DOĞRULANAMADI).
**Bloke olan oran: %15,8** (karar + kuyruk + yapılamayan) — üçü de **operatör
veya dış bağımlılık** kaynaklı, teknik engel değil.

---

## 4. ihaleal — sadeleştirme nerede, main'e neden gitmedi

### Staging'de tamamlanan sayfalar (kanıt: `public/denetim.json`, SHA `e9a95b4`)

`denetim.json` **14 sayfa** için önce/sonra metriği taşıyor:
`Home` · `SearchModal` · `SearchResults` · `Analytics` · `Reports` ·
`Documents` · `LiveAuctions` · `Messages` · `NotificationsPage` ·
`AuctionDetail` · `PricingPage` · `CitiesList` · `IntelligenceHub` ·
`LegalHubPage`.

Ölçülen sonuçlar (önceki turların kanıtlarından):
- **Düşük kontrast metin: 14 sayfada 0** (token düzeyinde düzeltme, 762 kullanım)
- **Gradyan: 200 → 158**, kalan 158'in tamamı gerekçeli (sinematik ana sayfa
  dili, token tanım katmanı, chart dolguları, marka maskotu)
- **Erişilebilirlik: 90 → 100** · **CLS: 0,186 → 0,0028** · **SEO 100**
- **375 px: 12/12 sayfada yatay taşma 0**
- **TypeScript: 30 → 0 hata**, `typecheck` sahte yeşilden gerçek denetime bağlandı
- **Performans: 70 → 76** (9 tur medyan; hedef 90'a ulaşılmadı)

Staging'de toplam **50 commit** ana daldan ileride; bunların **26'sı** renk/sayfa
sadeleştirme, kalanı perf/typecheck/denetim.

### main'e neden gitmedi

**Gitmedi çünkü doğrulanamıyor — teknik engel değil, erişim engeli:**

1. **Preview SSO duvarı:** staging push'u Vercel'de preview üretiyor ve build
   `state: success` dönüyor, ancak URL `302 → vercel.com/sso-api` veriyor.
   Yani **yapılan işin canlıda çalıştığı kanıtlanamıyor.** Üç kapılı rejimin
   "canlı eşlik" ayağı bu projede kapalı.
2. **Production farklı kodu servis ediyor:** `www.ihaleal.com` **200** dönüyor
   ama **staging kodunu içermiyor** — canlı HTML'de `vendor-charts` var,
   `vendor-utils` **yok** (kanıt: bu raporun ölçümü). Yani ana dal ile staging
   arasında 50 commit'lik gerçek bir fark var ve production eski sürümde.
3. **Merge kararı operatörde:** main'e merge = **canlı siteye çıkar**. Bu
   public bir değişiklik olduğu için otomatik yapılmadı (aynı ilke remaxboss'ta
   PR açıp merge etmemekle uygulandı).

### Canlı doğrulama için gereken (sırayla)

1. **Deployment Protection kapat** (Vercel → ihaleal → Settings → Deployment
   Protection → Disabled, veya bypass token) → preview URL'i curl ile
   doğrulanabilir hale gelir. *(`OPERATOR-YAPILACAKLAR` madde 2)*
2. Preview'da içerik kanıtı alınır (6 modül kartı, Ctrl+K, skeleton, 375 px).
3. Onaydan sonra `staging → main` PR'ı açılır ve merge edilir; production
   yeni sürüme geçer.
4. Merge sonrası PSI ile **gerçek** perf ölçümü yapılabilir (şu an PSI
   staging'i ölçemiyor; production eski kodda).

---

## Kaynak özeti
Canlı teyitler `GET https://patatesci.vercel.app/api/denetim` (önbelleksiz,
`no-store`) · repo durumları `git rev-parse` / `git rev-list --count` ·
claude-mem verileri `~/.claude-mem` dosyaları ve worker `status` çıktısı ·
Docker kontrolü `docker --version` + `Get-Command` + winget araması ·
ihaleal metrikleri `public/denetim.json` (SHA `e9a95b4`) ·
production karşılaştırması `www.ihaleal.com` HTML'inde chunk adı araması.
