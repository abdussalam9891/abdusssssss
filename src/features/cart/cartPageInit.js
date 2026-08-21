import {
  getCartItems,
  getCartSubtotal,
  updateCartItemQuantity,
  removeCartItem,
} from "./cartState.js";

import { createCartLayout } from "../../components/cart/cartLayout.js";
import { createCartItemRow } from "../../components/cart/cartItemRow.js";
import { createCartSummary } from "../../components/cart/cartSummary.js";


function renderCart() {

  const emptyState =
    document.getElementById("cartEmptyState");

  const content =
    document.getElementById("cartContent");

  const itemsContainer =
    document.getElementById("cartItems");

  const summaryContainer =
    document.getElementById("cartSummary");

  if (
    !emptyState ||
    !content ||
    !itemsContainer ||
    !summaryContainer
  ) {
    return;
  }


  const items =
    getCartItems();


  if (!items.length) {

    emptyState.classList.remove("hidden");

    content.classList.add("hidden");

    window.lucide?.createIcons();

    return;
  }


  emptyState.classList.add("hidden");

  content.classList.remove("hidden");


  itemsContainer.innerHTML =
    items
      .map(
        (item) => createCartItemRow(item)
      )
      .join("");


  const subtotal =
    getCartSubtotal();

  summaryContainer.innerHTML =
    createCartSummary(subtotal);


  window.lucide?.createIcons();

}


function initItemControls() {

  const itemsContainer =
    document.getElementById("cartItems");

  if (!itemsContainer) return;


  itemsContainer.addEventListener(
    "click",
    (event) => {

      const row =
        event.target.closest("[data-cart-item]");

      if (!row) return;


      const id =
        row.dataset.id;

      const size =
        row.dataset.size;


      if (
        event.target.closest(".cart-item-remove")
      ) {

        // writeCart() (inside removeCartItem) dispatches
        // cartChanged, which re-renders below.
        removeCartItem(id, size);

        return;
      }


      const isIncrease =
        event.target.closest(".cart-item-increase");

      const isDecrease =
        event.target.closest(".cart-item-decrease");

      if (!isIncrease && !isDecrease) return;


      const current =
        getCartItems().find(
          (item) =>
            item.id === id &&
            (item.size || "") === (size || "")
        );

      if (!current) return;


      const nextQuantity =
        isIncrease
          ? current.quantity + 1
          : current.quantity - 1;

      updateCartItemQuantity(
        id,
        size,
        nextQuantity
      );

    }
  );

}


export function initCartPage() {

  const container =
    document.getElementById("cartPage");

  if (!container) return;


  container.innerHTML =
    createCartLayout();


  renderCart();

  initItemControls();


  window.addEventListener(
    "cartChanged",
    renderCart
  );

}
