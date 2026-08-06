import TaslakUyari from "../TaslakUyari";

export const metadata = {
  title: "Kullanıcı (Üyelik) Sözleşmesi",
  description:
    "patatesci platformu üyelik koşulları: hesap açma, doğrulama, skor sistemi, askıya alma ve fesih.",
};

export default function KullaniciSozlesmesi() {
  return (
    <main className="section">
      <div className="container legal">
        <p className="eyebrow">Hukuki bilgilendirme</p>
        <h1>Kullanıcı (Üyelik) Sözleşmesi</h1>
        <TaslakUyari />

        <h2>1. Taraflar ve konu</h2>
        <p>
          Bu sözleşme, patatesci platformunu ("Platform") işleten şirket ile
          Platforma üye olan gerçek veya tüzel kişi ("Üye") arasında, üyelik ve
          Platform kullanım koşullarını düzenler. Platform; üretici ile toptan
          alıcıyı buluşturan bir <b>aracı hizmet sağlayıcıdır</b>; satılan ürünün
          maliki veya satıcısı değildir.
        </p>

        <h2>2. Üyelik ve doğrulama</h2>
        <p>
          Üyelik; e-posta, ad-soyad/unvan ve rol (üretici, toptan alıcı,
          nakliyeci, tüketici) beyanıyla başlar. İlan verme ve teklif kabulü,
          rolüne göre künye/ÇKS/vergi kaydı doğrulaması ("Onaylı Üye")
          tamamlanmadan açılmaz. Üye, verdiği bilgilerin doğruluğundan sorumludur;
          yanlış beyan askıya alma sebebidir.
        </p>

        <h2>3. Şeffaf Ticaret Kuralları'nın bağlayıcılığı</h2>
        <p>
          <a href="/hukuki/ticaret-kurallari">Şeffaf Ticaret Kuralları</a> (fiyat
          bandı, tartı toleransı, iki taraflı ceza matrisi, hakem süreci, skor
          sistemi) bu sözleşmenin ayrılmaz ekidir. Üye, üyelikle birlikte bu
          kuralları kabul etmiş sayılır. Kurallardaki güncellemeler yayım anında
          yeni işlemlere uygulanır; devam eden işlemlere işlem anındaki sürüm uygulanır.
        </p>

        <h2>4. Skor, askıya alma ve ihraç</h2>
        <p>
          Her üye 100 puanla başlar. Kural ihlalleri kural kitabındaki puanlarla
          düşer: 60 altı geçici askı, 40 altı kalıcı ihraçtır. Askı ve ihraç,
          gerekçesi ve dayanak işlem kayıtlarıyla üyeye yazılı bildirilir.
        </p>

        <h2>5. Ücretler</h2>
        <p>
          Üyelik ücretsizdir. İşlem başına komisyon ve hizmet bedelleri{" "}
          <a href="/hukuki/guvenceli-odeme">Güvenceli Ödeme Şartları</a> ve ilan
          ekranlarında işlem öncesi açıkça gösterilir; ekranda gösterilmeyen
          hiçbir bedel tahsil edilmez.
        </p>

        <h2>6. Yasaklı davranışlar</h2>
        <p>
          Platform dışına yönlendirme yoluyla güvence sistemini dolanmak, yalandan
          teklif, menşe/kalite sahteciliği, başka üyenin hesabını kullanmak ve
          mevzuata aykırı ürün satışı yasaktır; tespiti halinde kural kitabındaki
          cezalar ve gerekiyorsa yasal yollar uygulanır.
        </p>

        <h2>7. Fesih</h2>
        <p>
          Üye, devam eden işlemi bulunmadığı her an üyeliğini sonlandırabilir.
          Platform, kural ihlalinde üyeliği askıya alabilir veya feshedebilir;
          güvence hesabındaki bakiyeler işlem sonuçlarına göre tasfiye edilir.
        </p>

        <h2>8. Kişisel veriler</h2>
        <p>
          Kişisel veriler <a href="/hukuki/kvkk">KVKK Aydınlatma Metni</a>{" "}
          kapsamında işlenir.
        </p>

        <h2>9. Uyuşmazlık</h2>
        <p>
          Öncelik platform içi hakem sürecidir (48 saatte gerekçeli karar).
          Hakem kararı tarafların yargı yoluna başvurma hakkını ortadan
          kaldırmaz. Yetkili mahkeme ve arabuluculuk şartı avukat onayıyla
          netleşecektir (TASLAK).
        </p>
      </div>
    </main>
  );
}
