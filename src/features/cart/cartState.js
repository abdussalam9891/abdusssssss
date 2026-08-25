import { cartService } from "../../services/cartService.js";
import { isLoggedIn } from "../auth/authState.js";


/*
 * Guests get a localStorage cart (unchanged from before). A logged-
 * in user's cart lives on the backend (see services/cartService.js)
 * and is mirrored into the same in-memory shape here, refreshed on
 * every login/logout via initCartSync() — mirrors
 * features/wishlist/wishlistState.js's pattern.
 *
 * Item shape (both sources normalize to this):
 *   { id, name, slug, sku, image, price, finalPrice, size, quantity, stock }
 *
 * Verified live: the backend matches/updates cart lines by product +
 * size, same as the guest/localStorage cart below — two sizes of the
 * same product stay separate lines either way (see cartService.js's
 * header comment for the full verified contract, including the
 * caveat about a productId that no longer resolves to a real
 * product).
 */

const STORAGE_KEY = "banshiwale_cart_items";

// Gift wrap has no backend field (see services/ordersService.js's
// header comment on the order-creation contract) — it's a
// client-only preference, persisted here so the choice made on the
// cart page survives navigating to the separate checkout page.
const GIFT_WRAP_KEY = "banshiwale_gift_wrap";

let items = [];

// Avoids duplicate in-flight GET requests if multiple callers ask
// to load at once.
let loadPromise = null;


function readLocalCart() {

  try {

    const stored =
      JSON.parse(
        localStorage.getItem(STORAGE_KEY)
      );

    return Array.isArray(stored)
      ? stored.filter(
          (item) => item?.id && item.quantity > 0
        )
      : [];

  } catch (error) {

    console.warn(
      "[Cart] Stored cart could not be read:",
      error
    );

    return [];
  }

}


function writeLocalCart(nextItems) {

  try {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(nextItems)
    );

  } catch (error) {

    console.warn(
      "[Cart] Could not persist cart:",
      error
    );

  }

}


function setItems(nextItems) {

  items = nextItems;

  window.dispatchEvent(
    new CustomEvent("cartChanged", {
      detail: { items },
    })
  );

}


export function loadCart() {

  if (!isLoggedIn()) {

    setItems(readLocalCart());

    return Promise.resolve(items);
  }


  if (loadPromise) return loadPromise;


  loadPromise =
    cartService.getCart()
      .then((cartItems) => {

        setItems(cartItems);

        return items;
      })
      .catch((error) => {

        console.error(
          "[Cart] Failed to load cart:",
          error
        );

        setItems([]);

        return items;
      })
      .finally(() => {

        loadPromise = null;

      });


  return loadPromise;
}


/*
 * Reloads whenever the authenticated user changes — login, logout,
 * or the initial guest/logged-in resolution on page load
 * (features/auth/authState.js's hydrateAuth() dispatches
 * authChanged exactly once for that too).
 */
export function initCartSync() {

  window.addEventListener(
    "authChanged",
    () => loadCart()
  );

}


export function getCartItems() {

  return items;
}


export function getGiftWrap() {

  try {

    return localStorage.getItem(GIFT_WRAP_KEY) === "true";

  } catch (error) {

    console.warn(
      "[Cart] Could not read gift wrap preference:",
      error
    );

    return false;
  }

}


export function setGiftWrap(value) {

  try {

    localStorage.setItem(
      GIFT_WRAP_KEY,
      value ? "true" : "false"
    );

  } catch (error) {

    console.warn(
      "[Cart] Could not persist gift wrap preference:",
      error
    );

  }

}


/*
 * A line's `stock` is only meaningful once the backend has reported
 * it (logged-in cart); a guest/local-cart item never carries a stock
 * figure at all, so treat that absence as "available" rather than
 * blocking checkout on data we don't have.
 */
export function getAvailableCartItems() {

  return items.filter((item) => {

    if (item.stock === undefined || item.stock === null) {
      return true;
    }

    return (
      Number(item.stock) > 0 &&
      item.quantity <= Number(item.stock)
    );
  });
}


export function getCartCount() {

  return items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
}


export function getCartSubtotal() {

  return items.reduce(
    (sum, item) =>
      sum +
      (Number(item.finalPrice ?? item.price) || 0) *
        item.quantity,
    0
  );
}


export async function addToCart({
  id,
  name,
  slug,
  sku,
  image,
  price,
  finalPrice,
  size = "",
  quantity = 1,
}) {

  if (!id || quantity < 1) return;


  if (isLoggedIn()) {

    await cartService.addToCart({
      productId: id,
      quantity,
      size,
    });

    await loadCart();

    return;
  }


  const local =
    readLocalCart();

  const existingIndex =
    local.findIndex(
      (item) =>
        item.id === id &&
        (item.size || "") === (size || "")
    );


  if (existingIndex > -1) {

    local[existingIndex] = {
      ...local[existingIndex],
      quantity:
        local[existingIndex].quantity + quantity,
    };

  } else {

    local.push({
      id,
      name: name || "",
      slug: slug || "",
      sku: sku || "",
      image: image || "",
      price: price ?? null,
      finalPrice: finalPrice ?? price ?? null,
      size: size || "",
      quantity,
    });

  }


  writeLocalCart(local);

  setItems(local);
}


export async function updateCartItemQuantity(id, size, quantity) {

  if (isLoggedIn()) {

    if (quantity < 1) {

      await removeCartItem(id, size);

      return;
    }


    await cartService.addToCart({
      productId: id,
      quantity,
      size,
      setQuantity: true,
    });

    await loadCart();

    return;
  }


  const local =
    readLocalCart()
      .map((item) =>
        item.id === id &&
        (item.size || "") === (size || "")
          ? { ...item, quantity }
          : item
      )
      .filter((item) => item.quantity > 0);


  writeLocalCart(local);

  setItems(local);
}


export async function removeCartItem(id, size) {

  if (isLoggedIn()) {

    await cartService.removeFromCart(id);

    await loadCart();

    return;
  }


  const local =
    readLocalCart().filter(
      (item) =>
        !(
          item.id === id &&
          (item.size || "") === (size || "")
        )
    );


  writeLocalCart(local);

  setItems(local);
}


export async function clearCart() {

  setGiftWrap(false);


  if (isLoggedIn()) {

    await Promise.all(
      items.map((item) =>
        cartService
          .removeFromCart(item.id)
          .catch((error) => {

            console.error(
              "[Cart] Failed to clear item:",
              error
            );

          })
      )
    );

    await loadCart();

    return;
  }


  writeLocalCart([]);

  setItems([]);
}
