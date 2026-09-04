import { cartService } from "../../services/cartService.js";
import { productService } from "../../services/productService.js";
import { isImageReachable } from "../../utils/pruneBrokenImages.js";
import { isLoggedIn } from "../auth/authState.js";


/*
 * The cart is account-bound: it lives on the backend (see
 * services/cartService.js) and is mirrored into this in-memory
 * cache, refreshed on every login/logout via initCartSync() —
 * mirrors features/wishlist/wishlistState.js's pattern.
 *
 * There is no guest cart. Every Add to Cart trigger sitewide goes
 * through requireAuth() first (features/auth/authGuard.js), so a
 * signed-out visitor gets the sign-in modal instead; the mutations
 * below refuse to run for one as a backstop.
 *
 * Item shape (as normalized by cartService.js):
 *   { id, name, slug, sku, image, price, finalPrice, size, quantity, stock }
 *
 * Verified live: the backend matches/updates cart lines by product +
 * size, so two sizes of the same product stay separate lines (see
 * cartService.js's header comment for the full verified contract,
 * including the caveat about a productId that no longer resolves to
 * a real product).
 *
 * `size` is not only the size: it is the whole per-line option key,
 * with the chosen variant packed in beside the size label, because
 * the backend has no variant field of its own (see utils/cartLine.js).
 * Build it with buildCartSize() before calling addToCart, and read it
 * back with parseCartSize()/formatCartSize() when displaying a line.
 *
 * price/finalPrice come back from the backend looked up by productId
 * ALONE — it has no idea which variant a line is for, so every line
 * for a given product comes back with the same backend-reported
 * price regardless of variant. addToCart() overrides this with the
 * price actually shown to the shopper (see CART_PRICE_KEY below).
 */

// Gift wrap has no backend field (see services/ordersService.js's
// header comment on the order-creation contract) — it's a
// client-only preference, persisted here so the choice made on the
// cart page survives navigating to the separate checkout page.
const GIFT_WRAP_KEY = "banshiwale_gift_wrap";

// Where the old guest cart used to be kept. Cleared on load so a
// visitor who built one before the cart became account-bound isn't
// left with orphaned data in their browser.
const LEGACY_GUEST_CART_KEY = "banshiwale_cart_items";

/*
 * productId -> the photo the shopper was actually looking at when
 * they added the line. The backend keeps one thumbnail url per line
 * and does not always have one to give (a product published with a
 * single image whose record predates that capture comes back with
 * `image: ""`), which left the cart row, the checkout summary and
 * the order panel showing a grey placeholder for a piece whose photo
 * the site had just rendered a moment earlier.
 *
 * Persisted rather than kept in memory because Add to Cart happens
 * on the product page and the thumbnail is needed after a full
 * navigation to /pages/cart.html.
 */
const CART_IMAGE_KEY = "banshiwale_cart_thumbs";

/*
 * `id::size` -> the price/finalPrice the shopper actually saw for
 * that variant when they added it to the cart.
 *
 * The backend has no variant field (see the contract notes above):
 * GET /getcart returns price/finalPrice looked up by productId
 * alone, so two variants of the same product in the same size come
 * back from the backend with the SAME price — the base product's,
 * not the selected variant's — even though the line itself (keyed
 * by productId + selectedSize, which packs the variant in) is kept
 * separate. Remembering the real price here and overriding the
 * backend's figure in setItems() is the only way a cart line shows
 * the price the shopper actually chose. Keyed by size (not just
 * productId) so distinct variants of one product don't clobber each
 * other's remembered price the way a single remembered image would.
 */
const CART_PRICE_KEY = "banshiwale_cart_prices";

let items = [];

// Avoids duplicate in-flight GET requests if multiple callers ask
// to load at once.
let loadPromise = null;


try {

  localStorage.removeItem(LEGACY_GUEST_CART_KEY);

} catch (error) {

  console.warn(
    "[Cart] Could not clear the legacy guest cart:",
    error
  );

}


function readRememberedImages() {

  try {

    const stored =
      JSON.parse(
        localStorage.getItem(CART_IMAGE_KEY) || "{}"
      );

    return stored && typeof stored === "object"
      ? stored
      : {};

  } catch (error) {

    console.warn(
      "[Cart] Could not read the remembered thumbnails:",
      error
    );

    return {};
  }

}


function writeRememberedImages(map) {

  try {

    localStorage.setItem(
      CART_IMAGE_KEY,
      JSON.stringify(map)
    );

  } catch (error) {

    console.warn(
      "[Cart] Could not persist the remembered thumbnails:",
      error
    );

  }

}


