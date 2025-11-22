# GitHub Actions Workflows

Bu dizin, proje için GitHub Actions CI/CD workflow'larını içerir.

## 📋 Workflow'lar

### 1. CI (`ci.yml`)

Ana CI workflow'u. Her push ve pull request'te çalışır.

**Özellikler:**

- ✅ Linting (ESLint)
- ✅ Type checking (TypeScript)
- ✅ Build (Turborepo ile tüm paketler)
- ✅ Test (varsa)
- ✅ Format check (Prettier)

**Çalışma Koşulları:**

- `main` ve `develop` branch'lerine push
- `main` ve `develop` branch'lerine pull request

**Job'lar:**

1. **lint** - Kod linting kontrolü
2. **type-check** - TypeScript tip kontrolü
3. **build** - Tüm paketlerin build edilmesi (lint ve type-check başarılı olduktan sonra)
4. **test** - Testlerin çalıştırılması (opsiyonel, hata olsa bile devam eder)
5. **format-check** - Kod format kontrolü (Prettier)

### 2. Release (`release.yml`)

NPM paketini yayınlamak için kullanılır.

**Çalışma Koşulları:**

- Version tag'i push edildiğinde (örn: `v1.2.0`)
- Manuel olarak workflow dispatch ile

**Özellikler:**

- Lint ve type check
- Build
- NPM'e publish
- GitHub Release oluşturma

**Gereksinimler:**

- `NPM_TOKEN` secret'ı GitHub repository settings'te tanımlanmalı

**Kullanım:**

```bash
# Tag ile release
git tag v1.2.0
git push origin v1.2.0

# Veya GitHub Actions UI'dan manuel olarak
```

### 3. CodeQL Analysis (`codeql.yml`)

Güvenlik açıklarını tespit etmek için CodeQL analizi yapar.

**Özellikler:**

- JavaScript/TypeScript kod analizi
- Güvenlik açığı tespiti
- Haftalık otomatik çalışma (Pazar günleri)

**Çalışma Koşulları:**

- `main` ve `develop` branch'lerine push
- `main` ve `develop` branch'lerine pull request
- Haftalık schedule (Pazar günleri 00:00 UTC)

## 🚀 Kullanım

### CI Workflow'unu Tetikleme

CI workflow'u otomatik olarak çalışır:

- Yeni bir commit push edildiğinde
- Pull request açıldığında veya güncellendiğinde

### Release Yapma

#### Yöntem 1: Tag ile

```bash
# 1. Versiyonu güncelle
cd packages/ui-libs
npm version patch  # veya minor, major

# 2. Tag'i push et
git push origin main --tags
```

#### Yöntem 2: Manuel

1. GitHub repository'de "Actions" sekmesine git
2. "Release" workflow'unu seç
3. "Run workflow" butonuna tıkla
4. Versiyon numarasını gir (örn: 1.2.0)
5. "Run workflow" butonuna tıkla

### NPM Token Ayarlama

1. GitHub repository'de "Settings" > "Secrets and variables" > "Actions" sekmesine git
2. "New repository secret" butonuna tıkla
3. Name: `NPM_TOKEN`
4. Value: NPM access token'ınızı yapıştırın
5. "Add secret" butonuna tıkla

**NPM Token Oluşturma:**

1. [npmjs.com](https://www.npmjs.com) hesabınıza giriş yapın
2. Profil > Access Tokens > Generate New Token
3. "Automation" veya "Publish" tipini seçin
4. Token'ı kopyalayın ve GitHub secret olarak ekleyin

## ⚙️ Konfigürasyon

### Node.js Versiyonu

Tüm workflow'lar Node.js 18 kullanır. Versiyonu değiştirmek için workflow dosyalarındaki `node-version` değerini güncelleyin.

### Timeout Ayarları

Her job için timeout süreleri tanımlanmıştır:

- Lint: 10 dakika
- Type Check: 10 dakika
- Build: 15 dakika
- Test: 10 dakika
- Format Check: 5 dakika

### Cache

npm cache otomatik olarak kullanılır. Bu, bağımlılık yükleme süresini önemli ölçüde azaltır.

### Concurrency

CI workflow'unda concurrency ayarı vardır. Aynı branch için çalışan eski workflow'lar iptal edilir.

## 📊 Workflow Durumu

Workflow durumunu kontrol etmek için:

1. GitHub repository'de "Actions" sekmesine git
2. Çalışan veya tamamlanmış workflow'ları görüntüle
3. Detayları görmek için workflow'a tıkla

## 🔧 Sorun Giderme

### Build Başarısız Oluyor

1. Lokal olarak build'i çalıştırın: `npm run build`
2. Hataları kontrol edin
3. TypeScript hatalarını düzeltin: `npm run check-types`
4. Lint hatalarını düzeltin: `npm run lint`

### Test Başarısız Oluyor

Test job'ı `continue-on-error: true` ile çalışır, bu yüzden build'i engellemez. Ancak testleri düzeltmek önerilir.

### Format Check Başarısız Oluyor

```bash
# Formatı düzelt
npm run format

# Değişiklikleri commit et
git add .
git commit -m "chore: format code"
```

### NPM Publish Başarısız Oluyor

1. `NPM_TOKEN` secret'ının doğru ayarlandığından emin olun
2. Token'ın publish yetkisi olduğundan emin olun
3. Paket adının ve versiyonunun benzersiz olduğundan emin olun

## 📝 Notlar

- Tüm workflow'lar Ubuntu latest üzerinde çalışır
- Turborepo cache'i kullanılır (daha hızlı build)
- Build artifacts 7 gün boyunca saklanır
- CodeQL analizi haftalık olarak otomatik çalışır
