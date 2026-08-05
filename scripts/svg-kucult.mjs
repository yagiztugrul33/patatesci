// Harita SVG'sini küçültür: path koordinatlarındaki gereksiz ondalıkları atar.
// viewBox 1007x527 olduğu için 1 ondalık basamak görsel olarak yeterlidir.
import { readFileSync, writeFileSync, statSync } from "fs";

const yol = "public/tr-81-il.svg";
const once = statSync(yol).size;
let s = readFileSync(yol, "utf8");

// d="..." içindeki sayıları 1 ondalığa yuvarla
s = s.replace(/\sd="([^"]+)"/g, (tam, d) => {
  const yeni = d.replace(/-?\d+\.\d+/g, (n) => {
    const y = Math.round(parseFloat(n) * 10) / 10;
    return String(y);
  });
  return ` d="${yeni}"`;
});
// XML yorumlarını ve fazla boşlukları at
s = s.replace(/<!--[\s\S]*?-->/g, "").replace(/\n\s*\n/g, "\n").replace(/>\s+</g, "><");

writeFileSync(yol, s);
const sonra = statSync(yol).size;
console.log(`SVG: ${Math.round(once / 1024)}KB -> ${Math.round(sonra / 1024)}KB (%${Math.round((1 - sonra / once) * 100)} kucuk)`);
