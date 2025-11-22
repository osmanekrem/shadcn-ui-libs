# Shadcn Registry - Maintainable Build System

Bu registry sistemi, kaynak dosyalardan otomatik olarak shadcn registry JSON dosyaları oluşturur.

## 🏗️ Yapı

```
packages/ui-libs/
├── registry.config.json    # Component tanımları ve dosya mapping'leri
├── scripts/
│   └── build-registry.js   # Build script (otomatik JSON oluşturur)
└── registry/
    ├── datatable.json      # Otomatik oluşturulan registry dosyası
    └── multi-select.json   # Otomatik oluşturulan registry dosyası
```

## 🚀 Kullanım

### Registry Dosyalarını Oluşturma

```bash
npm run build:registry
```

Bu komut:
1. `registry.config.json` dosyasını okur
2. Her component için `src/` klasöründeki dosyaları okur
3. Import path'lerini `@/` alias'larına dönüştürür
4. `registry/` klasörüne JSON dosyalarını yazar

### Build Sürecine Entegrasyon

Registry build otomatik olarak ana build sürecine entegre edilmiştir:

```bash
npm run build        # CSS + Registry + Rollup
npm run build:prod   # Production build (Registry dahil)
```

## 📝 Yeni Component Ekleme

1. **registry.config.json'a component ekleyin:**

```json
{
  "components": {
    "yeni-component": {
      "name": "yeni-component",
      "type": "components:custom",
      "description": "Component açıklaması",
      "registryDependencies": ["button"],
      "dependencies": ["lucide-react"],
      "files": [
        {
          "src": "src/components/custom/yeni-component.tsx",
          "dest": "components/custom/yeni-component.tsx",
          "type": "components:component"
        }
      ]
    }
  }
}
```

2. **Build script'i çalıştırın:**

```bash
npm run build:registry
```

3. **Registry dosyası otomatik oluşturulur:**

`registry/yeni-component.json` dosyası oluşturulur.

## 🔧 Import Transformasyonları

Build script otomatik olarak import path'lerini dönüştürür:

- `../../lib/utils` → `@/lib/utils`
- `../../types/types` → `@/types/types`
- `../../ui/button` → `@/components/ui/button`
- `../filter-input` → `@/components/custom/filter-input`

## 📦 Registry Kullanımı

### Lokal Kullanım

```json
{
  "registries": {
    "@tanstack-shadcn-table": "../../packages/ui-libs/registry/{name}.json"
  }
}
```

### Remote Kullanım (GitHub)

```json
{
  "registries": {
    "@tanstack-shadcn-table": "https://raw.githubusercontent.com/osmanekrem/tanstack-shadcn-table/main/packages/ui-libs/registry/{name}.json"
  }
}
```

Sonra:

```bash
npx shadcn@latest add datatable --registry @tanstack-shadcn-table
```

## ✨ Avantajlar

1. **Maintainable**: Kaynak dosyalar tek kaynak, registry otomatik oluşturulur
2. **Type-Safe**: TypeScript dosyaları doğrudan kullanılır
3. **Otomatik**: Build sürecine entegre, manuel işlem yok
4. **Esnek**: Yeni component eklemek kolay (sadece config güncelle)
5. **Consistent**: Import path'leri otomatik dönüştürülür

## 🔄 Workflow

```
1. src/ klasöründe kod yaz
   ↓
2. registry.config.json'da component tanımla
   ↓
3. npm run build:registry
   ↓
4. registry/*.json dosyaları otomatik oluşturulur
   ↓
5. Kullanıcılar shadcn CLI ile ekleyebilir
```

## 📚 Daha Fazla Bilgi

- [USAGE.md](./USAGE.md) - Detaylı kullanım örnekleri
- [Ana README](../README.md) - Genel dokümantasyon
