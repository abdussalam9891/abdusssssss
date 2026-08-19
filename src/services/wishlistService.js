import {
  API_ENDPOINTS,
  STORE_DOMAIN,
} from "../config.js";

import { apiClient } from "./apiClient.js";


/*
 * All three routes require an authenticated user (the backend
 * returns 401 "No token provided" otherwise) — apiClient already
 * attaches the bearer token from localStorage when one exists.
 *
 * Contract (verified directly against the backend):
 *
 *   GET /wishlist/getwishlist?domain=:domain
 *     -> { success, wishlist: { items: [
 *          { productId: { _id, images, name, price, slug } | string,
 *            name, price, image, _id }
 *        ] } }
 *
 *   POST /wishlist/addtowishlist { productId, domain }
 *     -> 200 { success: true, message, wishlist }
 *     -> 400 { success: false, message: "Already in wishlist" }
 *
 *   DELETE /wishlist/removewishlist/:productId
 *     -> { success: true, message: "Item removed", wishlist }
 *
 * Only `name`/`price`/`image` are included per item — not enough
 * to render a full product card (no finalPrice, rating, stock,
 * etc.) — so callers fetch the full product via
 * productService.getPublicProductById() using the extracted id.
 */

function extractProductId(item) {

  if (typeof item?.productId === "string") {
    return item.productId;
  }

  return item?.productId?._id || null;
}


export const wishlistService = {

  getWishlistProductIds: async () => {

    const response =
      await apiClient.get(
        API_ENDPOINTS.WISHLIST.GET(STORE_DOMAIN)
      );

    const items =
      response?.wishlist?.items || [];

    return items
      .map(extractProductId)
      .filter(Boolean);
  },


  addToWishlist: async (productId) => {

    return apiClient.post(
      API_ENDPOINTS.WISHLIST.ADD,
      {
        productId,
        domain: STORE_DOMAIN,
      }
    );
  },


  removeFromWishlist: async (productId) => {

    return apiClient.delete(
      API_ENDPOINTS.WISHLIST.REMOVE(productId)
    );
  },

};
