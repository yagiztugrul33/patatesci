// Kurumsal ikon seti — tek renk, çizgi stili, 24px grid.
// Ürün ikonları ve arayüz ikonları currentColor kullanır; renk CSS'ten gelir.

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function Svg({ size = 24, children, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...base}
      {...rest}
    >
      {children}
    </svg>
  );
}

/* ---------- Ürün ikonları ---------- */

export function IconPatates(props) {
  return (
    <Svg {...props}>
      <ellipse cx="12" cy="12.5" rx="8" ry="6" transform="rotate(-12 12 12.5)" />
      <circle cx="9" cy="11.5" r="0.4" fill="currentColor" stroke="none" />
      <circle cx="13.5" cy="14.5" r="0.4" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10.5" r="0.4" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function IconSogan(props) {
  return (
    <Svg {...props}>
      <path d="M12 8.5c-3.6 0-6 2.4-6 5.4 0 3.2 2.7 5.1 6 5.1s6-1.9 6-5.1c0-3-2.4-5.4-6-5.4Z" />
      <path d="M12 8.5V19" />
      <path d="M9.5 9.2C9.9 13 9.9 16 12 19c2.1-3 2.1-6 2.5-9.8" />
      <path d="M10.5 8.6 9.8 5.2M12 8.5V4.6M13.5 8.6l.7-3.4" />
    </Svg>
  );
}

export function IconDomates(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="13.5" r="6.5" />
      <path d="M12 7c-.4-1.2-.2-2.2.4-3" />
      <path d="M8.6 8.3 7 7.4M12 7l-1.5-1.4M12 7l1.7-1.2M15.4 8.3 17 7.6" />
    </Svg>
  );
}

export function IconBiber(props) {
  return (
    <Svg {...props}>
      <path d="M14.5 7.5c2 0 3.5 1.6 3.5 4 0 4.2-3.2 8.5-6.5 8.5-2.3 0-3.5-1.6-3.5-4 0-4.4 3.3-8.5 6.5-8.5Z" />
      <path d="M15 7.4c0-1.5.8-2.6 2.5-3" />
      <path d="M15 7.4c-1 .1-1.9.5-2.7 1.1" />
    </Svg>
  );
}

