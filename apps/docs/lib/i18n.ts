export interface TableTranslations {
  // Pagination
  pagination: {
    previous: string;
    next: string;
    first: string;
    last: string;
    page: string;
    of: string;
    rowsPerPage: string;
    goToPage: string;
    totalRecords: string;
    showingXtoYofZ: string; // "Showing {from} to {to} of {total} entries"
    noData: string;
  };

  // Filters
  filters: {
    search: string;
    searchAllColumns: string;
    showFilter: string;
    hideFilter: string;
    clearFilter: string;
    clearAllFilters: string;
    filterBy: string;
    all: string;
    true: string;
    false: string;
    min: string;
    max: string;
    from: string;
    to: string;
    selectOption: string;
    noOptionsFound: string;
  };

  // Sorting
  sorting: {
    sortAscending: string;
    sortDescending: string;
    clearSort: string;
    sortBy: string;
  };

  // Column management
  columns: {
    hide: string;
    show: string;
    toggleVisibility: string;
    resetColumns: string;
    reorderColumns: string;
    resizeColumn: string;
  };

  // Row selection
  selection: {
    selectAll: string;
    selectRow: string;
    deselectAll: string;
    selectedCount: string; // "{count} selected"
    selectAllOnPage: string;
    selectAllRows: string;
  };

  // Loading and errors
  status: {
    loading: string;
    error: string;
    noResults: string;
    retry: string;
    loadMore: string;
  };

  // Security
  security: {
    rateLimitExceeded: string;
    invalidInput: string;
    fileSizeExceeded: string;
    fileTypeNotAllowed: string;
    inputTooLong: string;
  };

  // Accessibility
  accessibility: {
    sortColumn: string;
    filterColumn: string;
    selectAllRows: string;
    selectRow: string;
    columnHeader: string;
    tableCaption: string;
    resizeHandle: string;
    dragHandle: string;
  };
}

// Default English translations
export const defaultTranslations: TableTranslations = {
  pagination: {
    previous: "Previous",
    next: "Next",
    first: "First",
    last: "Last",
    page: "Page",
    of: "of",
    rowsPerPage: "Rows per page",
    goToPage: "Go to page",
    totalRecords: "Total: {total} records",
    showingXtoYofZ: "Showing {from} to {to} of {total} entries",
    noData: "No data available",
  },

  filters: {
    search: "Search",
    searchAllColumns: "Search all columns...",
    showFilter: "Show Filter",
    hideFilter: "Hide Filter",
    clearFilter: "Clear filter",
    clearAllFilters: "Clear all filters",
    filterBy: "Filter by {column}",
    all: "All",
    true: "True",
    false: "False",
    min: "Min",
    max: "Max",
    from: "From",
    to: "To",
    selectOption: "Select option",
    noOptionsFound: "No options found",
  },

  sorting: {
    sortAscending: "Sort ascending",
    sortDescending: "Sort descending",
    clearSort: "Clear sort",
    sortBy: "Sort by {column}",
  },

  columns: {
    hide: "Hide",
    show: "Show",
    toggleVisibility: "Toggle column visibility",
    resetColumns: "Reset columns",
    reorderColumns: "Reorder columns",
    resizeColumn: "Resize column",
  },

  selection: {
    selectAll: "Select all",
    selectRow: "Select row",
    deselectAll: "Deselect all",
    selectedCount: "{count} selected",
    selectAllOnPage: "Select all on this page",
    selectAllRows: "Select all rows",
  },

  status: {
    loading: "Loading...",
    error: "An error occurred",
    noResults: "No results found",
    retry: "Retry",
    loadMore: "Load more",
  },

  security: {
    rateLimitExceeded: "Rate limit exceeded. Please try again later.",
    invalidInput: "Invalid input detected",
    fileSizeExceeded: "File size exceeds limit",
    fileTypeNotAllowed: "File type not allowed",
    inputTooLong: "Input is too long",
  },

  accessibility: {
    sortColumn: "Sort column {column}",
    filterColumn: "Filter column {column}",
    selectAllRows: "Select all rows",
    selectRow: "Select row {row}",
    columnHeader: "Column header {column}",
    tableCaption: "Data table with {rows} rows and {columns} columns",
    resizeHandle: "Resize column {column}",
    dragHandle: "Drag to reorder column {column}",
  },
};

// Turkish translations
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

