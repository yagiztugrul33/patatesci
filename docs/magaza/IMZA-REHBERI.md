# Mobil İmzalama Rehberi (Android + iOS) — Operatör Çalıştıracak

> SIR İÇERMEZ. Bu doküman komutları ve adımları verir; üretilen keystore,
> şifre ve sertifikalar ASLA repoya girmez — yalnız GitHub Secrets +
> güvenli yedek (parola kasası). İki proje için de aynı akış geçerlidir
> (patatesci `mobil/`, ihaleal kök Capacitor).

## A) Android — keystore üretimi + Play App Signing

1. **Keystore üret** (yerel makinede, JDK kurulu olmalı; şifreyi kasaya yaz):

```bash
keytool -genkeypair -v -keystore patatesci-upload.keystore -alias patatesci-upload -keyalg RSA -keysize 2048 -validity 9125 -storetype JKS
```

   - `-validity 9125` = 25 yıl. Sorulan ad/kurum alanlarına şirket bilgisi.
   - Aynı komut ihaleal için `ihaleal-upload.keystore` / alias `ihaleal-upload`.

2. **Play App Signing (önerilen düzen):** Play Console → uygulama oluştur →
   Setup → App signing → **"Use Google-generated key"** seç. Böylece üretilen
   keystore yalnız **upload key** olur; asıl imza anahtarını Google saklar.
   Upload key sızarsa Play Console'dan yenisi tanımlanabilir (felaket kurtarma).

3. **GitHub Secrets'a ekle** (repo → Settings → Secrets and variables → Actions):

   | Secret adı | İçerik |
   |---|---|
   | `ANDROID_KEYSTORE_BASE64` | `base64 -w0 patatesci-upload.keystore` çıktısı |
   | `ANDROID_KEYSTORE_PASSWORD` | keystore şifresi |
   | `ANDROID_KEY_ALIAS` | `patatesci-upload` |
   | `ANDROID_KEY_PASSWORD` | anahtar şifresi (genelde store ile aynı) |

4. Release workflow (`.github/workflows/mobil-release.yml` taslağı) bu dört
   secret'ı bekler; secrets tanımlı değilse iş **bilerek başarısız olur** —
   imzasız yayın APK'sı üretilmez.

## B) iOS — sertifika + provisioning

Ön şart: **Apple Developer Program üyeliği (99 USD/yıl)** + macOS'lu bir
makine (yerel ya da CI'da `macos-latest`).

1. developer.apple.com → Certificates → **Apple Distribution** sertifikası
   oluştur (CSR'ı Keychain Access ile üret) → `.p12` olarak dışa aktar (şifreli).
2. Identifiers → App ID: `com.patatesci.app` (ihaleal: `com.ihaleal.app`) —
   `capacitor.config`'teki appId ile birebir aynı (ikisi de teyit edildi).
3. Profiles → **App Store** dağıtım profili oluştur → indir (`.mobileprovision`).
4. GitHub Secrets:

   | Secret adı | İçerik |
   |---|---|
   | `IOS_DIST_CERT_BASE64` | `.p12` dosyasının base64'ü |
   | `IOS_DIST_CERT_PASSWORD` | p12 şifresi |
   | `IOS_PROVISION_BASE64` | `.mobileprovision` base64 |
   | `APPSTORE_ISSUER_ID` / `APPSTORE_KEY_ID` / `APPSTORE_PRIVATE_KEY` | App Store Connect API anahtarı (otomatik yükleme için) |

5. Not: iki projede de iOS platformu mevcut (patatesci `mobil/ios`, ihaleal
   `ios/` — teyit edildi). `npx cap sync ios` CI'da koşulur.

## C) Mağaza hesapları (para + kimlik gerektirir — yalnız operatör)

1. **Google Play Console**: 25 USD tek seferlik. Kurumsal hesap için şirket
   + D-U-N-S gerekmez (Play'de gerekmiyor), ama satıcı doğrulaması ister.
2. **Apple Developer**: 99 USD/yıl. **Şirket hesabı için D-U-N-S numarası
   şart** (ücretsiz, dnb.com'dan başvuru ~1-2 hafta). Bireysel hesapla
   başlanabilir; şirkete devir sonradan mümkün ama sancılı — şirket kurulumu
   yakınsa D-U-N-S'u bekle.
3. KVKK: mağaza formlarındaki gizlilik URL'leri METADATA.md'de hazır.

## Sıra önerisi

Şirket kuruluşu → D-U-N-S başvurusu (paralel) → Play hesabı (25$) + Android
upload keystore → Android release → Apple Developer (99$) → iOS release.
Android'in Apple'ı beklemesi gerekmez.
