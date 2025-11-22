/**
 * French translations
 */

import type { TableTranslations } from "../types";

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
    selectedCount: "{count} sélectionnés",
    clearFilters: "Effacer les filtres",
    noResultsFound: "Aucun résultat trouvé.",
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