// Spanish translations
export const spanishTranslations: TableTranslations = {
  pagination: {
    previous: "Anterior",
    next: "Siguiente",
    first: "Primero",
    last: "Último",
    page: "Página",
    of: "de",
    rowsPerPage: "Filas por página",
    goToPage: "Ir a la página",
    totalRecords: "Total: {total} registros",
    showingXtoYofZ: "Mostrando {from} a {to} de {total} entradas",
    noData: "No hay datos disponibles",
  },

  filters: {
    search: "Buscar",
    searchAllColumns: "Buscar en todas las columnas...",
    showFilter: "Mostrar Filtro",
    hideFilter: "Ocultar Filtro",
    clearFilter: "Limpiar filtro",
    clearAllFilters: "Limpiar todos los filtros",
    filterBy: "Filtrar por {column}",
    all: "Todos",
    true: "Verdadero",
    false: "Falso",
    min: "Mín",
    max: "Máx",
    from: "Desde",
    to: "Hasta",
    selectOption: "Seleccionar opción",
    noOptionsFound: "No se encontraron opciones",
  },

  sorting: {
    sortAscending: "Ordenar ascendente",
    sortDescending: "Ordenar descendente",
    clearSort: "Limpiar ordenación",
    sortBy: "Ordenar por {column}",
  },

  columns: {
    hide: "Ocultar",
    show: "Mostrar",
    toggleVisibility: "Alternar visibilidad de columna",
    resetColumns: "Restablecer columnas",
    reorderColumns: "Reordenar columnas",
    resizeColumn: "Redimensionar columna",
  },

  selection: {
    selectAll: "Seleccionar todo",
    selectRow: "Seleccionar fila",
    deselectAll: "Deseleccionar todo",
    selectedCount: "{count} seleccionados",
    selectAllOnPage: "Seleccionar todos en esta página",
    selectAllRows: "Seleccionar todas las filas",
  },

  status: {
    loading: "Cargando...",
    error: "Ocurrió un error",
    noResults: "No se encontraron resultados",
    retry: "Reintentar",
    loadMore: "Cargar más",
  },

  security: {
    rateLimitExceeded:
      "Límite de velocidad excedido. Inténtelo de nuevo más tarde.",
    invalidInput: "Entrada inválida detectada",
    fileSizeExceeded: "El tamaño del archivo excede el límite",
    fileTypeNotAllowed: "Tipo de archivo no permitido",
    inputTooLong: "La entrada es demasiado larga",
  },

  accessibility: {
    sortColumn: "Ordenar columna {column}",
    filterColumn: "Filtrar columna {column}",
    selectAllRows: "Seleccionar todas las filas",
    selectRow: "Seleccionar fila {row}",
    columnHeader: "Encabezado de columna {column}",
    tableCaption: "Tabla de datos con {rows} filas y {columns} columnas",
    resizeHandle: "Redimensionar columna {column}",
    dragHandle: "Arrastrar para reordenar columna {column}",
  },
};

// French translations
export const frenchTranslations: TableTranslations = {
  pagination: {
    previous: "Précédent",
    next: "Suivant",
    first: "Premier",
    last: "Dernier",
    page: "Page",
    of: "sur",
    rowsPerPage: "Lignes par page",
    goToPage: "Aller à la page",
    totalRecords: "Total : {total} enregistrements",
    showingXtoYofZ: "Affichage de {from} à {to} sur {total} entrées",
    noData: "Aucune donnée disponible",
  },

  filters: {
    search: "Rechercher",
    searchAllColumns: "Rechercher dans toutes les colonnes...",
    showFilter: "Afficher le filtre",
    hideFilter: "Masquer le filtre",
    clearFilter: "Effacer le filtre",
    clearAllFilters: "Effacer tous les filtres",
    filterBy: "Filtrer par {column}",
    all: "Tous",
    true: "Vrai",
    false: "Faux",
    min: "Min",
    max: "Max",
    from: "De",
    to: "À",
    selectOption: "Sélectionner une option",
    noOptionsFound: "Aucune option trouvée",
  },

  sorting: {
    sortAscending: "Tri croissant",
    sortDescending: "Tri décroissant",
    clearSort: "Effacer le tri",
    sortBy: "Trier par {column}",
  },

  columns: {
    hide: "Masquer",
    show: "Afficher",
    toggleVisibility: "Basculer la visibilité de la colonne",
    resetColumns: "Réinitialiser les colonnes",
    reorderColumns: "Réorganiser les colonnes",
    resizeColumn: "Redimensionner la colonne",
  },

  selection: {
    selectAll: "Tout sélectionner",
    selectRow: "Sélectionner la ligne",
    deselectAll: "Tout désélectionner",
    selectedCount: "{count} sélectionnés",
    selectAllOnPage: "Sélectionner tout sur cette page",
    selectAllRows: "Sélectionner toutes les lignes",
  },

  status: {
    loading: "Chargement...",
    error: "Une erreur s'est produite",
    noResults: "Aucun résultat trouvé",
    retry: "Réessayer",
    loadMore: "Charger plus",
  },

  security: {
    rateLimitExceeded:
      "Limite de débit dépassée. Veuillez réessayer plus tard.",
    invalidInput: "Entrée invalide détectée",
    fileSizeExceeded: "La taille du fichier dépasse la limite",
    fileTypeNotAllowed: "Type de fichier non autorisé",
    inputTooLong: "L'entrée est trop longue",
  },

  accessibility: {
    sortColumn: "Trier la colonne {column}",
    filterColumn: "Filtrer la colonne {column}",
    selectAllRows: "Sélectionner toutes les lignes",
    selectRow: "Sélectionner la ligne {row}",
    columnHeader: "En-tête de colonne {column}",
    tableCaption: "Tableau de données avec {rows} lignes et {columns} colonnes",
    resizeHandle: "Redimensionner la colonne {column}",
    dragHandle: "Glisser pour réorganiser la colonne {column}",
  },
};

