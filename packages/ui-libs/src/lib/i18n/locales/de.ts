/**
 * German translations
 */

import type { TableTranslations } from "../types";

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
    selectedCount: "{count} ausgewählt",
    clearFilters: "Filter löschen",
    noResultsFound: "Keine Ergebnisse gefunden.",
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

