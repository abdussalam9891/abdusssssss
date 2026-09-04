import { API_ENDPOINTS, STORE_DOMAIN } from "../config.js";
import { apiClient } from "./apiClient.js";




function extractProductId(rawId) {

  if (typeof rawId === "string") return rawId;

  return (
    rawId?._id?.toString() ||
    rawId?.toString?.() ||
    ""
  );
}


function extractItems(response) {

  const raw =
    response?.cart?.items;

  if (!Array.isArray(raw)) return [];


  return raw
    .map((i) => ({
      id: extractProductId(i.productId),
      name: i.name || "",
      slug: "",
      sku: "",
      image: i.image || "",
      price: i.price ?? i.finalPrice ?? null,
      finalPrice: i.finalPrice ?? i.price ?? null,
      size: i.selectedSize || "",
      quantity: i.quantity || 0,
      stock: i.stock ?? null,
    }))
    .filter((item) => item.id);
}


export const cartService = {

  getCart: async () => {

    const response =
      await apiClient.get(
        API_ENDPOINTS.CART.GET(STORE_DOMAIN)
      );

    return extractItems(response);
  },


  addToCart: async ({ productId, quantity, size, setQuantity = false }) => {

    return apiClient.post(
      API_ENDPOINTS.CART.ADD,
      {
        productId,
        quantity,
        selectedSize: size || "",
        domain: STORE_DOMAIN,
        ...(setQuantity ? { setQuantity: true } : {}),
      }
    );
  },


  removeFromCart: async (productId, size = "") => {

    return apiClient.delete(
      API_ENDPOINTS.CART.REMOVE(productId),
      {
        body: {
          domain: STORE_DOMAIN,
          selectedSize: size || "",
        },
      }
    );
  },

};
