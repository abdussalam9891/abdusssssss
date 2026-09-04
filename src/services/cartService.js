import { API_ENDPOINTS, STORE_DOMAIN } from "../config.js";
import { apiClient } from "./apiClient.js";


/*
 * Verified live against the real backend (2026-08-24, logged-in
 * account) — not just inferred from Mivo Jewels' frontend anymore,


 *
 *   GET /addtocart/getcart?domain=:domain
 *     -> { success, cart: { items: [
 *          { productId: { _id } | string, name, price, finalPrice,
 *            discountValue, quantity, image, stock, selectedSize } ] } }
 *
 *   POST /addtocart/addToCart
 *     body: { productId, quantity, selectedSize, domain }
 *       -> increments the line's quantity (or creates it).
 *     body: { ..., setQuantity: true }
 *       -> replaces the line's quantity instead of incrementing it.
 *
 *     CONFIRMED: the backend matches/updates by productId +
 *     selectedSize, not productId alone — two lines for the same
 *     product in different sizes update independently (this
 *     contradicts an earlier assumption mirrored from Mivo's
 *     frontend, which never exercises that case).
 *
 *     selectedSize is the ONLY per-line option the backend
 *     stores: there is no variant field on the way in or on the
 *     way back out. The variant is therefore packed into this
 *     same string by utils/cartLine.js, so two variants of one
 *     product in the same size stay separate lines.
 *
 *     CAVEAT: if productId doesn't resolve to a real, current
 *     product (e.g. it was deleted from the catalog after being
 *     carted), this silently no-ops — 200 { success: true }, cart
 *     unchanged — instead of erroring. A stale cart line can't be
 *     fixed by re-adding it; only removeFromCart clears it.
 *
 *   DELETE /addtocart/removecart/:productId  body: { domain }
 *     Removes the cart line for that product. Only verified against
 *     a product with a single line (no other size in the cart) —
 *     whether this removes just one size-variant line or every line
 *     for that productId when more than one exists is unconfirmed.
 *     selectedSize is sent along on the chance the backend narrows
 *     by it the way addToCart does; UNVERIFIED, and harmless if the
 *     backend ignores it (that is the behaviour we already have).
 */

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
