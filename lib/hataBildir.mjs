// Hata bildirim iskeleti — SIR YOK, BAĞIMLILIK YOK.
// SENTRY_DSN env tanımlıysa olay Sentry store API'sine POST edilir; değilse
// yapılandırılmış JSON log'a düşer (Vercel log'larında aranabilir).
// Gerçek SDK'ya geçiş (performans izleme vb.) operatör kararıdır — bu iskelet
// DSN gelir gelmez çalışır durumda olsun diye vardır.

function dsnAyristir(dsn) {
  // https://<publicKey>@<host>/<projectId>
  const m = String(dsn).match(/^https:\/\/([^@]+)@([^/]+)\/(\d+)$/);
  if (!m) return null;
  return { publicKey: m[1], host: m[2], projectId: m[3] };
}

export async function hataBildir(err, baglam = {}) {
  const kayit = {
    seviye: "error",
    zaman: new Date().toISOString(),
    mesaj: String(err?.message || err),
    yigin: String(err?.stack || "").split("\n").slice(0, 12).join("\n"),
    surum: process.env.VERCEL_GIT_COMMIT_SHA || "yerel",
    ...baglam,
  };
  // Her durumda yapılandırılmış log (Vercel Functions log'unda aranabilir)
  console.error("HATA_KAYDI " + JSON.stringify(kayit));

  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return { gonderildi: false, neden: "SENTRY_DSN tanımsız (iskelet modu)" };
  const p = dsnAyristir(dsn);
  if (!p) return { gonderildi: false, neden: "DSN ayrıştırılamadı" };
  try {
    const r = await fetch(`https://${p.host}/api/${p.projectId}/store/?sentry_key=${p.publicKey}&sentry_version=7`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: kayit.mesaj,
        level: "error",
        release: kayit.surum,
        platform: "node",
        timestamp: kayit.zaman,
        extra: baglam,
        exception: { values: [{ type: err?.name || "Error", value: kayit.mesaj, stacktrace: undefined }] },
      }),
      signal: AbortSignal.timeout(4000),
    });
    return { gonderildi: r.ok };
  } catch {
    return { gonderildi: false, neden: "Sentry'ye ulaşılamadı" };
  }
}
