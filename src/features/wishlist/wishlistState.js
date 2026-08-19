import { wishlistService } from "../../services/wishlistService.js";
import { isLoggedIn } from "../auth/authState.js";


/*
 * The wishlist is backend-backed and requires login (the API
 * 401s otherwise) — there is no local/guest fallback. An
 * in-memory cache of saved product ids is kept here so
 * isWishlisted()/getWishlistCount() can stay synchronous for
 * instant UI checks (button state, badge), refreshed by
 * loadWishlist() and by every add/remove.
 */

let ids = [];

// Avoids duplicate in-flight GET requests if multiple callers ask
// to load at once (e.g. the badge, the buttons, and the wishlist
// page all react to the same authChanged event).
let loadPromise = null;


function setIds(nextIds) {

  ids = nextIds;

  window.dispatchEvent(
    new CustomEvent("wishlistChanged", {
      detail: { ids },
    })
  );

}


export function loadWishlist() {

  if (!isLoggedIn()) {

    setIds([]);

    return Promise.resolve(ids);
  }


  if (loadPromise) return loadPromise;


  loadPromise =
    wishlistService.getWishlistProductIds()
      .then((productIds) => {

        setIds(productIds);

        return ids;
      })
      .catch((error) => {

        console.error(
          "[Wishlist] Failed to load wishlist:",
          error
        );

        setIds([]);

        return ids;
      })
      .finally(() => {

        loadPromise = null;

      });


  return loadPromise;
}


/*
 * Reloads whenever the authenticated user changes — login,
 * logout, or the initial guest/logged-in resolution on page load
 * (features/auth/authState.js's hydrateAuth() dispatches
 * authChanged exactly once for that too).
 */
export function initWishlistSync() {

  window.addEventListener(
    "authChanged",
    () => loadWishlist()
  );

}


export function getWishlistIds() {

  return ids;
}


export function getWishlistCount() {

  return ids.length;
}


export function isWishlisted(productId) {

  return ids.includes(productId);
}


export async function addToWishlist(productId) {

  if (!productId) return;


  try {

    await wishlistService.addToWishlist(
      productId
    );

  } catch (error) {

    // The cache can be stale (another tab, or a load still in
    // flight) — if the backend already has it saved, that's the
    // outcome we wanted anyway, not a real failure.
    if (error?.status !== 400) {
      throw error;
    }

  }


  if (!ids.includes(productId)) {

    setIds([
      productId,
      ...ids,
    ]);

  }

}


export async function removeFromWishlist(productId) {

  if (!productId) return;


  await wishlistService.removeFromWishlist(
    productId
  );


  setIds(
    ids.filter(
      (id) => id !== productId
    )
  );

}


/*
 * Returns the resulting saved state (true = now saved) so
 * callers can update their own UI without a second lookup.
 */
export async function toggleWishlist(productId) {

  if (!productId) return false;


  const nowSaved =
    !ids.includes(productId);


  if (nowSaved) {

    await addToWishlist(productId);

  } else {

    await removeFromWishlist(productId);

  }


  return nowSaved;
}
