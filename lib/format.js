// Tutarlı sayı ve para birimi biçimlendirme (1.250,50 ₺ standardı).

export function fmtSayi(n, ondalik = 2) {
  const v = Number(n);
  if (isNaN(v)) return "—";
  return v.toLocaleString("tr-TR", {
    minimumFractionDigits: ondalik,
    maximumFractionDigits: ondalik,
  });
}

export function fmtTL(n, ondalik = 2) {
  return `${fmtSayi(n, ondalik)} ₺`;
}

export function fmtTLkg(n, ondalik = 2) {
  return `${fmtSayi(n, ondalik)} ₺/kg`;
}

export function fmtKg(n) {
  const v = Number(n);
  if (isNaN(v)) return "—";
  return `${v.toLocaleString("tr-TR")} kg`;
}
