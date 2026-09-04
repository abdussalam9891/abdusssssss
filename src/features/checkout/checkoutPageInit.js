import { API_BASE_URL } from "../../config.js";
import { isLoggedIn } from "../auth/authState.js";
import { openAuthModal } from "../auth/index.js";
import { getCartItems, clearCart } from "../cart/cartState.js";
import { ordersService } from "../../services/ordersService.js";
import { showToast } from "../../utils/toast.js";

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

  const heading =
    document.getElementById("checkoutHeading");

  const loginState =
    document.getElementById("checkoutLoginState");

  const emptyState =
    document.getElementById("checkoutEmptyState");

  const failedState =
    document.getElementById("checkoutFailedState");

  const confirmedState =
    document.getElementById("checkoutConfirmedState");

  const content =
    document.getElementById("checkoutContent");

  if (
    !heading ||
    !loginState ||
    !emptyState ||
    !failedState ||
    !confirmedState ||
    !content
  ) return;


  // The confirmation screen has its own "Order Confirmed" heading —
  // showing "Checkout" above it too reads as if checkout is still in
  // progress after the order has already been placed.
  heading.classList.toggle("hidden", name === "confirmed");

  loginState.classList.toggle("hidden", name !== "login");

  emptyState.classList.toggle("hidden", name !== "empty");

  failedState.classList.toggle("hidden", name !== "failed");

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


function initRetryButton() {

  document
    .getElementById("checkoutRetryButton")
    ?.addEventListener(
      "click",
      () => {

        clearPaymentReturnParams();

        render();

      }
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


function clearPaymentReturnParams() {

  const url =
    new URL(window.location.href);

  url.search = "";

  window.history.replaceState(
    {},
    "",
    url.toString()
  );

}


/*
 * This store and Mivo Jewels share one backend — the redirect dance
 * below mirrors Mivo's confirmed, working Cashfree return flow
 * rather than an independently-verified contract for banshiwale's
 * own traffic (see services/ordersService.js's header comment).
 *
 * Cashfree's hosted checkout first sends the browser back to this
 * page with `?cf_order_id=...`. The backend then needs to see that
 * value (at ORDERS.CF_PAYMENT_RETURN) to confirm the payment, and
 * responds with a redirect carrying `?status=success` (plus
 * `?orderId=...`) or `?status=failed` — but confirmed live, that
 * redirect's target is `<redirectUrl>/checkout?...`, a fixed path
 * this static, multi-page site has no route for (see "doubt or
 * question.md" #10 for the full trace). Navigating the browser
 * there directly 404s regardless of how this site ends up hosted.
 *
 * So instead of `window.location.href`-ing to the backend endpoint,
 * this fetches it in the background and lets the browser's own
 * fetch implementation follow the redirect chain silently — we only
 * read the *query string* off the final resolved URL (`response.url`)
 * and apply that to this page ourselves, without ever actually
 * navigating to the (broken) path the backend built.
 */
async function handleCfOrderIdRedirect() {

  const params =
    new URLSearchParams(window.location.search);

  const cfOrderId =
    params.get("cf_order_id");

  if (!cfOrderId) return;


  let finalUrl = null;

  try {

    const res =
      await fetch(
        `${API_BASE_URL}/orders/cf-payment-return?cf_order_id=${encodeURIComponent(cfOrderId)}`,
        {
          credentials: "include",
          redirect: "follow",
        }
      );

    finalUrl = res.url;

  } catch (error) {

    console.error(
      "[Checkout] Failed to confirm Cashfree payment:",
      error
    );

  }


  const recoveredSearch =
    finalUrl
      ? new URL(finalUrl).search
      : "?status=failed";

  const url =
    new URL(window.location.href);

  url.search = recoveredSearch;

  window.history.replaceState(
    {},
    "",
    url.toString()
  );

}


function buildOrderFromBackend(raw) {

  const order =
    raw?.order || raw?.data || raw || {};

  return {
    orderNumber:
      order.orderNumber ||
      order.orderId ||
      order._id ||
      "",

    items:
      Array.isArray(order.items)
        ? order.items
        : [],

    address: {
      mobile:
        order.address?.mobile ||
        order.address?.phone ||
        "",
    },

    paymentMethod:
      String(order.paymentMethod || "")
        .toLowerCase()
        .includes("cod")
        ? "cod"
        : "online",

    totals: {
      grandTotal:
        order.totalAmount ??
        order.grandTotal ??
        0,
    },

    placedAt:
      order.createdAt ||
      order.placedAt ||
      new Date().toISOString(),

    payment: {
      transactionId:
        order.bankReference ||
        order.transactionId ||
        "",
    },
  };

}


async function handlePaymentStatusRedirect() {

  const params =
    new URLSearchParams(window.location.search);

  const status =
    params.get("status");

  if (!status) return false;


  if (status === "success") {

    const orderId =
      params.get("orderId");

    clearPaymentReturnParams();


    if (!orderId) {

      showState("failed");

      window.lucide?.createIcons();

      return true;
    }


    try {

      const res =
        await ordersService.getOrder(orderId);

      if (!res?.success) {
        throw new Error(
          res?.message || "Order not found."
        );
      }


      await clearCart();

      showConfirmation(
        buildOrderFromBackend(res)
      );


    } catch (error) {

      console.error(
        "[Checkout] Failed to load order after payment:",
        error
      );

      showToast({
        type: "error",
        title: "Order Lookup Failed",
        message:
          "Your payment may have succeeded, but we couldn't load the order details. Please check My Orders or contact us.",
      });

      showState("failed");

      window.lucide?.createIcons();

    }


    return true;
  }


  if (status === "failed") {

    clearPaymentReturnParams();

    showState("failed");

    window.lucide?.createIcons();

    return true;
  }


  return false;
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

  initRetryButton();


  // If a Cashfree redirect is in progress, resolve it (rewriting
  // this page's own query string from the backend's response) before
  // reading `?status=...` below — see handleCfOrderIdRedirect's
  // comment for why this no longer navigates the browser anywhere.
  handleCfOrderIdRedirect().then(() => {

    handlePaymentStatusRedirect().then((handled) => {

      if (!handled) render();

    });

  });


  window.addEventListener("authChanged", render);

  window.addEventListener("cartChanged", render);

}