/*
 * Records the photo the shopper was looking at when they added a
 * line — every Add to Cart trigger already passes one (see
 * features/productDetails/cart.js and features/quickAdd/index.js).
 */
function rememberCartImage(productId, image) {

  if (!productId || !image) return;


  const map =
    readRememberedImages();

  if (map[productId] === image) return;


  map[productId] = image;

  writeRememberedImages(map);
}


function priceKey(productId, size) {

  return `${productId}::${size || ""}`;
}


function readRememberedPrices() {

  try {

    const stored =
      JSON.parse(
        localStorage.getItem(CART_PRICE_KEY) || "{}"
      );

    return stored && typeof stored === "object"
      ? stored
      : {};

  } catch (error) {

    console.warn(
      "[Cart] Could not read the remembered prices:",
      error
    );

    return {};
  }

}


function writeRememberedPrices(map) {

  try {

    localStorage.setItem(
      CART_PRICE_KEY,
      JSON.stringify(map)
    );

  } catch (error) {

    console.warn(
      "[Cart] Could not persist the remembered prices:",
      error
    );

  }

}


/*
 * Records the price/finalPrice the shopper actually saw for this
 * variant — every Add to Cart trigger already passes them (see
 * features/productDetails/cart.js and features/quickAdd/index.js).
 */
function rememberCartPrice(productId, size, price, finalPrice) {

  if (!productId) return;
  if (price == null && finalPrice == null) return;


  const map =
    readRememberedPrices();

  const key =
    priceKey(productId, size);

  map[key] = { price, finalPrice };

  writeRememberedPrices(map);
}


/*
 * Overrides the backend's price/finalPrice — looked up by productId
 * alone, so it's the same for every variant of a product — with the
 * figure actually shown to the shopper for this specific line, and
 * forgets lines no longer in the cart so the store doesn't grow
 * without bound.
 */
function applyRememberedPrices(nextItems) {

  const map =
    readRememberedPrices();


  const resolved =
    nextItems.map((item) => {

      const remembered =
        map[priceKey(item.id, item.size)];

      if (!remembered) return item;


      return {
        ...item,
        price: remembered.price ?? item.price,
        finalPrice: remembered.finalPrice ?? item.finalPrice,
      };

    });


  if (!nextItems.length) return resolved;


  const stillCarted =
    Object.fromEntries(
      Object.entries(map).filter(
        ([key]) =>
          nextItems.some(
            (item) => priceKey(item.id, item.size) === key
          )
      )
    );

  if (
    Object.keys(stillCarted).length !==
    Object.keys(map).length
  ) {
    writeRememberedPrices(stillCarted);
  }


  return resolved;
}


/*
 * Fills in any line the backend returned without a thumbnail, and
 * forgets the products that are no longer in the cart so the store
 * doesn't grow without bound.
 */
function applyRememberedImages(nextItems) {

  const map =
    readRememberedImages();


  const resolved =
    nextItems.map((item) =>
      item.image || !map[item.id]
        ? item
        : { ...item, image: map[item.id] }
    );


  /*
   * An empty list is as often "signed out" or "the load failed" as
   * it is "the cart is empty", and dropping every remembered
   * thumbnail on those would defeat the point, so pruning only
   * happens against a cart that actually has lines.
   */
  if (!nextItems.length) return resolved;


  const stillCarted =
    Object.fromEntries(
      Object.entries(map).filter(
        ([productId]) =>
          nextItems.some(
            (item) => item.id === productId
          )
      )
    );

  if (
    Object.keys(stillCarted).length !==
    Object.keys(map).length
  ) {
    writeRememberedImages(stillCarted);
  }


  return resolved;
}


function setItems(nextItems) {

  items =
    applyRememberedPrices(
      applyRememberedImages(nextItems)
    );

  window.dispatchEvent(
    new CustomEvent("cartChanged", {
      detail: { items },
    })
  );

}


/*
 * Backstop for the mutations below: every caller is already behind
 * requireAuth(), so reaching one of these signed out is a bug, not
 * something a customer should ever see.
 */
function warnSignedOut(action) {

  console.warn(
    `[Cart] Ignored ${action} — the cart requires a signed-in customer.`
  );

}


