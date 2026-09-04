import { productService } from "../../services/productService.js";
import { productsState } from "./state.js";
import { isActiveProduct } from "../../utils/productStatus.js";
import {
  normalizeForComparison,
  toStringList,
} from "../../utils/categoryMatch.js";


/*
 * Only `subCategory` and `search` are real server-side filters on
 * the public store endpoint (verified against the live API — see
 * the note at the top of pipeline.js). Price, collection and sort
 * are applied in the browser, which means the whole matching set
 * has to be here, not one backend page of it: sorting or price-
 * filtering a single page would silently produce wrong results.
 *
 * So the backend is paged through in large chunks. The cap is a
 * safety net against an unexpectedly huge catalog, not an expected
 * limit — if it is ever hit, that is the point to ask the backend
 * team for real sort/price support rather than raising it.
 */
const SERVER_PAGE_LIMIT = 100;

const MAX_SERVER_PAGES = 20;


/*
 * Changing sort, price, collection or page must not re-hit the
 * network — none of them affect what the backend returns. Only a
 * category or search change does, so the fetched set is cached
 * against exactly those two.
 */
let cache = {
  key: null,
  products: [],
};


function getServerQueryKey() {

  return JSON.stringify({

    categories:
      [...productsState.filters.categories].sort(),

    search:
      productsState.search.trim().toLowerCase(),

  });
}


// Lets the caller skip the loading spinner for a change the cache
// already covers (sort, price, collection, page), so those feel
// instant instead of flashing an empty grid.
export function hasFreshProductsCache() {

  return cache.key === getServerQueryKey();
}


export async function fetchProducts() {

  const key =
    getServerQueryKey();


  if (cache.key === key) {

    productsState.fetchedProducts =
      cache.products;


    return cache.products;
  }


  const collected = [];

  let page = 1;

  let totalPages = 1;


  while (
    page <= totalPages &&
    page <= MAX_SERVER_PAGES
  ) {

    const response =
      await productService.getPublicProducts({

        page,

        limit: SERVER_PAGE_LIMIT,

        categories:
          productsState.filters.categories,

        search:
          productsState.search,

      });


    const data =
      response?.data || {};


    const products =
      Array.isArray(data.products)
        ? data.products
        : [];


    // The public store endpoint returns draft/unpublished products
    // too (status "Inactive"), same inconsistency the showcase tabs
    // already work around (see constants/showcaseProducts.js) — a
    // shopper should never see a product the admin hasn't published.
    collected.push(
      ...products.filter(isActiveProduct)
    );


    totalPages =
      Number(data.totalPages) || 1;


    // Defensive: a backend that ignores `page` would otherwise
    // loop MAX_SERVER_PAGES times over the same first page.
    if (products.length < SERVER_PAGE_LIMIT) {
      break;
    }


    page += 1;

  }


  cache = {
    key,
    products: collected,
  };


  productsState.fetchedProducts =
    collected;


  return collected;
}


/*
 * The category filter's checkbox options aren't a fixed enum —
 * store admins can create arbitrary subCategory values. There's no
 * dedicated facets/taxonomy endpoint, so this samples a broad,
 * unfiltered page of real products (independent of any active
 * filters/pagination) purely to discover which subCategory values
 * currently exist. Actual filtering still happens server-side via
 * fetchProducts(); this never replaces that.
 *
 * Callers must isolate failures (see loadCategoryFilterOptions in
 * index.js) — losing the facet list must not break the rest of
 * the filters UI or the product grid.
 */
export async function fetchCategoryFacets() {

  const response =
    await productService.getPublicProducts({
      page: 1,
      limit: SERVER_PAGE_LIMIT,
    });


  const data =
    response?.data || {};

  const products =
    Array.isArray(data.products)
      ? data.products
      : [];


  const seen = new Map();

  products
    .filter(isActiveProduct)
    .forEach((product) => {

      toStringList(product?.subCategory).forEach(
        (rawValue) => {

          const key =
            normalizeForComparison(rawValue);

          if (key && !seen.has(key)) {
            seen.set(key, rawValue.trim());
          }

        }
      );

    });


  productsState.categoryOptions =
    [...seen.values()].sort(
      (a, b) => a.localeCompare(b)
    );


  return productsState.categoryOptions;
}
