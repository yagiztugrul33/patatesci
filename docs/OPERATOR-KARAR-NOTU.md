# OPERATÖR KARAR NOTU — 4 madde
5 Ağustos 2026 · Kod yazılmadı, hiçbiri uygulanmadı — dördü de senin kararını bekliyor.

---

## 1. Upstash Redis bağlansın mı? (tek env, iki kazanım)

**Ne:** Ücretsiz Upstash Redis hesabı açıp `UPSTASH_REDIS_REST_URL` +
`UPSTASH_REDIS_REST_TOKEN` değişkenlerini Vercel'e eklemek.

**Neden:** İki açık sorun tek hamleyle kapanıyor.
- **Ön kayıt kalıcılığı:** şu an kayıtlar Vercel'in `/tmp` dizininde tutuluyor.
  Sunucu örneği yenilenince **silinir**. Yani bugün gelen ön kayıtlar yarın
  duruyor olmayabilir. Kod zaten Upstash'i destekliyor (`lib/onkayitStore.js`) —
  env gelince otomatik devreye girer, tek satır kod değişmez.
- **Dağıtık hız sınırı (D-1, tek açık güvenlik bulgusu):** mevcut sınır bellek
  içi; Vercel'in her sunucu örneği kendi sayacını tutuyor, yani sınır fiilen
  örnek sayısı kadar gevşiyor. Upstash sayacı bunu gerçek sınıra çevirir.

**Senden ne gerekiyor:** Vercel → patatesci → Storage → Upstash Redis (ücretsiz
plan, bölge: Frankfurt) → projeye bağla → Redeploy. Env otomatik gelir.
*(Alternatif: upstash.com'dan hesap açıp iki değişkeni elle eklemek.)*

**Yapmazsan:** ön kayıtlar kalıcı olmaz; hız sınırı zayıf kalır. Sistem çalışır
ama toplanan e-postalar güvende değildir.

---

## 2. claude-mem yerel modda kurulsun mu? (öneri: EVET)

**Ne:** `npx claude-mem install` — oturumlar arası kalıcı hafıza. Skill
dosyaları zaten kurulu; bu, motoru (hook + arka plan worker + yerel SQLite)
devreye alır.

**Neden:** Her yeni oturum proje bağlamını sıfırdan keşfediyor (dosya okuma,
git log, durum tespiti) — bu oturumun deneyimine göre **~15–40k token**.
Hafıza motoru bunun bir kısmını hazır özet olarak verirse **oturum başına
~%10–20 tasarruf** beklenir. *(Tahmin — ölçülmedi, DOĞRULANAMADI.)*

**Riskleri (dürüst):** `~/.claude` altına **global hook** yazar (bu makinedeki
tüm Claude Code oturumlarını etkiler, sadece bu üç projeyi değil) ve **kalıcı
bir arka plan süreci** çalıştırır. Konuşma içeriği yerel SQLite'a düz metin
yazılır — disk şifreli değilse kod parçaları ve iş kararları orada durur.

**Senden ne gerekiyor:** "kur" demen yeterli. **Cloud sync (cmem.ai Pro)
KAPALI kalacak** — açılırsa proje verisi üçüncü tarafa gider; önerim kapalı.
Geri alma kolay: hook kaydını silmek.

**Not:** İkinci motor **OmniRoute'u önermiyorum** — tüm LLM trafiğinin tek
geçitten akması ve **bütün sağlayıcı anahtarlarının tek yerde toplanması**,
kazandırdığı maliyet tasarrufuna göre orantısız risk. Ayrıntı:
`patatesci/docs/MOTOR-KARARI.md`.

---

## 3. Preview SSO duvarı kaldırılsın mı? (ihaleal + remaxboss)

**Ne:** Vercel → ilgili proje → Settings → Deployment Protection → kapat
(veya bypass token üret).

**Neden:** Her iki projenin staging preview'ı `state: success` ama URL'ler
`302 → vercel.com/sso-api` veriyor. Yani **dış denetçi (sen veya
Cowork-Claude) yapılan işi canlıda göremiyor** — üç kapılı rejimin "canlı
eşlik" ayağı bu iki projede kanıtlanamıyor. Ajanlar hesap girişi yapmadı
(yetkileri yok, doğru davranış).

**Senden ne gerekiyor:** İki projede ayarı kapatmak, ya da bypass token verip
bana iletmek (token gizli tutulur, curl başlığında kullanılır).

**Yapmazsan:** ihaleal ve remaxboss'ta "deploy başarılı" bilgisine güvenmek
zorunda kalırız; içerik doğrulaması yapılamaz. patatesci'de bu sorun yok
(public, `/api/denetim` açık).

---

## 4. remaxboss `staging` → `master` PR'ı açılsın mı?

**Ne:** 7 commit'lik staging dalını master'a almak için PR:
https://github.com/yagiztugrul33/remax-boss-v2/pull/new/staging

**İçerik (tasarım değişikliği SIFIR):**
- `tel:` bağlantılarındaki boşluklar kaldırıldı (RFC 3966) — 386 örnek
  düzeltildi, **görünen telefon metni 127 sayfada aynen korundu**.
- SEO: sayfa `openGraph` tanımları site geneli alanları düşürüyordu
  (Next.js deep-merge yapmıyor) → `og:site_name` 78 eksik → 0, `og:locale`
  52 → 0, `og:type` 42 → 0, `og:url` 18 → 0.
- 3 sayfanın TR metinleri EN diline ayrıldı.

**Doğrulama:** GitHub'dan çekilen temiz klonda `npm ci` 114 sn · build exit 0 ·
**test 40/40**.

**Neden senin kararın:** master'a merge = **canlı siteye çıkar**. Public içerik
değişikliği olduğu için ajan kendiliğinden yapmadı; `master` dokunulmadan
duruyor (`32e1d12`).

**Senden ne gerekiyor:** "PR aç" (ben açarım, sen merge edersin) veya "merge et"
(ben yaparım) ya da "bekle".

**Ek küçük karar (kapsam dışı bırakıldı):** `/en/ekibimiz/<slug>` sayfalarında
14 danışmanın açıklaması hâlâ Türkçe. "MAXX Sistem"/"RAPP Sistem" gibi RE/MAX'e
özgü program adlarının kurumsal İngilizcesi doğrulanamadığı için **çevrilmedi**
(uydurmamak için). Doğru karşılıkları verirsen tamamlanır.
