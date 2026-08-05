# Motor Kurulum Kararı — claude-mem ve OmniRoute

> **Bu bir karar notudur; hiçbir motor kurulmadı, hiçbir servis başlatılmadı,
> hiçbir API anahtarı üretilmedi.** Skill dosyaları (44 adet) her iki repoda
> `.claude/skills/` altında kurulu ve çalışıyor. Aşağıdaki iki motor operatör
> kararı bekliyor. Karar verilene kadar mevcut düzen bozulmaz.

## 1. claude-mem (thedotmack/claude-mem)

**(a) Ne yapar**
Oturumlar arası kalıcı hafıza. Konuşma sırasında gözlem çıkarır, SQLite
veritabanına yazar; yeni oturum başlarken ilgili geçmiş bağlamı otomatik
enjekte eder. `mem-search` skill'i ile "bunu daha önce nasıl çözmüştük?"
sorusu geçmiş oturumlarda aranır.

**(b) Riski**
- `~/.claude` altına **global hook** kaydeder (`SessionStart`,
  `UserPromptSubmit`) — bu makinedeki **tüm** Claude Code oturumlarını etkiler,
  yalnız bu üç projeyi değil.
- **Kalıcı arka plan worker** çalıştırır (süreç sürekli ayakta kalır).
- Konuşma içeriği yerel SQLite'a yazılır: kod parçaları, dosya yolları, iş
  kararları. Disk şifreli değilse bu veriler düz metin olarak durur.
- Hook zinciri bozulursa oturum başlangıcı etkilenebilir (geri alma:
  hook kaydını silmek).

**(c) API anahtarı / gizlilik**
Temel çalışma için **harici anahtar gerekmez** — her şey yerelde. İsteğe bağlı
"cloud sync" (cmem.ai Pro) bulut hesabı ister; **bu özellik açılmamalı**
(müşteri/proje verisi üçüncü tarafa gider). Yerel mod veri dışarı göndermez.

**(d) Token tasarrufu tahmini**
Bu oturumun deneyimine dayanarak: her yeni oturumda proje bağlamını yeniden
keşfetmek (dosya okuma, git log, durum tespiti) **~15–40k token** tutuyor.
Hafıza motoru bunun bir kısmını hazır özet olarak verirse oturum başına
**~10–25k token** tasarruf beklenir. Karşılığında her oturuma **~2–5k token**
enjeksiyon maliyeti eklenir. Net: **oturum başına ~%10–20 tasarruf**, uzun
projelerde daha yüksek. *Bu bir tahmindir, ölçülmedi — DOĞRULANAMADI.*

## 2. OmniRoute (diegosouzapw/OmniRoute)

**(a) Ne yapar**
Model yönlendirme geçidi. 14 yönlendirme stratejisiyle (öncelik, ağırlıklı,
round-robin, maliyet-optimize…) istekleri farklı sağlayıcı/modellere dağıtır.
`auto/cheap` (token başına en ucuz) ve `auto/coding` (kalite öncelikli) gibi
kanallar tanımlanabilir; basit/mekanik işler ucuz modele, karmaşık akıl
yürütme pahalı modele gider. Ayrıca istem sıkıştırma modülleri var.

**(b) Riski — en ağır madde**
- **Tüm LLM trafiği `localhost:20128`'deki bir ara sunucudan geçer.** Yerelde
  çalışsa bile bu, konuşmaların tamamının (kod, sırlar, iş kararları) bir ara
  katmanda toplanması demektir; log tutuyorsa disk üzerinde birikir.
- Global npm paketi + **kalıcı sunucu süreci** gerektirir.
- Sağlayıcı anahtarlarının bu geçide **girilmesi** gerekir — yani API
  anahtarları tek bir yerde toplanır; geçit ele geçirilirse hepsi sızar.
- Yönlendirme yanlış yapılandırılırsa kritik işler sessizce zayıf modele
  düşebilir ve kalite düşüşü fark edilmeden birikir.
- Bağımlılık: geçit çökerse **tüm** LLM erişimi durur (tek hata noktası).

**(c) API anahtarı / gizlilik**
Çalışması için **en az bir sağlayıcı API anahtarı** ister. Bu turda hiçbir
anahtar üretilmedi, hiçbir sağlayıcı bağlanmadı, hiçbir yere yazılmadı.
Kurulacaksa: anahtarlar ortam değişkeninde tutulmalı, log seviyesi kapalı
olmalı, geçit yalnız `127.0.0.1`'e bağlanmalı (dış arayüze açılmamalı).

**(d) Token tasarrufu tahmini**
İki kaynaktan: (1) ucuz modele yönlendirme — bu oturumdaki mekanik işlerin
(dosya okuma, grep, basit düzenleme) payı kabaca **%40–60**; bunlar ucuz
modele giderse **maliyet** ciddi düşer (token sayısı değil, birim fiyat).
(2) İstem sıkıştırma — depo iddiası %60–90, **doğrulanmadı**. Gerçekçi beklenti:
**maliyet olarak %30–50 tasarruf**, token sayısında sınırlı değişim.
*Ölçülmedi — DOĞRULANAMADI.*

## Öneri (karar operatörün)

| Motor | Öneri | Gerekçe |
|---|---|---|
| **claude-mem** | **Kurulabilir** (yerel mod, cloud sync KAPALI) | Riski yönetilebilir (yerel, anahtarsız), token kazancı somut. Geri alma kolay: hook kaydını sil. |
| **OmniRoute** | **Şimdilik kurulmasın** | Tüm LLM trafiğinin tek geçitten akması + anahtarların tek yerde toplanması, kazandırdığı maliyet tasarrufuna göre orantısız risk. Önce yalnız *okuma yapan* bir maliyet ölçümüyle (cli-cost-usage) fiili dağılım ölçülmeli; ucuz-model payı gerçekten yüksekse yeniden değerlendirilir. |

**Karar verilirse yapılacaklar (tek komut, onay sonrası):**
- claude-mem: `npx claude-mem install` → ardından `mem-search` ile doğrulama.
- OmniRoute: `npm i -g omniroute` → `127.0.0.1` bağlaması + anahtar ortam
  değişkeninden + log kapalı + `auto/cheap` ve `auto/coding` kanalları.

Karar gelene kadar bu dosya kuyrukta bekler (`SABAH_ONAY_KUYRUGU.md` madde 1-2).
