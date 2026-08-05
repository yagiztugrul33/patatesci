# TASARIM SİSTEMİ — açık & minimal

İki proje aynı token **yapısını** konuşur; tek fark marka vurgu rengidir.
patatesci: `app/globals.css` `:root` · ihaleal: staging'de eşdeğer token dosyası.

## Palet

| Rol | Token | patatesci | ihaleal |
|---|---|---|---|
| Zemin | `--zemin` | `#ffffff` | `#ffffff` |
| Kırık beyaz | `--zemin-yumusak` | `#f7f8f7` | `#f7f8f7` |
| Açık gri | `--zemin-gri` | `#eef1ee` | `#eef1ee` |
| Metin | `--metin` | `#1e2a24` | `#1e2a24` |
| İkincil metin | `--metin-ikincil` | `#5f6b64` | `#5f6b64` |
| **Vurgu** | `--vurgu` | **`#2e8b63`** (yeşil) | **`#1E40AF`** (lacivert) |
| Vurgu koyu | `--vurgu-koyu` | `#25714f` | — |
| Vurgu yumuşak | `--vurgu-yumusak` | `#eaf3ee` | — |
| Çizgi | `--cizgi` | `#e8ede9` | `#e8ede9` |

**Vurgu yalnız üç yerde kullanılır: CTA · bildirim · aktif durum.** Kart ikonu,
ürün ikonu, etiket gibi öğeler **nötrdür** — bilgi renkte değil, metindedir.

**Fonksiyonel istisna:** `--danger` (`#b3392e`) hata/uyarı anlamı taşır,
dekoratif vurgu değildir. Erişilebilirlik gereği renk tek başına anlam
taşımaz; yanında metin/ikon bulunur.

## Tipografi
Inter (patatesci'de `next/font` ile self-host, TR karakterler için
`latin-ext` altkümesi dahil). Başlık `600`, gövde `400`, satır yüksekliği
`1.6`, harf aralığı başlıklarda `-0.02em`. Sayılar `tabular-nums`.

## Boşluk
**8px grid.** Bölüm dolgusu 64px (mobilde 48px), kart içi 24px, form alanı
aralığı 14px. Cömert whitespace; ayrım için **renk yerine boşluk** tercih
edilir.

## Yükselti (gölge)
Neredeyse görünmez: `--golge-kucuk: 0 1px 2px rgba(30,42,36,.04)` ·
`--golge-buyuk: 0 8px 24px rgba(30,42,36,.06)`. Ağır gölge ve çift çizgi yok.

## Köşe
`--kose: 14px` (kart, panel) · `--kose-kucuk: 10px` (buton, input).

## Bileşen kuralları (5 madde)

1. **Ayrım için önce boşluk, sonra 1px çizgi.** Kutu içine kutu koyma; kart
   zaten bir sınırdır, içine ikinci çerçeve girmez.
2. **Koyu panel ve gradyan duvarı yok.** Bölüm ayrımı kırık beyaz zemin +
   üst/alt 1px çizgiyle kurulur. *(Tek istisna: telefon mockup'ının gövdesi —
   o bir cihaz temsilidir, sayfa duvarı değil.)*
3. **Tek vurgu.** Bir ekranda vurgu rengi yalnız birincil eylemde bulunur.
   İkinci bir renk gerekiyorsa önce "gerçekten gerekli mi" sorulur.
4. **Hareket taşımaz.** Yalnız `transform`/`opacity`, 150–200 ms, layout
   kaydırmaz; `prefers-reduced-motion` her animasyonda saygı görür.
5. **Klavye görünür.** Her etkileşimli öğede `:focus-visible` halkası
   (2px vurgu, 2px offset); fare tıklamasında görünmez.

## Hangi araç neyi sağladı

| Araç | Kaynak | Katkısı |
|---|---|---|
| **impeccable** | `pbakaus/impeccable` | Arayüz denetim çerçevesi (hiyerarşi, kontrast, boşluk, anti-pattern). `doctor.mjs` ile sürüklenme kontrolü. |
| **Emil Kowalski seti** (7 skill) | `emilkowalski/skills` | `animate`, `animation-vocabulary`, `apple-design`, `improve-animations`, `review-animations`, `find-animation-opportunities`, `pick-ui-library` — hareket dili ve Apple tasarım prensipleri. |
| **Taste** | `Leonxlnx/taste-skill` → `design-taste-frontend` | Jenerik/şablon hissini kırmak için tat kriterleri. |
| **superpowers** | `obra/superpowers` | Çalışma disiplini (doğrulama, plan, kod incelemesi). |
| **Playwright MCP** | `@playwright/mcp` | `.mcp.json` ile tanımlandı; **sonraki oturumda bağlanır** (bu oturumda `claude` CLI PATH'te olmadığı için canlı bağlantı doğrulanamadı → DOĞRULANAMADI). |

## Önce / sonra — patatesci (ölçüm)

| Ölçüt | Önce | Sonra |
|---|---|---|
| Koyu bölüm duvarı | 2 (`.dark-section`, `.rakamlar`) | **0** |
| Dekoratif vurgu rengi | 3 (amber, kırmızı, mor) | **0** (yalnız yeşil CTA) |
| Çoklu vurgu kullanımı | 20 yer (10+5+5) | **0** |
| Erişilebilirlik (Lighthouse) | 100 | **100** (3/3 tur) |
| E2E | 25/25 | **25/25** |
| Güvenlik | 0 kritik / 0 yüksek | **değişmedi** |

**Ekran görüntüsü kanıtı yok — DOĞRULANAMADI:** Playwright MCP bu oturumda
aktif değil ve tarayıcı paneli localhost'a bağlanamadı (`chrome-error://`).
Doğrulama HTML/CSS ölçümü ve Lighthouse ile yapıldı. Görsel kanıt bir sonraki
oturumda Playwright MCP ile alınabilir.
