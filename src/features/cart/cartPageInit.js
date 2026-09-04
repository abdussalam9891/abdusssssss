import {
  getCartItems,
  getAvailableCartItems,
  updateCartItemQuantity,
  removeCartItem,
  getGiftWrap,
  setGiftWrap,
  repairCartImages,
} from "./cartState.js";

import { isLoggedIn } from "../auth/authState.js";
import { giftCardsService } from "../../services/giftCardsService.js";
import { showToast } from "../../utils/toast.js";

import { createCartLayout } from "../../components/cart/cartLayout.js";
import { createCartItemRow } from "../../components/cart/cartItemRow.js";
import { createCartSummary } from "../../components/cart/cartSummary.js";


// Coupons are checkout-only (see features/checkout/orderPanel.js) —
// the cart page previously had its own separate coupon apply/preview
// that never carried over to checkout, so it was removed here.
let availableGiftCards = [];

let appliedGiftCode = "";


function computeTotals(availableItems) {

  const totalMrp =
    availableItems.reduce(
      (sum, item) =>
        sum + (Number(item.price) || 0) * item.quantity,
      0
    );

  const totalFinal =
    availableItems.reduce(
      (sum, item) =>
        sum +
        (Number(item.finalPrice ?? item.price) || 0) *
          item.quantity,
      0
    );

  const giftWrapCharge =
    getGiftWrap() ? availableItems.length * 50 : 0;


  const appliedGift =
    availableGiftCards.find(
      (gift) => gift.giftCode === appliedGiftCode
    );

  const giftDiscount =
    appliedGift
      ? Math.min(
          Number(appliedGift.amount ?? appliedGift.remainingAmount ?? 0),
          totalFinal
        )
      : 0;


  const grandTotal =
    Math.max(
      totalFinal + giftWrapCharge - giftDiscount,
      0
    );


  return {
    totalMrp,
    giftWrapCharge,
    giftDiscount,
    grandTotal,
  };
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


  const availableItems =
    getAvailableCartItems();

  const totals =
    computeTotals(availableItems);


  summaryContainer.innerHTML =
    createCartSummary({
      availableItemCount: availableItems.length,
      totals,
      giftCards: availableGiftCards,
      appliedGiftCode,
      giftWrap: getGiftWrap(),
      hasStockIssue: availableItems.length === 0,
    });


  window.lucide?.createIcons();

}


async function loadGiftCards() {

  // Gift cards belong to the logged-in customer. The cart page is
  // only reachable with an account, but the badge/cart cache can
  // render before auth has resolved, so check anyway.
  if (!isLoggedIn()) return;


  try {

    availableGiftCards =
      await giftCardsService.getMyGiftCards();

  } catch (error) {

    console.error(
      "[Cart] Failed to load gift cards:",
      error
    );

    availableGiftCards = [];
  }


  renderCart();

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

        // removeCartItem() dispatches cartChanged once the
        // backend has been updated, which re-renders below.
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


function initSummaryControls() {

  const summaryContainer =
    document.getElementById("cartSummary");

  if (!summaryContainer) return;


  summaryContainer.addEventListener("change", (event) => {

    if (event.target.id !== "cartGiftWrapToggle") return;

    setGiftWrap(event.target.checked);

    renderCart();

  });


  summaryContainer.addEventListener("click", (event) => {

    const giftApply =
      event.target.closest(".cart-gift-apply");

    if (giftApply) {

      appliedGiftCode = giftApply.dataset.code;

      showToast({
        type: "success",
        title: "Gift Card Applied",
        message: `${appliedGiftCode} has been applied.`,
      });

      renderCart();

      return;
    }


    if (event.target.closest(".cart-gift-remove")) {

      appliedGiftCode = "";

      renderCart();
    }

  });

}


/*
 * The applied gift card here only drives this page's own "Estimated
 * Amount" preview — features/checkout/orderPanel.js computes the
 * checkout total independently and doesn't read it. Gift wrap is the
 * exception: it's shared client-only state (see cartState.js's
 * getGiftWrap/setGiftWrap) that checkout does read, since it's a real
 * charge rather than a coupon-style discount.
 */
export function initCartPage() {

  const container =
    document.getElementById("cartPage");

  if (!container) return;


  container.innerHTML =
    createCartLayout();


  renderCart();

  initItemControls();

  initSummaryControls();


  loadGiftCards();


  /*
   * Swaps in a real photo for any line whose stored thumbnail no
   * longer resolves — it re-renders through cartChanged once it
   * finds one, so the rows above paint immediately either way.
   */
  repairCartImages();


  window.addEventListener(
    "cartChanged",
    renderCart
  );

}
