import { isLoggedIn } from "../auth/authState.js";
import { openAuthModal } from "../auth/authTriggers.js";

import { ordersService } from "../../services/ordersService.js";
import { productService } from "../../services/productService.js";
import { normalizeOrder, getProductImage } from "./model.js";

import { createOrdersLayout } from "./ordersLayout.js";
import { createOrderCard } from "./orderCard.js";


/*
 * Orders require login (same as wishlist), so this page has four
 * states: signed out, loading, signed in with no orders, signed in
 * with an error fetching orders, and signed in with orders. Unlike
 * cart/wishlist, orders have no page-independent local cache to
 * preload from, so — unlike those pages — this one shows an explicit
 * loading state while the initial request is in flight.
 */

function showState(name) {

  const states = {
    login: document.getElementById("ordersLoginState"),
    loading: document.getElementById("ordersLoadingState"),
    empty: document.getElementById("ordersEmptyState"),
    error: document.getElementById("ordersErrorState"),
    list: document.getElementById("ordersList"),
  };

  if (Object.values(states).some((el) => !el)) {
    return null;
  }


  Object.entries(states).forEach(
    ([key, element]) => {

      element.classList.toggle(
        "hidden",
        key !== name
      );

    }
  );


  return states;

}


async function renderOrders() {

  if (!isLoggedIn()) {

    showState("login");

    window.lucide?.createIcons();

    return;
  }


  showState("loading");

  window.lucide?.createIcons();


  let orders;

  try {

    const raw =
      await ordersService.getMyOrders();

    orders =
      raw
        .map(normalizeOrder)
        .sort(
          (a, b) =>
            new Date(b.placedAt || 0) -
            new Date(a.placedAt || 0)
        );

  } catch (error) {

    console.error(
      "[Orders] Failed to load orders:",
      error
    );

    showState("error");

    window.lucide?.createIcons();

    return;
  }


  if (!orders.length) {

    showState("empty");

    window.lucide?.createIcons();

    return;
  }


  const states =
    showState("list");

  states.list.innerHTML =
    orders
      .map(
        (order) => createOrderCard(order)
      )
      .join("");


  window.lucide?.createIcons();


  hydrateMissingImages(orders).catch((error) => {

    console.error(
      "[Orders] Failed to hydrate missing product images:",
      error
    );

  });

}


/*
 * GET /orders/my-orders may not populate each item's product (or
 * may populate it without a usable image field) — the same gap the
 * wishlist page already works around by fetching each product
 * directly. This patches images in place, after the list is already
 * rendered, so a slow/failed image lookup never delays the order
 * list itself.
 */
async function hydrateMissingImages(orders) {

  const missingIds =
    [
      ...new Set(
        orders
          .flatMap((order) => order.items)
          .filter((item) => !item.image && item.productId)
          .map((item) => item.productId)
      ),
    ];

  if (!missingIds.length) return;


  const results =
    await Promise.allSettled(
      missingIds.map(
        (id) => productService.getPublicProductById(id)
      )
    );

  results.forEach((result, index) => {

    if (
      result.status !== "fulfilled" ||
      !result.value
    ) {
      return;
    }


    const image =
      getProductImage(result.value);

    if (!image) return;


    document
      .querySelectorAll(
        `img[data-order-item-image="${missingIds[index]}"]`
      )
      .forEach((img) => {
        img.src = image;
      });

  });

}


function initSignInButton() {

  document
    .getElementById("ordersSignInButton")
    ?.addEventListener(
      "click",
      () => openAuthModal("orders")
    );

}


export function initOrdersPage() {

  const container =
    document.getElementById("ordersPage");

  if (!container) return;


  container.innerHTML =
    createOrdersLayout();


  initSignInButton();

  renderOrders();


  // Covers signing in/out via the modal without a full page reload.
  window.addEventListener(
    "authChanged",
    renderOrders
  );

}
