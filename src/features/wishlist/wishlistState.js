/*
 * There is no backend wishlist endpoint yet (checked services/
 * and config.js API_ENDPOINTS) — this persists saved product ids
 * to localStorage so the wishlist toggle (product-details page)
 * and the wishlist page are both genuinely functional today.
 * Structured so a real wishlist endpoint can replace the storage
 * calls below later without touching any callers, the same way
 * features/cart/cartState.js is set up for the cart.
 *
 * Only ids are stored — product details are always re-fetched
 * from the backend when needed, so nothing stale or invented is
 * ever rendered.
 */

const STORAGE_KEY = "banshiwale_wishlist_ids";


function readIds() {

  try {

    const stored =
      JSON.parse(
        localStorage.getItem(STORAGE_KEY)
      );

    return Array.isArray(stored)
      ? stored.filter(
          (id) => typeof id === "string" && id
        )
      : [];

  } catch (error) {

    console.warn(
      "[Wishlist] Stored ids could not be read:",
      error
    );

    return [];
  }

}


function writeIds(ids) {

  try {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(ids)
    );

  } catch (error) {

    console.warn(
      "[Wishlist] Could not persist wishlist:",
      error
    );

  }


  window.dispatchEvent(
    new CustomEvent("wishlistChanged", {
      detail: { ids },
    })
  );

}


export function getWishlistIds() {

  return readIds();
}


export function getWishlistCount() {

  return readIds().length;
}


export function isWishlisted(productId) {

  return readIds().includes(productId);
}


export function addToWishlist(productId) {

  if (!productId) return;

  const ids = readIds();

  if (ids.includes(productId)) return;


  writeIds([
    productId,
    ...ids,
  ]);

}


export function removeFromWishlist(productId) {

  writeIds(
    readIds().filter(
      (id) => id !== productId
    )
  );

}


/*
 * Returns the resulting saved state (true = now saved) so
 * callers can update their own UI without a second lookup.
 */
export function toggleWishlist(productId) {

  if (!productId) return false;


  const ids =
    readIds();

  const isSaved =
    ids.includes(productId);


  writeIds(
    isSaved
      ? ids.filter((id) => id !== productId)
      : [productId, ...ids]
  );


  return !isSaved;
}
