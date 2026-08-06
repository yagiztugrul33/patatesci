// Next.js sunucu tarafı hata kancası: yakalanmamış istek hataları tek
// noktadan raporlanır (lib/hataBildir.mjs — DSN yoksa yapılandırılmış log).
export async function onRequestError(err, request) {
  const { hataBildir } = await import("./lib/hataBildir.mjs");
  await hataBildir(err, { yol: request?.path || request?.url || "", metot: request?.method || "" });
}