// German translations
export const germanTranslations: TableTranslations = {
  pagination: {
    previous: "Zurück",
    next: "Weiter",
    first: "Erste",
    last: "Letzte",
    page: "Seite",
    of: "von",
    rowsPerPage: "Zeilen pro Seite",
    goToPage: "Gehe zu Seite",
    totalRecords: "Gesamt: {total} Datensätze",
    showingXtoYofZ: "Zeige {from} bis {to} von {total} Einträgen",
    noData: "Keine Daten verfügbar",
  },

  filters: {
    search: "Suchen",
    searchAllColumns: "In allen Spalten suchen...",
    showFilter: "Filter anzeigen",
    hideFilter: "Filter ausblenden",
    clearFilter: "Filter löschen",
    clearAllFilters: "Alle Filter löschen",
    filterBy: "Nach {column} filtern",
    all: "Alle",
    true: "Wahr",
    false: "Falsch",
    min: "Min",
    max: "Max",
    from: "Von",
    to: "Bis",
    selectOption: "Option auswählen",
    noOptionsFound: "Keine Optionen gefunden",
  },

  sorting: {
    sortAscending: "Aufsteigend sortieren",
    sortDescending: "Absteigend sortieren",
    clearSort: "Sortierung löschen",
    sortBy: "Nach {column} sortieren",
  },

  columns: {
    hide: "Ausblenden",
    show: "Anzeigen",
    toggleVisibility: "Spaltensichtbarkeit umschalten",
    resetColumns: "Spalten zurücksetzen",
    reorderColumns: "Spalten neu anordnen",
    resizeColumn: "Spaltengröße ändern",
  },

  selection: {
    selectAll: "Alle auswählen",
    selectRow: "Zeile auswählen",
    deselectAll: "Auswahl aufheben",
    selectedCount: "{count} ausgewählt",
    selectAllOnPage: "Alle auf dieser Seite auswählen",
    selectAllRows: "Alle Zeilen auswählen",
  },

  status: {
    loading: "Laden...",
    error: "Ein Fehler ist aufgetreten",
    noResults: "Keine Ergebnisse gefunden",
    retry: "Wiederholen",
    loadMore: "Mehr laden",
  },

  security: {
    rateLimitExceeded:
      "Ratenlimit überschritten. Bitte versuchen Sie es später erneut.",
    invalidInput: "Ungültige Eingabe erkannt",
    fileSizeExceeded: "Dateigröße überschreitet das Limit",
    fileTypeNotAllowed: "Dateityp nicht erlaubt",
    inputTooLong: "Eingabe ist zu lang",
  },

  accessibility: {
    sortColumn: "Spalte {column} sortieren",
    filterColumn: "Spalte {column} filtern",
    selectAllRows: "Alle Zeilen auswählen",
    selectRow: "Zeile {row} auswählen",
    columnHeader: "Spaltenüberschrift {column}",
    tableCaption: "Datentabelle mit {rows} Zeilen und {columns} Spalten",
    resizeHandle: "Spalte {column} in der Größe ändern",
    dragHandle: "Ziehen, um Spalte {column} neu anzuordnen",
  },
};

// Available languages
export const availableLanguages = {
  en: { name: "English", translations: defaultTranslations },
  tr: { name: "Türkçe", translations: turkishTranslations },
  es: { name: "Español", translations: spanishTranslations },
  fr: { name: "Français", translations: frenchTranslations },
  de: { name: "Deutsch", translations: germanTranslations },
} as const;

export type SupportedLanguage = keyof typeof availableLanguages;

/**
 * Simple template string replacement
 */
export function interpolate(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return values[key]?.toString() || match;
  });
}

/**
 * Get translation with interpolation support
 */
export function t(
  translations: TableTranslations,
  path: string,
  values?: Record<string, string | number>
): string {
  const keys = path.split(".");
  let result: any = translations;

  for (const key of keys) {
    result = result?.[key];
    if (result === undefined) {
      console.warn(`Translation key not found: ${path}`);
      return path;
    }
  }

  if (typeof result !== "string") {
    console.warn(`Translation value is not a string: ${path}`);
    return path;
  }

  return values ? interpolate(result, values) : result;
}

/**
 * Create a translation function bound to specific translations
 */
export function createTranslator(translations: TableTranslations) {
  return (path: string, values?: Record<string, string | number>) =>
    t(translations, path, values);
}
