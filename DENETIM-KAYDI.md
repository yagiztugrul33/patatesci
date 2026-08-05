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
| Katalog sayıları | hal + borsa dolu | `{"kategori":5,"urun":51,"cesit":94,"halCesit":85,"borsaUrun":3}` |
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

### Güvenlik özeti (Ö4)
Kapatılan: **K-1 IDOR** (yetkisiz sipariş işlemi → 403), Y-1 sınırsız
tonaj/fiyat, Y-2 menşe whitelist + NFC, Y-3 hız sınırı (429), O-1 güvenlik
başlıkları, O-2 bozuk JSON 400, O-3 prototip kirletme.
Açık (gerekçeli): **Y-4** postcss/next zinciri — Next 14 hattında yama yok,
tek çözüm major (Next 16 denendi, peer çatışması → 14.2.35'te tutuldu);
istismar için saldırgan kontrollü CSS build'i gerekir, projede yol yok.
D-1 hız sınırı bellek içi (serverless'ta dağıtık sayaç kuyrukta).
Strix çalıştırılamadı: **Docker yok** → kuyrukta.
