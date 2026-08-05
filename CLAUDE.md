# patatesci — Çalışma Kuralları

## KALICI KURAL: Tek çalışma ağacında tek oturum

Aynı klasörde **aynı anda iki oturum/ajan çalışmaz.** İki bağımsız ajan bu
kuralın ihlalini ayrı ayrı raporladı: `git add -A` karşı tarafın dosyalarını
süpürdü, commit mesajları içeriği yansıtmaz hale geldi, commit sırası karıştı.

Paralel iş gerekiyorsa:
- `git worktree add ../<proje>-<is> <dal>` ile **ayrı worktree**, veya
- ayrı klasöre **ayrı klon**.

Ek olarak: paralel ihtimali varken `git add -A` yerine **dosya adıyla ekleme**
(`git add <yol1> <yol2>`) kullanılır.

## Yayın ve doğrulama düzeni

- Her anlamlı değişiklik grubu: **build (0 hata) → Türkçe commit → push**.
  Push edilmemiş iş bırakılmaz. `master` doğrudan Vercel'e deploy olur.
- `data/store.json`, `node_modules`, `.next` asla commit'lenmez.
- **Üç kapı** (bir iş bu üçü geçmeden "bitti" sayılmaz):
  1. **Soğuk doğrulama** — temiz klon → `npm ci` → build → tam test (süre damgalı).
  2. **Canlı eşlik** — deploy sonrası curl ile **içerik** kanıtı; "200 döndü" yetmez.
  3. **Dış denetçi izi** — `/api/denetim` + `DENETIM-KAYDI.md` güncel ve tutarlı.
- Test bataryası: `node scripts/testleri-calistir.mjs` (birim + kapsama + E2E).
  E2E `tests/e2e.mjs` sunucu ayaktayken koşar; **Git Bash curl'ü Türkçe
  karakterleri bozuyor**, testler Node `fetch` ile yazılır.

## Kanıt disiplini

- Kanıtlanamayan hiçbir sayı/kural yazılmaz → **DOĞRULANAMADI** listesine gider
  (`docs/sigorta-ve-teminat.md`, `docs/finansal-model.md`).
- Hız hedef değildir: hatalı bitirmektense yarıda bırakıp kuyruğa yazmak
  (`SABAH_ONAY_KUYRUGU.md`) her zaman tercihtir.
- Performans/optimizasyon kararları **ölçümle** verilir. Ölçümle elenen yollar
  kuyruğa "tekrar denenmesin" notuyla yazılır.
- **Lighthouse bu makinede çalışmıyor (2026-08-06, askıda).** Dört yol denendi:
  (1) `npx lighthouse` → "No Chrome installations found"; (2) Playwright'ın
  chromium'u `CHROME_PATH` ile → `Launcher.spawn` hatası; (3) Edge ile → aynı
  spawn zinciri; (4) 240 sn timeout → `ETIMEDOUT`. Skor iddiası (ör. "Perf 90")
  bu makinede **kanıtlanamaz** ve yazılmaz.
- Yerine **Playwright ile doğrudan tarayıcı ölçümü** kullanılır: LCP, CLS, DOM
  düğüm sayısı, istek sayısı ve **kaç ayrı origin'e gidildiği**. Bunlar skor
  değil ama gerçek ve tekrarlanabilir. Ekran görüntüsü de buradan alınır —
  DOM/CSS taramasının göremediği şeyleri (ör. PNG logo içindeki renkler)
  yalnızca görsel kanıt yakalar.

## Dokunulmaz çekirdek

`lib/db.js` fonksiyon imzaları · `/api` uçlarının sözleşmesi · piyasa bandı
denetimi · eşleşme motoru · sipariş durum makinesi · oturum sistemi · route
yapısı. Değişiklik gerekiyorsa önce gerekçe + test.
