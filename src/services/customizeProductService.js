import {
  API_BASE_URL,
  API_ENDPOINTS,
  STORE_DOMAIN,
} from "../config.js";

export const customizeProductService = {

  async getProducts(category) {

    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.PRODUCTS.PUBLIC_BY_STORE(
        STORE_DOMAIN
      )}`,
      {
        method: "GET",
      }
    );

    let data = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw new Error(
        data?.message ||
        data?.error ||
        "Failed to load products."
      );
    }

    let products = [];

    if (Array.isArray(data)) {
      products = data;

    } else if (Array.isArray(data?.products)) {
      products = data.products;

    } else if (Array.isArray(data?.data)) {
      products = data.data;

    } else if (Array.isArray(data?.data?.products)) {
      products = data.data.products;
    }


    // ==========================================
    // FILTER BY JEWELLERY CATEGORY
    // ==========================================

    if (category) {

      const normalizedCategory =
        category.trim().toLowerCase();

      products = products.filter(
        (product) =>
          product.category?.trim().toLowerCase() ===
          normalizedCategory
      );

    }

    return products;
  },

};
