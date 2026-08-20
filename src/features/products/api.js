import { productService } from "../../services/productService.js";
import { productsState } from "./state.js";
import {
  normalizeForComparison,
  toStringList,
} from "../../utils/categoryMatch.js";


export async function fetchProducts() {

  const price =
    productsState.filters.price;


  const response =
    await productService.getPublicProducts({

      page:
        productsState.page,

      limit:
        productsState.limit,

      categories:
        productsState.filters.categories,

      badges:
        productsState.filters.badges,

      minPrice:
        price?.min,

      maxPrice:
        price?.max,

      sort:
        productsState.sort,

      search:
        productsState.search,

    });


  const data =
    response?.data || {};


  productsState.products =
    Array.isArray(data.products)
      ? data.products
      : [];


  productsState.total =
    Number(data.total) || 0;


  productsState.totalPages =
    Number(data.totalPages) || 0;


  return data;
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
 * Callers must isolate failures (see initCategoryFilterOptions in
 * filters.js) — losing the facet list must not break the rest of
 * the filters UI or the product grid.
 */
export async function fetchCategoryFacets() {

  const response =
    await productService.getPublicProducts({
      page: 1,
      limit: 100,
    });


  const data =
    response?.data || {};

  const products =
    Array.isArray(data.products)
      ? data.products
      : [];


  const seen = new Map();

  products.forEach((product) => {

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
