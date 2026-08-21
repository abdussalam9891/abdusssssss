/*
 * There is no backend order API yet (see config.js's CART comment
 * — only the cart module itself is confirmed, and it doesn't cover
 * order placement). This persists placed orders to localStorage,
 * mirroring features/cart/cartState.js's own documented rationale,
 * so a real order endpoint can replace it later without touching
 * callers (features/checkout/orderPanel.js).
 */

const STORAGE_KEY = "banshiwale_orders";


function readOrders() {

  try {

    const stored =
      JSON.parse(
        localStorage.getItem(STORAGE_KEY)
      );

    return Array.isArray(stored) ? stored : [];

  } catch (error) {

    console.warn(
      "[Checkout] Stored orders could not be read:",
      error
    );

    return [];
  }

}


function writeOrders(orders) {

  try {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(orders)
    );

  } catch (error) {

    console.warn(
      "[Checkout] Could not persist order:",
      error
    );

  }

}


function generateOrderId() {

  return (
    "BW" +
    Date.now().toString(36).toUpperCase()
  );

}


export function placeOrder({ items, address, paymentMethod, totals }) {

  const order = {
    id: generateOrderId(),
    items,
    address,
    paymentMethod,
    totals,
    placedAt: new Date().toISOString(),
  };

  const orders = readOrders();

  orders.unshift(order);

  writeOrders(orders);

  return order;

}


export function getOrders() {

  return readOrders();
}
