// Tüm hukuki sayfalarda zorunlu taslak bandı (avukat onayı öncesi).
export default function TaslakUyari() {
  return (
    <div
      style={{
        background: "#fef3e2",
        border: "1px solid #f0d9b5",
        borderRadius: 10,
        padding: "12px 16px",
        margin: "18px 0 26px",
        fontSize: ".9rem",
        color: "#7a4b12",
      }}
    >
      <b>TASLAK METİN:</b> Bu sayfa, hal mevzuatına hâkim bir avukat ve mali
      müşavir onayından geçmemiş çalışma taslağıdır; bağlayıcı sözleşme metni
      onay sonrası bu adreste yayımlanacaktır.
    </div>
  );
}
