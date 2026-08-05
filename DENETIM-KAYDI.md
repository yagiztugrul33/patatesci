# DENETİM KAYDI — patatesci

Dış denetçi (Cowork-Claude) için kanıt izi. Canlı uç: `GET /api/denetim`
(robots.txt'te Allow). Rapordaki her iddia bu dosya + canlı uçla tutarlıdır.

## Tur: Ö1 Gıda Borsası + Ö4 Güvenlik (5 Ağustos 2026)

**Mühürlenen SHA:** `e98aaf7d99875a66832746326390b06a0d9a1b56`
**Önceki SHA'lar:** `2e67d11` (güvenlik turu 2) · `c6eb441` (gıda borsası + sertleştirme)

### KAPI 1 — Soğuk doğrulama (temiz klon, `_dogrulama/patatesci`)
| Adım | Süre | Sonuç |
|---|---|---|
| `git clone` | 2,7 sn | SHA `2e67d11` (klon anındaki HEAD) |
| `npm ci` | 17,7 sn | exit 0 — "added 21 packages, and audited 22 packages in 17s" |
| `npm run build` | 37,4 sn | exit 0 |
| Tam test bataryası | 0,4 sn | ceza 41/41 · finans 11/11 · kapsama 86 senaryo / 0 boş satır |

Yerel doğrulama (hal düzeltmesi sonrası): build 16,0 sn exit 0, testler aynı.

### KAPI 2 — Canlı içerik kanıtı (patatesci.vercel.app)
| Kanıt | Beklenen | Canlı çıktı |
|---|---|---|
| Deploy senkron | commit = push | `"commitSHA":"e98aaf7d..."` |
| Katalog sayıları | hal + borsa dolu | `{"kategori":5,"urun":51,"cesit":94,"halCesit":85,"borsaUrun":3}` — **anlık değer**: `cesit = halCesit + borsaCesit` (85+9). `halCesit` hal listesinin o günkü satır sayısıdır ve **günlük değişir** (ilk ölçümde 84 idi); belgelerde sabit kabul edilmez, canlı sayı `/api/denetim`'dedir |
| Hal tazeliği | bugünün listesi | `{"tarih":"05.08.2026","guncelleme":"2026-08-05T08:01:09.512Z","canli":true}` |
| Ana sayfa bandı damgası | kaynak + tarih | `Ankara Hal · 05.08.2026` |
| Bandda borsa ürünü | çeşitleriyle | `Fındık (Tombul/Çakıldak/Sivri)` |
| Borsa referansı API'de | Tombul | `Tombul` (borsaReferans) |
| 81 il haritası | gerçek geometri | `/tr-81-il.svg` → 88 `<path>` |
| Güvenlik başlıkları | CSP+HSTS+XFO | üçü de mevcut (`X-Frame-Options: DENY`) |
| robots denetim izni | Allow | `Allow: /api/denetim` |
| Oturumsuz sipariş işlemi | 401 | **401** |
| Bozuk JSON | 400 (5xx değil) | **400** |

**KAPI 2 bir hata yakaladı ve kapattı:** ilk deploy'da `halCesit: 0`,
`tarih: null` (Vercel salt-okunur FS önbellek yazımını kırıyordu) → bellek içi
önbellek + hataya dayanıklı yazma ile düzeltildi (`e98aaf7`), yeniden
doğrulandı.

### KAPI 3 — Dış denetçi paketi
- `GET /api/denetim` — commitSHA, buildZamani, testOzeti (gerçek koşum
  çıktısından: `scripts/testleri-calistir.mjs` → `tests/sonuclar.json`),
  katalogSayilari (canlı hal verisinden), sonHalGuncelleme, guvenlik
  (`docs/guvenlik-ozet.json`). Sahte sabit değer yok.
- `docs/GUVENLIK-RAPORU.md` — makine okunur ilk satır:
  `GUVENLIK-OZET: kritik=0 yuksek=1 orta=0 dusuk=1`
- Canlı doğrulama: `"kritikAcik":0,"yuksekAcik":1`

## Tur 2: Next 16 + Skill kurulumu + Cila (5 Ağustos 2026, öğleden sonra)

**Mühürlenen SHA:** `7bd2ae5098a044fdef5ce62c70ea4c15519f0f03`

### Next 16 geçişi (backlog #1 — Y-4 kapanışı)
Ayrı dal (`next16-gecisi`) → `next@16 + react@19 + react-dom@19 +
eslint-config-next@16` → **npm audit 0 açık**. Next 16'da `cookies()` async
olduğu için 6 API ucunda `await cookies()` gerekti; **bu kırılmayı build DEĞİL,
E2E yakaladı** (5 uç 500 dönüyordu). E2E 25/25 sonrası master'a merge.

| Kapı | Kanıt |
|---|---|
| KAPI 1 | build 16,1 sn exit 0 · birim 52/52 · kapsama 86/0 · E2E 25/25 (0,7 sn) |
| KAPI 2 | canlı `"kritikAcik":0,"yuksekAcik":0` · `"e2e":"25/25"` · `Ankara Hal · 05.08.2026` |
| KAPI 3 | `/api/denetim` güncel; `docs/guvenlik-ozet.json` yuksekAcik 1→0 |

### KAPI 2'nin yakaladığı ikinci kritik hata
`GET /api/onkayit` canlıda **503** dönüyordu — ön kayıt (ana dönüşüm hedefi)
çalışmıyordu. Kök neden: Vercel'de proje dizini salt okunur, `store.json`
yazılamıyor. Düzeltme: dosya deposu Vercel'de `/tmp` altına alındı, okuma
salt-okunur ortamda tohum veriyle çökmüyor, sayaç okunamazsa GET 0 dönüyor.
**Canlı doğrulama:** GET `{"toplam":0}` → POST **201** `{"toplam":1}` →
mükerrer **422**. (Kalıcılık için Upstash hâlâ kuyrukta.)

### Lighthouse (mobil, 3 tur medyan)
| Ortam | Perf | A11y | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|
| Lokal, Next 16 (önce) | 81 | 100 | 100 | 3.053 ms | 456 ms | 0 |
| Lokal, iki düzeltme sonrası | **83** | 100 | 100 | 3.204 ms | 373 ms | 0 |
| **Canlı (Vercel)** | **81** (turlar 81/93/80) | **100** | **100** | 2.565–2.937 ms | 232–528 ms | **0** |

**Düzeltilen en büyük 2 sorun:** (1) harita SVG 304→192 KB (%37, koordinat
yuvarlama; 88 path ve animasyon korundu), (2) 16 IntersectionObserver + 7
scroll dinleyicisi → **tek paylaşımlı gözlemci** (TBT 456→373 ms).

**Dürüst durum:** Perf hedefi **90+ tutmadı (medyan 81)**. Next 14.2.35'te
skor ~95'ti; düşüş Next 16 + React 19 hidrasyon maliyetinden geliyor. Bu
bilinçli bir denge: **güvenlik (0 açık) performansın önüne alındı.** Kalan iş
(fold altı bileşenlerin `next/dynamic` ile ertelenmesi, font subset daraltma)
kuyrukta. A11y ve SEO 100, CLS 0.

### Skill kurulumu (Ö1)
Her iki repoda `.claude/skills/` altında **44 skill**, frontmatter doğrulaması
44/44. Kurulanlar: superpowers (14), impeccable (1, `doctor.mjs` → "No drift
found."), find-skills (1, `npx skills list` → 44 kayıt). **Kısmi:** claude-mem
(19 skill dosyası kuruldu, hafıza motoru kurulmadı) ve OmniRoute (9 skill,
gateway kurulmadı) — ikisi de **global yapılandırma + kalıcı servis + LLM
trafiğinin üçüncü taraf gateway'e yönlendirilmesi** gerektirdiği için operatör
onayına bırakıldı (kuyrukta K1/K2/K3).

### Güvenlik özeti (Ö4)
Kapatılan: **K-1 IDOR** (yetkisiz sipariş işlemi → 403), Y-1 sınırsız
tonaj/fiyat, Y-2 menşe whitelist + NFC, Y-3 hız sınırı (429), O-1 güvenlik
başlıkları, O-2 bozuk JSON 400, O-3 prototip kirletme.
Açık (gerekçeli): **Y-4** postcss/next zinciri — Next 14 hattında yama yok,
tek çözüm major (Next 16 denendi, peer çatışması → 14.2.35'te tutuldu);
istismar için saldırgan kontrollü CSS build'i gerekir, projede yol yok.
D-1 hız sınırı bellek içi (serverless'ta dağıtık sayaç kuyrukta).
Strix çalıştırılamadı: **Docker yok** → kuyrukta.
