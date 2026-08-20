export const productsState = {
  products: [],

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
  },

  // Distinct `subCategory` values sampled from real product data
  // (see fetchCategoryFacets), used to render the category filter
  // checkboxes. Never hardcoded, never guaranteed complete.
  categoryOptions: [],
};
