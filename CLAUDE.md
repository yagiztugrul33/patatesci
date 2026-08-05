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
- Performans/optimizasyon kararları **ölçümle** verilir. Yerel Lighthouse bu
  makinede ±5 puan oynuyor → karar için **PageSpeed Insights** kullanılır.
  Ölçümle elenen yollar kuyruğa "tekrar denenmesin" notuyla yazılır.

## Dokunulmaz çekirdek

`lib/db.js` fonksiyon imzaları · `/api` uçlarının sözleşmesi · piyasa bandı
denetimi · eşleşme motoru · sipariş durum makinesi · oturum sistemi · route
yapısı. Değişiklik gerekiyorsa önce gerekçe + test.
