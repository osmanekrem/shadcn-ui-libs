/**
 * Spanish translations
 */

import type { TableTranslations } from "../types";

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

