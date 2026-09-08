import { ordersService } from "../../services/ordersService.js";
import { productService } from "../../services/productService.js";
import { normalizeOrder, getProductImage } from "../orders/model.js";

import { createProfileOrdersPanel } from "../../components/profile/ordersPanel.js";
import { createOrderCard } from "../../features/orders/orderCard.js";


/*
 * Mirrors features/orders/ordersPageInit.js's renderOrders/
 * hydrateMissingImages, retargeted at the profile page's "orders"
 * tab panel (no login state here — the profile shell already gates
 * this whole page behind isLoggedIn()).
 */

function showState(name) {

  const states = {
    loading: document.getElementById("profileOrdersLoadingState"),
    empty: document.getElementById("profileOrdersEmptyState"),
    error: document.getElementById("profileOrdersErrorState"),
    list: document.getElementById("profileOrdersList"),
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


async function loadProfileOrders() {

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
      "[Profile] Failed to load orders:",
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
      "[Profile] Failed to hydrate missing product images:",
      error
    );

  });

}


/*
 * Rebuilds the panel shell from scratch every call, matching
 * features/profile/profileInfo.js / addresses.js — safe since the
 * tab switch only toggles the panel's visibility, never tears it
 * down mid-load.
 */
export function initProfileOrders() {

  const panel =
    document.getElementById("profileOrdersPanel");

  if (!panel) return;


  panel.innerHTML =
    createProfileOrdersPanel();


  window.lucide?.createIcons();


  loadProfileOrders();

}
