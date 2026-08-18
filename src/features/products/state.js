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
};
