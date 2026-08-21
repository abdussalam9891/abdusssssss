import { isLoggedIn } from "../auth/authState.js";
import { openAuthModal } from "../auth/index.js";
import { getCartItems } from "../cart/cartState.js";

import { createCheckoutLayout } from "../../components/checkout/checkoutLayout.js";
import { createOrderConfirmation } from "../../components/checkout/orderConfirmation.js";

import { initAddressPanel } from "./addressPanel.js";
import { initPaymentPanel } from "./paymentPanel.js";
import { initOrderPanel, syncPayButtonState } from "./orderPanel.js";


let panelsInitialized = false;

// Once an order is placed, clearing the cart fires "cartChanged" —
// the same event this page listens to for showing the empty-cart
// state. Without this flag, that event would immediately replace
// the confirmation screen with "your cart is empty" right after a
// successful order.
let orderPlaced = false;


function showState(name) {

  const loginState =
    document.getElementById("checkoutLoginState");

  const emptyState =
    document.getElementById("checkoutEmptyState");

  const confirmedState =
    document.getElementById("checkoutConfirmedState");

  const content =
    document.getElementById("checkoutContent");

  if (!loginState || !emptyState || !confirmedState || !content) return;


  loginState.classList.toggle("hidden", name !== "login");

  emptyState.classList.toggle("hidden", name !== "empty");

  confirmedState.classList.toggle("hidden", name !== "confirmed");

  content.classList.toggle("hidden", name !== "content");

  content.classList.toggle("grid", name === "content");

}


function initSignInButton() {

  document
    .getElementById("checkoutSignInButton")
    ?.addEventListener(
      "click",
      () => openAuthModal("checkout")
    );

}


function showConfirmation(order) {

  orderPlaced = true;


  const container =
    document.getElementById("checkoutConfirmedState");

  if (container) {

    container.innerHTML =
      createOrderConfirmation(order);

  }


  showState("confirmed");

  window.lucide?.createIcons();

}


function render() {

  if (orderPlaced) return;


  if (!isLoggedIn()) {

    showState("login");

    window.lucide?.createIcons();

    return;
  }


  if (!getCartItems().length) {

    showState("empty");

    window.lucide?.createIcons();

    return;
  }


  showState("content");


  // The three panels each own their own DOM containers and never
  // get torn down once logged in — only #checkoutContent's
  // visibility toggles — so their listeners only need binding once
  // per page load, mirroring features/profile/profilePageInit.js's
  // shell/panel split.
  if (!panelsInitialized) {

    panelsInitialized = true;

    initAddressPanel(syncPayButtonState);

    initPaymentPanel();

    initOrderPanel(showConfirmation);

  }


  window.lucide?.createIcons();

}


export function initCheckoutPage() {

  const container =
    document.getElementById("checkoutPage");

  if (!container) return;


  container.innerHTML =
    createCheckoutLayout();


  initSignInButton();

  render();


  window.addEventListener("authChanged", render);

  window.addEventListener("cartChanged", render);

}
