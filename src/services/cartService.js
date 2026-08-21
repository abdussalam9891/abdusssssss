import { API_ENDPOINTS, STORE_DOMAIN } from "../config.js";
import { apiClient } from "./apiClient.js";


/*
 * The backend has a real cart module (confirmed via direct probe —
 * see config.js's CART comment), but only ADD is wired up here.
 * The site's actual cart data (read/update/remove, the cart page,
 * the cart badge, checkout) still runs on
 * features/cart/cartState.js's localStorage model — this call is a
 * best-effort mirror to the backend, not the source of truth, so a
 * failure here must never affect the local cart or the UI. Callers
 * should treat this as fire-and-forget for a logged-in user.
 */

export const cartService = {

  addToCart: async ({ productId, quantity, size }) => {

    return apiClient.post(
      API_ENDPOINTS.CART.ADD,
      {
        productId,
        quantity,
        selectedSize: size || "",
        domain: STORE_DOMAIN,
      }
    );
  },

};