export function loadCart() {

  if (!isLoggedIn()) {

    setItems([]);

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


/*
 * The catalog's own photos for a cart line, best first. The cart
 * line itself carries only the single thumbnail the backend
 * captured when the line was added, so a replacement has to come
 * from the product.
 */
async function findWorkingImage(item) {

  let product;

  try {

    product =
      await productService.getPublicProductById(
        item.id
      );

  } catch (error) {

    console.warn(
      "[Cart] Could not re-resolve the image for",
      item.name || item.id,
      error
    );

    return null;
  }


  const urls =
    Array.isArray(product?.images)
      ? [...product.images]
          .sort(
            (a, b) =>
              (a?.position ?? 0) -
              (b?.position ?? 0)
          )
          .map((image) => image?.url)
          .filter(Boolean)
      : [];


  for (const url of urls) {

    // The line's own url is what just failed.
    if (url === item.image) continue;

    if (await isImageReachable(url)) return url;

  }


  return null;
}


/*
 * The backend stores one thumbnail url per cart line, captured when
 * the line was added. If that image's file is missing from storage
 * the row shows a grey placeholder even though the product still
 * has working photos, so the line is re-resolved from the catalog
 * instead.
 *
 * Deliberately not part of loadCart(): every page runs that to fill
 * the header badge, and probing there would pull down the whole
 * cart's imagery just to render a count. Pages that actually show
 * thumbnails call this after their first paint. A line whose image
 * loads costs one cache hit and no request.
 *
 * That first paint happens before the cart itself has come back
 * from the backend, though, so the opening call almost always sees
 * an empty list. Re-running on every later cartChanged is what
 * makes it land: the listener is attached once, and a pass over
 * lines whose images already resolve is answered entirely from the
 * probe cache.
 */
let repairListenerAttached = false;

let repairing = false;

// A cartChanged that arrived mid-pass — the lines it carries have
// not been looked at yet, so a fresh pass follows the current one.
let repairRequested = false;


export async function repairCartImages() {

  if (!repairListenerAttached) {

    repairListenerAttached = true;

    window.addEventListener(
      "cartChanged",
      () => {
        repairCartImages();
      }
    );

  }


  /*
   * runImageRepair()'s own setItems() dispatches cartChanged and so
   * re-enters here. Queueing rather than dropping keeps a real load
   * that lands mid-pass from being swallowed too; the follow-up
   * pass costs only probe-cache hits when nothing has changed.
   */
  if (repairing) {

    repairRequested = true;

    return items;
  }


  repairing = true;


  try {

    do {

      repairRequested = false;

      await runImageRepair();

    } while (repairRequested);

  } finally {

    repairing = false;

  }


  return items;
}


async function runImageRepair() {

  const replacements =
    await Promise.all(
      items.map(async (item) => {

        if (
          item.image &&
          await isImageReachable(item.image)
        ) {
          return null;
        }

        return findWorkingImage(item);
      })
    );


  if (!replacements.some(Boolean)) return items;


  // A url that had to be re-resolved once will need re-resolving on
  // every page that shows this line, so the working one replaces
  // whatever was remembered for the product.
  items.forEach((item, index) => {

    if (replacements[index]) {

      rememberCartImage(
        item.id,
        replacements[index]
      );

    }

  });


  setItems(
    items.map(
      (item, index) =>
        replacements[index]
          ? { ...item, image: replacements[index] }
          : item
    )
  );


  return items;
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
 * it; treat an absent figure as "available" rather than blocking
 * checkout on data we don't have.
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
  size = "",
  quantity = 1,
  image = "",
  price = null,
  finalPrice = null,
}) {

  if (!id || quantity < 1) return;


  if (!isLoggedIn()) {

    warnSignedOut("add to cart");

    throw new Error(
      "Please sign in to add items to your cart."
    );
  }


  // The backend takes no image with the line (see
  // services/cartService.js's verified contract), so the photo the
  // shopper just chose is kept here and used for the row whenever
  // the cart comes back without one of its own.
  rememberCartImage(id, image);

  // Same story for price: the backend looks it up by productId
  // alone, so it can't tell one variant's price from another's (see
  // CART_PRICE_KEY above) — the actual figure the shopper saw has to
  // be kept here too.
  rememberCartPrice(id, size, price, finalPrice);


  await cartService.addToCart({
    productId: id,
    quantity,
    size,
  });

  await loadCart();
}


export async function updateCartItemQuantity(id, size, quantity) {

  if (!isLoggedIn()) {

    warnSignedOut("quantity update");

    return;
  }


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
}


export async function removeCartItem(id, size) {

  if (!isLoggedIn()) {

    warnSignedOut("item removal");

    return;
  }


  await cartService.removeFromCart(id, size);

  await loadCart();
}


export async function clearCart() {

  setGiftWrap(false);


  if (!isLoggedIn()) {

    warnSignedOut("cart clear");

    setItems([]);

    return;
  }


  await Promise.all(
    items.map((item) =>
      cartService
        .removeFromCart(item.id, item.size)
        .catch((error) => {

          console.error(
            "[Cart] Failed to clear item:",
            error
          );

        })
    )
  );

  await loadCart();
}
