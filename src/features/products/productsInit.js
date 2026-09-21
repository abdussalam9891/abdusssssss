import {
  restoreProductsStateFromURL,
  updateProductsURL,
} from "./query.js";

import {
  productsState,
} from "./state.js";

import {
  fetchProducts,
  fetchCategoryFacets,
  hasFreshProductsCache,
} from "./api.js";

import {
  applyProductsPipeline,
} from "./pipeline.js";

import {
  normalizeForComparison,
} from "../../utils/categoryMatch.js";

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
  renderCategoryOptions,
  syncPriceSliderBounds,
} from "./filters.js";


function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Fixed entry points (navbar/footer links like "Rings") link with a
// human-friendly, generic slug (e.g. "rings"), but store admins are
// free to only ever create more specific subCategory values (e.g.
// "Silver bracelet") with no generic "Bracelet" entry at all. Once
// real values are known, resolve any filter that doesn't already
// exact-match a live value:
//   1. Prefer an exact normalized match (format/casing/plural only).
//   2. Otherwise, treat the slug as a category-level match and pull
//      in every real value that contains it as a whole word (e.g.
//      "bracelets" -> "Silver bracelet"), since those products do
//      belong to that nav category even without a generic entry.
// Returns true only if a filter value was corrected/expanded.
function reconcileCategoryFilterWithFacets() {

  if (!productsState.categoryOptions.length) {
    return false;
  }

  let changed = false;

  const resolved = [];

  productsState.filters.categories.forEach(
    (selected) => {

      if (
        productsState.categoryOptions.includes(
          selected
        )
      ) {
        resolved.push(selected);
        return;
      }

      const normalizedSelected =
        normalizeForComparison(selected);

      const exactMatch =
        productsState.categoryOptions.find(
          (option) =>
            normalizeForComparison(option) ===
            normalizedSelected
        );

      if (exactMatch) {
        changed = true;
        resolved.push(exactMatch);
        return;
      }

      const wordBoundary = new RegExp(
        `\\b${escapeRegExp(normalizedSelected)}\\b`
      );

      const containsMatches =
        productsState.categoryOptions.filter(
          (option) =>
            wordBoundary.test(
              normalizeForComparison(option)
            )
        );

      if (containsMatches.length) {
        changed = true;
        resolved.push(...containsMatches);
        return;
      }

      resolved.push(selected);

    }
  );

  productsState.filters.categories =
    [...new Set(resolved)];

  return changed;
}


// The category checkbox list has no dedicated taxonomy endpoint to
// read from, so it's sampled from real product data in the
// background. This must never block the initial grid render, and a
// failure here must stay isolated to the category filter group.
async function loadCategoryFilterOptions() {

  try {

    await fetchCategoryFacets();

    renderCategoryOptions();


    // Only re-requests when a nav-link slug actually needed
    // correcting against real backend data — a normal checkbox
    // selection already exact-matches, so this is a no-op then.
    if (reconcileCategoryFilterWithFacets()) {

      updateProductsURL();

      await loadProducts();

    }

  } catch (error) {

    console.error(
      "[Products] Failed to load category filter options:",
      error
    );

  }
}


// Everything downstream of the fetched product set: the price /
// collection filter, the sort and the pagination the backend can't
// do (see pipeline.js), then the UI that reflects them.
function renderProducts() {

  const requestedPage =
    productsState.page;


  applyProductsPipeline();


  // A bookmarked ?page=9, or a filter that shrank the result set,
  // gets clamped to the last real page — keep the URL in step
  // with what is actually on screen.
  if (productsState.page !== requestedPage) {
    updateProductsURL();
  }


  renderProductsGrid();


  renderProductsToolbar();


  renderProductsPagination(
    async (page) => {

      productsState.page =
        page;


      updateProductsURL();


      // Paging never changes what the backend returns, so this
      // re-slices the already-fetched set instead of refetching.
      renderProducts();


      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    }
  );


  updateHeroCount();
}


async function loadProducts() {

  // Sort, price, collection and page changes are all served from
  // the cached result set — showing a spinner for them would flash
  // the grid away for no reason.
  const willHitNetwork =
    !hasFreshProductsCache();


  if (willHitNetwork) {
    renderProductsLoading();
  }


  try {

    await fetchProducts();


    // The slider's top end must reflect this fetch's actual
    // priciest product before the grid (and toolbar count) render,
    // not after — otherwise a filter narrowed by the stale bound
    // would flash and then jump.
    syncPriceSliderBounds(
      productsState.fetchedProducts
    );


    renderProducts();


  } catch (error) {

    console.error(
      "[Products] Failed to load:",
      error
    );


    // The hero, toolbar and filters stay on screen; only the
    // backend-dependent grid degrades.
    productsState.fetchedProducts = [];

    productsState.products = [];

    productsState.total = 0;

    productsState.totalPages = 0;


    renderProductsError(loadProducts);


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

  initToolbarEvents();


  // ========================================
  // CATEGORY FILTER OPTIONS (independent)
  // ========================================

  // Fire-and-forget: must not delay or block the product grid.
  loadCategoryFilterOptions();


  // ========================================
  // INITIAL API REQUEST
  // ========================================

  await loadProducts();

}
