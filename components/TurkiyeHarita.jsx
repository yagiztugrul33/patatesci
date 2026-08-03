// Stilize Türkiye haritası — 81 il vurgusu, iller üzerinde yayılan nokta animasyonu.
// Coğrafi olarak temsilidir; reklam görselidir.

const ILLER = [
  [205, 138], [95, 112], [150, 138], [242, 178], [182, 262], [218, 322],
  [385, 322], [432, 262], [432, 178], [332, 190], [598, 296], [558, 312],
  [678, 306], [728, 296], [778, 258], [792, 296], [895, 238], [808, 170],
  [700, 122], [560, 112], [498, 96], [560, 228], [620, 180], [688, 248],
  [262, 288], [212, 200], [758, 122], [885, 152], [648, 262], [368, 232],
  [512, 190], [292, 240],
];

export default function TurkiyeHarita() {
  return (
    <div className="harita-wrap">
      <svg viewBox="0 0 980 420" xmlns="http://www.w3.org/2000/svg" aria-label="Türkiye haritası — 81 ilde kuruluyoruz" role="img">
        {/* stilize ana kara */}
        <path
          d="M120,96
             C150,84 178,86 196,102
             Q205,116 198,128
             Q210,138 214,148
             C260,128 320,116 430,112
             Q455,100 470,92
             C520,96 560,112 620,116
             C700,118 760,108 830,126
             Q880,136 905,150
             C930,170 940,200 935,235
             Q928,258 915,275
             Q900,290 880,300
             C830,318 790,312 755,318
             L700,322
             Q694,338 690,352
             Q680,364 668,368
             Q658,354 655,340
             Q648,332 640,330
             C590,330 545,338 505,332
             C460,326 430,342 395,346
             Q370,340 350,332
             C300,326 275,338 250,330
             Q238,338 228,344
             Q218,334 215,322
             Q200,300 208,282
             Q200,270 196,262
             Q186,252 180,246
             Q186,236 190,228
             Q182,218 176,208
             Q184,196 190,188
             Q186,176 182,166
             Q190,156 200,150
             Q206,138 198,128
             Q186,134 170,140
             Q152,136 140,132
             Q126,126 118,118
             Z"
          fill="var(--accent-soft)"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeOpacity="0.45"
          strokeLinejoin="round"
        />
        {/* il noktaları: yayılan halka + sabit nokta */}
        {ILLER.map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <circle className="il-ring" r="5" style={{ animationDelay: (i % 8) * 0.45 + "s" }} />
            <circle className="il-dot" r="4" style={{ animationDelay: (i % 8) * 0.45 + "s" }} />
          </g>
        ))}
      </svg>
      <div className="harita-rozet">
        <b className="num">81 il</b>
        <span>hedef kapsama</span>
      </div>
    </div>
  );
}
