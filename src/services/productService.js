import {
  API_ENDPOINTS,
  STORE_DOMAIN,
} from "../config.js";

import { apiClient } from "./apiClient.js";


// Showcase and Best Sellers both call getPublicProducts() with the
// same default params on every homepage load, firing two identical
// requests at once. Dedupe by endpoint so concurrent identical
// requests share one in-flight promise instead of double-hitting
// the backend; the entry clears once it settles, so this is not a
// long-lived cache and differently-filtered calls (search, category
// pages, pagination) are never affected.
const inFlightProductRequests = new Map();

/*
 * Heads-up for any listing/filter UI: of the options accepted
 * below, the public store endpoint only really applies
 * `subCategory` and `search` (plus `page`/`limit`). `sort`,
 * `minPrice`/`maxPrice` and `badge` are taken and silently
 * ignored — every `sort` value comes back in the same order, a
 * narrowed price range returns the whole catalog, and products
 * carry no `badge` field at all. They are still sent, for the
 * day the backend implements them.
 *
 * features/products applies those three in the browser instead;
 * see features/products/pipeline.js.
 */
export const productService = {

  getPublicProducts: async ({

    page = 1,

    limit = 12,

    categories = [],

    badges = [],

    minPrice,

    maxPrice,

    sort = "featured",

    search = "",

  } = {}) => {


    const params =
      new URLSearchParams();


    // ==========================================
    // PAGINATION
    // ==========================================

    params.set(
      "page",
      page
    );

    params.set(
      "limit",
      limit
    );


    // ==========================================
    // SUB CATEGORY
    // ==========================================

    /*
     * `categories` values come straight from the backend's own
     * product data (see fetchCategoryFacets in features/products),
     * so they round-trip back to `subCategory` unmodified instead
     * of going through a hardcoded name translation.
     */

    const subCategories =
      categories
        .filter(Boolean);


    if (
      subCategories.length
    ) {

      params.set(
        "subCategory",
        subCategories.join(",")
      );

    }


    // ==========================================
    // BADGES
    // ==========================================

    if (badges.length) {

      params.set(
        "badge",
        badges.join(",")
      );

    }


    // ==========================================
    // PRICE
    // ==========================================

    if (
      minPrice !== undefined &&
      minPrice !== null
    ) {

      params.set(
        "minPrice",
        minPrice
      );

    }


    if (
      maxPrice !== undefined &&
      maxPrice !== null &&
      maxPrice !== Infinity
    ) {

      params.set(
        "maxPrice",
        maxPrice
      );

    }


    // ==========================================
    // SORT
    // ==========================================

    if (
      sort &&
      sort !== "featured"
    ) {

      params.set(
        "sort",
        sort
      );

    }


    // ==========================================
    // SEARCH
    // ==========================================

    if (search) {

      params.set(
        "search",
        search
      );

    }


    const endpoint =
      `${API_ENDPOINTS.PRODUCTS.PUBLIC_BY_STORE(
        STORE_DOMAIN
      )}?${params.toString()}`;


    if (
      inFlightProductRequests.has(endpoint)
    ) {
      return inFlightProductRequests.get(
        endpoint
      );
    }


    const request =
      apiClient
        .get(endpoint)
        .finally(() => {
          inFlightProductRequests.delete(
            endpoint
          );
        });


    inFlightProductRequests.set(
      endpoint,
      request
    );


    return request;
  },


  // ==========================================
  // SINGLE PRODUCT
  // ==========================================

  /*
   * The public store endpoint doubles as a single-product
   * endpoint: passing `id` (a backend product _id) makes it
   * respond with the product object directly instead of a
   * paginated list.
   *
   *   GET /product/public/store/:domain?id=<_id>
   *
   *   200 -> { success, message: "Product fetched successfully",
   *            data: { ...product } }
   *   404 -> { success: false, message: "Product not found" }
   *   400 -> { success: false, message: "Invalid ID" }
   *
   * There is no separate /product/:id route on the backend,
   * so this is the supported way to resolve one product.
   */

  getPublicProductById: async (id) => {

    if (!id) {

      throw new Error(
        "Product id is required."
      );

    }


    const params =
      new URLSearchParams();


    params.set(
      "id",
      id
    );


    const endpoint =
      `${API_ENDPOINTS.PRODUCTS.PUBLIC_BY_STORE(
        STORE_DOMAIN
      )}?${params.toString()}`;


    const response =
      await apiClient.get(
        endpoint
      );


    // Single-product responses put the product on `data`
    // itself, unlike the list response which nests it under
    // `data.products`.
    const product =
      response?.data?.products?.[0] ||
      response?.data ||
      null;


    if (
      !product ||
      !product._id
    ) {
      return null;
    }


    return product;
  },


  /*
   * Same store endpoint as getPublicProductById above, but resolves
   * by `slug` instead of the backend `_id` — confirmed working
   * against banshiwale's live backend:
   *
   *   GET /product/public/store/:domain?slug=<slug>
   *
   * Response shape is identical to the id-based lookup.
   */

  getPublicProductBySlug: async (slug) => {

    if (!slug) {

      throw new Error(
        "Product slug is required."
      );

    }


    const params =
      new URLSearchParams();


    params.set(
      "slug",
      slug
    );


    const endpoint =
      `${API_ENDPOINTS.PRODUCTS.PUBLIC_BY_STORE(
        STORE_DOMAIN
      )}?${params.toString()}`;


    const response =
      await apiClient.get(
        endpoint
      );


    const product =
      response?.data?.products?.[0] ||
      response?.data ||
      null;


    if (
      !product ||
      !product._id
    ) {
      return null;
    }


    return product;
  },


  // ==========================================
  // SIMILAR PRODUCTS
  // ==========================================

  /*
   * GET /product/similar/slug/:slug
   *
   *   200 -> { success, message, data: [ ...product ] }
   *
   * Unlike the store listing endpoint, the array is on `data`
   * directly (no `.products` nesting).
   */

  getSimilarProductsBySlug: async (slug) => {

    if (!slug) return [];


    const endpoint =
      API_ENDPOINTS.PRODUCTS.SIMILAR_BY_SLUG(
        slug
      );


    const response =
      await apiClient.get(
        endpoint
      );


    return Array.isArray(response?.data)
      ? response.data
      : [];
  },

};
