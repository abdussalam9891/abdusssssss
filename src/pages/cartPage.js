import { initCartPage } from "../features/cart/cartPageInit.js";

export function loadCartPage() {

  const container =
    document.getElementById("cartPage");

  if (!container) return;


  try {

    initCartPage();

  } catch (error) {

    console.error(
      "[loadCartPage] initCartPage failed:",
      error
    );

  }

}
