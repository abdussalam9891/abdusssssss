import {
  API_BASE_URL,
  API_ENDPOINTS,
  STORE_DOMAIN,
} from "../config.js";

// Matches the apiClient default so an unreachable backend surfaces
// the error state promptly instead of hanging on the browser's own
// connection timeout.
const REQUEST_TIMEOUT = 8000;

export const customizeProductService = {
  async getProducts(category) {

    const controller = new AbortController();

    const timeoutId = setTimeout(
      () => controller.abort(),
      REQUEST_TIMEOUT
    );

    let response;

    try {

      response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.PRODUCTS.PUBLIC_BY_STORE(
          STORE_DOMAIN
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        }
      );

    } catch (error) {

      if (error?.name === "AbortError") {
        throw new Error(
          `Request timed out after ${REQUEST_TIMEOUT}ms`
        );
      }

      throw error;

    } finally {

      clearTimeout(timeoutId);

    }

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

    // ==========================================
    // GET PRODUCTS
    // ==========================================

    const allProducts =
      data?.data?.products ||
      data?.products ||
      data?.data ||
      [];

    if (!Array.isArray(allProducts)) {
      return [];
    }

    // ==========================================
    // NORMALIZE
    // ==========================================

    const normalize = (value = "") =>
      String(value)
        .toLowerCase()
        .replace(/-/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/s$/, "");

    // ==========================================
    // NO CATEGORY
    // ==========================================

    if (!category) {
      return allProducts;
    }

    const selectedCategory =
      normalize(category);

    // ==========================================
    // FILTER PRODUCTS
    // ==========================================

    const filteredProducts =
      allProducts.filter((product) => {

        const productCategories = [
          product.category,

          ...(Array.isArray(product.subCategory)
            ? product.subCategory
            : []),

          ...(Array.isArray(product.childCategory)
            ? product.childCategory
            : []),
        ]
          .filter(Boolean)
          .map(normalize);

        const productName =
          normalize(product.name);

        return (
          productCategories.includes(
            selectedCategory
          ) ||
          productName.includes(
            selectedCategory
          )
        );
      });

    console.log(
      "[Customize] Selected Category:",
      selectedCategory
    );

    console.log(
      "[Customize] Filtered Products:",
      filteredProducts
    );

    return filteredProducts;
  },
};
