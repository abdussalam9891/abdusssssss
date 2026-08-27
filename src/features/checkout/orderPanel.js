import { getCartItems, clearCart, getGiftWrap } from "../cart/cartState.js";
import { createOrderSummary } from "../../components/checkout/orderSummary.js";
import { offersService } from "../../services/offersService.js";
import { ordersService } from "../../services/ordersService.js";
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

  const giftWrapCharge =
    getGiftWrap() ? items.length * 50 : 0;

  const grandTotal =
    Math.max(totalFinal + giftWrapCharge - couponDiscount, 0);


  return {
    totalMrp,
    totalFinal,
    itemDiscount,
    couponDiscount,
    giftWrapCharge,
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
      coupons: availableCoupons,
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


function setPayButtonBusy(busy) {

  const button =
    document.getElementById("checkoutPayButton");

  const text =
    document.getElementById("checkoutPayButtonText");

  if (!button) return;


  button.disabled =
    busy || !getSelectedAddress();

  if (text) {

    text.textContent =
      busy ? "Placing Order..." : "Place Order";

  }

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


  renderSection();

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


function buildOrderPayload(items, address, totals, paymentMethod) {

  return {
    items: items.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      finalPrice: Number(item.finalPrice ?? item.price) || 0,
      selectedSize: item.size || "",
    })),

    totalMRP: totals.totalMrp,
    totalDiscount: totals.itemDiscount + totals.couponDiscount,
    totalAmount: totals.grandTotal,

    address: {
      name: address.fullName || address.name || "",
      street: address.address || "",
      city: address.city || "",
      state: address.state || "",
      postalCode: address.pincode || address.postalCode || "",
      mobile: address.mobile || address.phone || "",
    },

    paymentMethod:
      paymentMethod === "cod" ? "COD" : "Online",

    redirectUrl:
      window.location.origin + "/pages/checkout.html",
  };

}


function buildLocalOrder({ orderNumber, items, address, totals }) {

  return {
    orderNumber: orderNumber || "",
    items,
    address,
    paymentMethod: "cod",
    totals,
    placedAt: new Date().toISOString(),
  };

}


/*
 * This store and Mivo Jewels share one backend — order creation and
 * the Cashfree handoff below mirror Mivo's confirmed, working
 * checkout integration (see services/ordersService.js's header
 * comment) rather than an independently-verified contract for
 * banshiwale's own traffic.
 *
 * COD completes immediately: the order is created, the cart is
 * cleared, and the confirmation screen shows right away. Online
 * payment hands off to Cashfree's hosted checkout (window.Cashfree,
 * loaded via pages/checkout.html's SDK script tag) — the browser
 * navigates away entirely, and the cart is only cleared once the
 * customer is redirected back with a confirmed success status (see
 * features/checkout/checkoutPageInit.js's payment-return handling).
 */
async function handlePlaceOrder() {

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


  setPayButtonBusy(true);


  try {

    const payload =
      buildOrderPayload(items, address, totals, paymentMethod);

    const res =
      await ordersService.createOrder(payload);

    // apiClient only resolves (rather than throwing) once the HTTP
    // response was ok — some responses from this backend come back
    // with an empty body on success, which parses to `res === null`
    // rather than `{ success: true }`. Only an explicit
    // `success: false` should be read as a real failure.
    if (res?.success === false) {

      showToast({
        type: "error",
        title: "Order Failed",
        message:
          res?.message ||
          "Unable to place your order. Please try again.",
      });

      setPayButtonBusy(false);

      return;
    }


    if (paymentMethod === "cod") {

      const orderNumber =
        res?.order?.orderNumber ||
        res?.data?.orderNumber ||
        "";

      const order =
        buildLocalOrder({
          orderNumber,
          items,
          address,
          totals,
        });


      await clearCart();

      appliedCoupon = null;

      couponError = "";


      onPlacedCallback?.(order);

      return;
    }


    // Online payment — hand off to Cashfree's hosted checkout.
    const environment =
      res?.data?.environment ||
      res?.environment ||
      "sandbox";

    const paymentSessionId =
      res?.data?.paymentSessionId ||
      res?.paymentSessionId;

    if (!paymentSessionId || !window.Cashfree) {

      showToast({
        type: "error",
        title: "Payment Unavailable",
        message:
          "Could not start online payment. Please try again.",
      });

      setPayButtonBusy(false);

      return;
    }


    const cashfree =
      window.Cashfree({ mode: environment });

    cashfree.checkout({
      paymentSessionId,
      redirectTarget: "_self",
    });

    // The page navigates away to Cashfree's hosted checkout here —
    // no further UI updates needed on this side.


  } catch (error) {

    console.error(
      "[Checkout] Order placement failed:",
      error
    );

    showToast({
      type: "error",
      title: "Order Failed",
      message:
        error?.message ||
        "Something went wrong. Please try again.",
    });

    setPayButtonBusy(false);

  }

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


    const couponApply =
      event.target.closest(".checkout-coupon-apply");

    if (couponApply) {

      applyCoupon(couponApply.dataset.code);

      return;
    }


    if (event.target.closest("#checkoutCouponRemoveButton")) {
      removeCoupon();
    }

  });


  window.addEventListener("cartChanged", renderSection);

}


export { syncPayButtonState };
