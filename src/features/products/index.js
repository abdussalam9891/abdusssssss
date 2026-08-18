import {
  restoreProductsStateFromURL,
  updateProductsURL,
} from "./query.js";

import {
  productsState,
} from "./state.js";

import {
  fetchProducts,
} from "./api.js";

import {
  renderProductsGrid,
  renderProductsLoading,
  renderProductsError,
} from "./grid.js";

import {
  renderProductsPagination,
} from "./pagination.js";

import {
  renderProductsHero,
  updateHeroCount,
} from "./hero.js";

import {
  renderProductsToolbar,
  initToolbarEvents,
} from "./toolbar.js";

import {
  renderProductsFilters,
  restoreFilterUI,
  initFilterEvents,
} from "./filters.js";


async function loadProducts() {

  renderProductsLoading();


  try {

    await fetchProducts();


    // ========================================
    // RENDER GRID
    // ========================================

    renderProductsGrid();


    // ========================================
    // RENDER TOOLBAR
    // ========================================

    renderProductsToolbar();


    // ========================================
    // RENDER PAGINATION
    // ========================================

    renderProductsPagination(
      async (page) => {

        productsState.page =
          page;


        updateProductsURL();


        await loadProducts();


        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

      }
    );


    // ========================================
    // HERO COUNT
    // ========================================

    updateHeroCount();


  } catch (error) {

    console.error(
      "[Products] Failed to load:",
      error
    );


    // The hero, toolbar and filters stay on screen; only the
    // backend-dependent grid degrades.
    productsState.products = [];

    productsState.total = 0;

    productsState.totalPages = 0;


    renderProductsError();


    renderProductsToolbar();


    renderProductsPagination(
      () => {}
    );


    updateHeroCount();

  }
}


export async function initProductsPage() {

  // ========================================
  // PAGE CHECK
  // ========================================

  if (
    !document.getElementById(
      "productsHero"
    )
  ) {
    return;
  }


  // ========================================
  // RESTORE URL STATE
  // ========================================

  restoreProductsStateFromURL();


  // ========================================
  // STATIC UI
  // ========================================

  renderProductsHero();

  renderProductsToolbar();

  renderProductsFilters();


  // ========================================
  // RESTORE FILTER UI
  // ========================================

  restoreFilterUI();


  // ========================================
  // FILTER EVENTS
  // ========================================

  initFilterEvents(
    loadProducts
  );


  // ========================================
  // TOOLBAR EVENTS
  // ========================================

  initToolbarEvents(
    loadProducts
  );


  // ========================================
  // INITIAL API REQUEST
  // ========================================

  await loadProducts();

}
