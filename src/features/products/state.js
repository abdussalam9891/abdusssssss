export const productsState = {
  // Current page slice, ready to render (see pipeline.js).
  products: [],

  /*
   * Every product matching the SERVER-side part of the query
   * (subCategory + search), across all backend pages. The backend
   * cannot sort or filter by price/collection, so those three are
   * applied on top of this list in the browser — which only works
   * if the whole matching set is in memory, not a single page of
   * it. Populated by fetchProducts() in api.js.
   */
  fetchedProducts: [],

  page: 1,
  limit: 12,

  total: 0,
  totalPages: 0,

  sort: "featured",

  search: "",

  filters: {
    categories: [],
    badges: [],
    price: null,
    occasions: [],
    recipients: [],
  },

  // Distinct `subCategory` values sampled from real product data
  // (see fetchCategoryFacets), used to render the category filter
  // checkboxes. Never hardcoded, never guaranteed complete.
  categoryOptions: [],
};
