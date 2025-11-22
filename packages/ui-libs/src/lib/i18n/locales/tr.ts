/**
 * Turkish translations
 */

import type { TableTranslations } from "../types";

export const turkishTranslations: TableTranslations = {
  pagination: {
    previous: "Önceki",
    next: "Sonraki",
    first: "İlk",
    last: "Son",
    page: "Sayfa",
    of: "/",
    rowsPerPage: "Sayfa başına satır",
    goToPage: "Sayfaya git",
    totalRecords: "Toplam: {total} kayıt",
    showingXtoYofZ: "{total} kayıttan {from}-{to} arası gösteriliyor",
    noData: "Veri bulunamadı",
  },

  filters: {
    search: "Ara",
    searchAllColumns: "Tüm sütunlarda ara...",
    showFilter: "Filtreyi Göster",
    hideFilter: "Filtreyi Gizle",
    clearFilter: "Filtreyi temizle",
    clearAllFilters: "Tüm filtreleri temizle",
    filterBy: "{column} sütununa göre filtrele",
    all: "Tümü",
    true: "Doğru",
    false: "Yanlış",
    min: "Min",
    max: "Maks",
    from: "Başlangıç",
    to: "Bitiş",
    selectOption: "Seçenek seçin",
    noOptionsFound: "Seçenek bulunamadı",
  },

  sorting: {
    sortAscending: "Artan sıralama",
    sortDescending: "Azalan sıralama",
    clearSort: "Sıralamayı temizle",
    sortBy: "{column} sütununa göre sırala",
  },

  columns: {
    hide: "Gizle",
    show: "Göster",
    toggleVisibility: "Sütun görünürlüğünü değiştir",
    resetColumns: "Sütunları sıfırla",
    reorderColumns: "Sütunları yeniden sırala",
    resizeColumn: "Sütun boyutunu değiştir",
  },

  selection: {
    selectAll: "Tümünü seç",
    selectRow: "Satırı seç",
    deselectAll: "Seçimi kaldır",
    selectedCount: "{count} seçildi",
    selectAllOnPage: "Bu sayfadakilerin tümünü seç",
    selectAllRows: "Tüm satırları seç",
  },

  status: {
    loading: "Yükleniyor...",
    error: "Bir hata oluştu",
    noResults: "Sonuç bulunamadı",
    retry: "Tekrar dene",
    loadMore: "Daha fazla yükle",
  },

  security: {
    rateLimitExceeded: "İstek sınırı aşıldı. Lütfen daha sonra tekrar deneyin.",
    invalidInput: "Geçersiz girdi tespit edildi",
    fileSizeExceeded: "Dosya boyutu sınırı aşıldı",
    fileTypeNotAllowed: "Dosya türüne izin verilmiyor",
    inputTooLong: "Girdi çok uzun",
  },

  accessibility: {
    sortColumn: "{column} sütununu sırala",
    filterColumn: "{column} sütununu filtrele",
    selectAllRows: "Tüm satırları seç",
    selectRow: "{row} satırını seç",
    columnHeader: "{column} sütun başlığı",
    tableCaption: "{rows} satır ve {columns} sütunlu veri tablosu",
    resizeHandle: "{column} sütununu yeniden boyutlandır",
    dragHandle: "{column} sütununu yeniden sıralamak için sürükle",
  },
};