export function IconSalatalik(props) {
  return (
    <Svg {...props}>
      <rect x="4" y="9.6" width="16" height="5" rx="2.5" transform="rotate(-18 12 12)" />
      <path d="M19.4 8.2l1.3-.9" />
      <circle cx="9" cy="12.6" r="0.35" fill="currentColor" stroke="none" />
      <circle cx="12.5" cy="11.6" r="0.35" fill="currentColor" stroke="none" />
      <circle cx="15.7" cy="10.4" r="0.35" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function IconHavuc(props) {
  return (
    <Svg {...props}>
      <path d="M14.5 9.5c1.6 1.6 1.2 3.4-.4 6-1.7 2.7-4.3 5-5.6 3.7-1.3-1.3 1-3.9 3.7-5.6 2.6-1.6 4.4-2 6-.4" />
      <path d="M14.5 9.5 13 11M16.5 11.5 15 13" />
      <path d="M15.5 8.5c-.3-1.4.1-2.7 1.2-3.7M15.5 8.5c1.4.3 2.7-.1 3.7-1.2M15.5 8.5l-.9-2.1" />
    </Svg>
  );
}

const PRODUCT_ICONS = {
  patates: IconPatates,
  sogan: IconSogan,
  domates: IconDomates,
  biber: IconBiber,
  salatalik: IconSalatalik,
  havuc: IconHavuc,
};

export function ProductIcon({ id, size = 24, ...rest }) {
  const C = PRODUCT_ICONS[id] || IconUrun;
  return <C size={size} {...rest} />;
}

export function IconUrun(props) {
  return (
    <Svg {...props}>
      <path d="M4.5 9.5h15l-1.2 9a2 2 0 0 1-2 1.7H7.7a2 2 0 0 1-2-1.7l-1.2-9Z" />
      <path d="M8.5 9.5c0-3 1.4-5 3.5-5s3.5 2 3.5 5" />
    </Svg>
  );
}

/* ---------- Arayüz ikonları ---------- */

export function IconKalkan(props) {
  return (
    <Svg {...props}>
      <path d="M12 3.5 5 6v5.2c0 4.4 2.9 7.6 7 9.3 4.1-1.7 7-4.9 7-9.3V6l-7-2.5Z" />
      <path d="m9 12 2.2 2.2L15.4 10" />
    </Svg>
  );
}

export function IconTarti(props) {
  return (
    <Svg {...props}>
      <path d="M12 4.5v3M7 7.5h10" />
      <path d="M7 7.5 4.5 13a2.6 2.6 0 0 0 5 0L7 7.5ZM17 7.5 14.5 13a2.6 2.6 0 0 0 5 0L17 7.5Z" />
      <path d="M12 7.5V19M8.5 19h7" />
    </Svg>
  );
}

export function IconKamera(props) {
  return (
    <Svg {...props}>
      <rect x="3" y="7" width="12.5" height="10" rx="2" />
      <path d="m15.5 10.5 5-2.5v8l-5-2.5" />
    </Svg>
  );
}

export function IconBelge(props) {
  return (
    <Svg {...props}>
      <path d="M7 3.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V5A1.5 1.5 0 0 1 7 3.5Z" />
      <path d="M14 3.5V8h4.2" />
      <path d="M9 12h6M9 15.5h6" />
    </Svg>
  );
}

export function IconKamyon(props) {
  return (
    <Svg {...props}>
      <path d="M3 6.5h11v9H3z" />
      <path d="M14 9.5h4l3 3v3h-7" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </Svg>
  );
}

export function IconOnay(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.3 12.2 2.5 2.5 4.9-5" />
    </Svg>
  );
}

export function IconUyari(props) {
  return (
    <Svg {...props}>
      <path d="M12 4 3.5 19h17L12 4Z" />
      <path d="M12 10v4M12 16.8v.2" />
    </Svg>
  );
}

export function IconKilit(props) {
  return (
    <Svg {...props}>
      <rect x="5.5" y="10.5" width="13" height="9" rx="1.8" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    </Svg>
  );
}

export function IconKutu(props) {
  return (
    <Svg {...props}>
      <path d="M4 8.2 12 4l8 4.2v7.6L12 20l-8-4.2V8.2Z" />
      <path d="M4 8.2 12 12l8-3.8M12 12v8" />
    </Svg>
  );
}

export function IconKullanici(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5.5 19.5c.8-3.2 3.4-5 6.5-5s5.7 1.8 6.5 5" />
    </Svg>
  );
}

export function IconGrafik(props) {
  return (
    <Svg {...props}>
      <path d="M4 4.5v15h16" />
      <path d="m7 14 3.5-4 3 2.5L18 7.5" />
    </Svg>
  );
}

export function IconArtiDaire(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8.5v7M8.5 12h7" />
    </Svg>
  );
}

export function IconKonum(props) {
  return (
    <Svg {...props}>
      <path d="M12 21s-6.5-5.3-6.5-10a6.5 6.5 0 0 1 13 0c0 4.7-6.5 10-6.5 10Z" />
      <circle cx="12" cy="10.6" r="2.3" />
    </Svg>
  );
}

export function IconTelefon(props) {
  return (
    <Svg {...props}>
      <rect x="7" y="3" width="10" height="18" rx="2.4" />
      <path d="M10.5 5.2h3M11 18.4h2" />
    </Svg>
  );
}

export function IconYukari(props) {
  return (
    <Svg {...props}>
      <path d="m6 14 6-6 6 6" />
    </Svg>
  );
}

export function IconAsagi(props) {
  return (
    <Svg {...props}>
      <path d="m6 10 6 6 6-6" />
    </Svg>
  );
}
