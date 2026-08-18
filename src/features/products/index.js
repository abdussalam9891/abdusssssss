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
