import {
  API_ENDPOINTS,
  STORE_DOMAIN,
} from "../config.js";

import { apiClient } from "./apiClient.js";


const SUBCATEGORY_MAP = {

  rings: "Ring",

  chains: "Chain",

  bracelets: "Bracelet",

  pendants: "Pendant",

  earrings: "Earring",

};


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

    const subCategories =
      categories
        .map(
          (category) =>
            SUBCATEGORY_MAP[
              String(category).toLowerCase()
            ] ||
            category
        )
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


    return apiClient.get(
      endpoint
    );
  },

};
