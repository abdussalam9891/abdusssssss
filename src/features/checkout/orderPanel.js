import { getCartItems, clearCart } from "../cart/cartState.js";
import { createOrderSummary } from "../../components/checkout/orderSummary.js";
import { offersService } from "../../services/offersService.js";
import { placeOrder } from "./orderState.js";
import { showToast } from "../../utils/toast.js";
import { getSelectedAddress } from "./addressPanel.js";
import { getSelectedPaymentMethod } from "./paymentPanel.js";


// Loaded once in the background (see initOrderPanel) — the same
// store-wide coupons already shown on the product page (see
// features/productDetails/offers.js). A failed/empty fetch just
// means Apply will honestly report "Invalid coupon code" rather
// than inventing a match.
let availableCoupons = [];

let appliedCoupon = null; // { code, discountPercent, minPurchase }
let couponError = "";

let onPlacedCallback = null;


function computeTotals(items) {

  const totalMrp =
    items.reduce(
      (sum, item) =>
        sum + (Number(item.price) || 0) * item.quantity,
      0
    );

  const totalFinal =
    items.reduce(
      (sum, item) =>
        sum +
        (Number(item.finalPrice ?? item.price) || 0) *
          item.quantity,
      0
    );

  const itemDiscount =
    Math.max(totalMrp - totalFinal, 0);

  const couponDiscount =
    appliedCoupon
      ? Math.round(
          (totalFinal * (Number(appliedCoupon.discountPercent) || 0)) / 100
        )
      : 0;

  const grandTotal =
    Math.max(totalFinal - couponDiscount, 0);


  return {
    totalMrp,
    totalFinal,
    itemDiscount,
    couponDiscount,
    grandTotal,
  };

}


function renderSection() {

  const container =
    document.getElementById("checkoutOrderSummary");

  if (!container) return;


  const items =
    getCartItems();

  const totals =
    computeTotals(items);


  // A coupon's minPurchase can stop being met after the cart
  // itself changes (item removed/qty reduced elsewhere) — drop it
  // rather than silently keep discounting a total it no longer
  // qualifies for.
  if (appliedCoupon) {

    const minPurchase =
      Number(appliedCoupon.minPurchase) || 0;

    if (totals.totalFinal < minPurchase) {

      appliedCoupon = null;

      couponError = "";

      showToast({
        type: "info",
        title: "Coupon Removed",
        message: "Your cart total no longer meets this coupon's minimum purchase.",
      });

    }

  }


  container.innerHTML =
    createOrderSummary(items, totals, {
      appliedCoupon,
      couponError,
    });

  window.lucide?.createIcons();

  syncPayButtonState();

}


function syncPayButtonState() {

  const button =
    document.getElementById("checkoutPayButton");

  if (!button) return;


  button.disabled = !getSelectedAddress();

}


async function loadCoupons() {

  try {

    availableCoupons =
      await offersService.getAvailableCoupons();

  } catch (error) {

    console.error(
      "[Checkout] Failed to load coupons:",
      error
    );

    availableCoupons = [];

  }

}


function applyCoupon(rawCode) {

  const code =
    (rawCode || "").trim().toUpperCase();

  if (!code) {

    couponError = "Please enter a coupon code.";

    renderSection();

    return;
  }


  const coupon =
    availableCoupons.find(
      (item) =>
        (item.couponCode || "").trim().toUpperCase() === code
    );

  if (!coupon) {

    couponError = "Invalid coupon code.";

    renderSection();

    return;
  }


  const { totalFinal } =
    computeTotals(getCartItems());

  const minPurchase =
    Number(coupon.minPurchase) || 0;

  if (minPurchase > 0 && totalFinal < minPurchase) {

    couponError =
      `Minimum purchase of ₹${Math.round(minPurchase).toLocaleString("en-IN")} required for this coupon.`;

    renderSection();

    return;
  }


  appliedCoupon = {
    code: coupon.couponCode,
    discountPercent: Number(coupon.discount) || 0,
    minPurchase,
  };

  couponError = "";


  showToast({
    type: "success",
    title: "Coupon Applied",
    message: `${appliedCoupon.code} has been applied to your order.`,
  });

  renderSection();

}


function removeCoupon() {

  appliedCoupon = null;

  couponError = "";

  renderSection();

}


/*
 * There is no order/payment backend endpoint yet (see
 * config.js's CART comment — only the cart module itself is
 * confirmed). Placing an order here means genuinely completing the
 * checkout flow end to end (address + payment preference + order
 * record + cart cleared + confirmation screen) rather than handing
 * the customer off to WhatsApp — it just persists the order locally
 * (features/checkout/orderState.js) instead of a real backend, the
 * same honest, documented tradeoff already made for the cart
 * itself. No payment is actually charged for "Online Payment" —
 * the confirmation screen only promises the team will follow up,
 * never a fake "Payment Successful" claim.
 */
function handlePlaceOrder() {

  const address =
    getSelectedAddress();

  if (!address) {

    showToast({
      type: "error",
      title: "Address Required",
      message: "Please select a delivery address to continue.",
    });

    return;
  }


  const items =
    getCartItems();

  if (!items.length) return;


  const totals =
    computeTotals(items);

  const paymentMethod =
    getSelectedPaymentMethod();


  const button =
    document.getElementById("checkoutPayButton");

  if (button) button.disabled = true;


  const order =
    placeOrder({
      items,
      address,
      paymentMethod,
      totals: {
        ...totals,
        couponCode: appliedCoupon?.code || "",
      },
    });


  clearCart();

  appliedCoupon = null;

  couponError = "";


  onPlacedCallback?.(order);

}


export function initOrderPanel(onPlaced) {

  onPlacedCallback = onPlaced || null;


  const container =
    document.getElementById("checkoutOrderSummary");

  if (!container) return;


  renderSection();

  loadCoupons();


  container.addEventListener("click", (event) => {

    if (event.target.closest("#checkoutPayButton")) {
      handlePlaceOrder();
      return;
    }


    if (event.target.closest("#checkoutCouponApplyButton")) {

      const input =
        document.getElementById("checkoutCouponInput");

      applyCoupon(input?.value);

      return;
    }


    if (event.target.closest("#checkoutCouponRemoveButton")) {
      removeCoupon();
    }

  });


  container.addEventListener("keydown", (event) => {

    if (
      event.key === "Enter" &&
      event.target.id === "checkoutCouponInput"
    ) {

      event.preventDefault();

      applyCoupon(event.target.value);

    }

  });


  window.addEventListener("cartChanged", renderSection);

}


export { syncPayButtonState };
