import {
  getCartItems,
  getCartSubtotal,
  updateCartItemQuantity,
  removeCartItem,
} from "./cartState.js";

import { createCartLayout } from "../../components/cart/cartLayout.js";
import { createCartItemRow } from "../../components/cart/cartItemRow.js";
import { createCartSummary } from "../../components/cart/cartSummary.js";
import { websiteService } from "../../services/websiteService.js";


function buildCheckoutMessage(items, subtotal) {

  const lines = [
    "Hello Banshiwaale,",
    "",
    "I'd like to order the following:",
    "",
  ];


  items.forEach((item) => {

    lines.push(
      `• ${item.name}` +
      (item.size ? ` (Size: ${item.size})` : "") +
      ` × ${item.quantity}`
    );

  });


  lines.push(
    "",
    `Estimated subtotal: ₹${Math.round(subtotal).toLocaleString("en-IN")}`,
    "",
    "Could you please confirm availability and final pricing?"
  );


  return lines.join("\n");
}


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


  const checkoutButton =
    document.getElementById(
      "cartCheckoutButton"
    );

  if (checkoutButton) {

    checkoutButton.dataset.checkoutMessage =
      buildCheckoutMessage(items, subtotal);

  }


  window.lucide?.createIcons();


  // renderCart() rebuilds #cartSummary (and its checkout button)
  // from scratch on every change, so the WhatsApp upgrade has to
  // be re-applied each time rather than surviving from the first
  // call. getSocialLinks() memoizes the network request, so this
  // is cheap on repeat calls.
  initCheckoutLink();

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


/*
 * The checkout link renders as a contact-page link (see
 * components/cart/cartSummary.js) so it works without the
 * backend. Once website data resolves, it's upgraded to a
 * WhatsApp deep link — the same fallback pattern used sitewide
 * for enquiries.
 */

async function initCheckoutLink() {

  try {

    const { whatsapp } =
      await websiteService.getSocialLinks();

    if (!whatsapp) {

      console.warn(
        "[Cart] No whatsappNumber configured in the backend " +
        "website data. Checkout link stays on the contact page."
      );

      return;
    }


    const checkoutButton =
      document.getElementById(
        "cartCheckoutButton"
      );

    if (!checkoutButton) return;


    checkoutButton.target = "_blank";

    checkoutButton.rel = "noopener noreferrer";

    checkoutButton.href =
      `${whatsapp}?text=${encodeURIComponent(
        checkoutButton.dataset.checkoutMessage || ""
      )}`;


  } catch (error) {

    console.error(
      "[Cart] Failed to load the WhatsApp checkout number. " +
      "Falling back to the contact page.",
      error
    );

  }

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
