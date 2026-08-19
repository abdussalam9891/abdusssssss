/*
 * There is no backend cart/order API yet (checked services/ and
 * config.js API_ENDPOINTS). This persists the cart to
 * localStorage so Add to Cart / Buy Now / the cart page are
 * genuinely functional today, structured so a real cart/order
 * endpoint can replace the storage calls below later without
 * touching any callers.
 *
 * Item shape:
 *   { id, name, slug, sku, image, price, finalPrice, size, quantity }
 */

const STORAGE_KEY = "banshiwale_cart_items";


function readCart() {

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


function writeCart(items) {

  try {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items)
    );

  } catch (error) {

    console.warn(
      "[Cart] Could not persist cart:",
      error
    );

  }


  window.dispatchEvent(
    new CustomEvent("cartChanged", {
      detail: { items },
    })
  );

}


export function getCartItems() {

  return readCart();
}


export function getCartCount() {

  return readCart().reduce(
    (sum, item) => sum + item.quantity,
    0
  );
}


export function getCartSubtotal() {

  return readCart().reduce(
    (sum, item) =>
      sum +
      (Number(item.finalPrice ?? item.price) || 0) *
        item.quantity,
    0
  );
}


export function addToCart({
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


  const items =
    readCart();

  const existingIndex =
    items.findIndex(
      (item) =>
        item.id === id &&
        (item.size || "") === (size || "")
    );


  if (existingIndex > -1) {

    items[existingIndex] = {
      ...items[existingIndex],
      quantity:
        items[existingIndex].quantity + quantity,
    };

  } else {

    items.push({
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


  writeCart(items);
}


export function updateCartItemQuantity(id, size, quantity) {

  const items =
    readCart()
      .map((item) =>
        item.id === id &&
        (item.size || "") === (size || "")
          ? { ...item, quantity }
          : item
      )
      .filter((item) => item.quantity > 0);


  writeCart(items);
}


export function removeCartItem(id, size) {

  const items =
    readCart().filter(
      (item) =>
        !(
          item.id === id &&
          (item.size || "") === (size || "")
        )
    );


  writeCart(items);
}


export function clearCart() {

  writeCart([]);
}
