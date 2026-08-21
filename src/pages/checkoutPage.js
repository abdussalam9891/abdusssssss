import { initCheckoutPage } from "../features/checkout/checkoutPageInit.js";

export function loadCheckoutPage() {

  const container =
    document.getElementById("checkoutPage");

  if (!container) return;


  try {

    initCheckoutPage();

  } catch (error) {

    console.error(
      "[loadCheckoutPage] initCheckoutPage failed:",
      error
    );

  }

}
