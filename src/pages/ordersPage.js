import { initOrdersPage } from "../features/orders/ordersPageInit.js";

export function loadOrdersPage() {

  const container =
    document.getElementById("ordersPage");

  if (!container) return;


  try {

    initOrdersPage();

  } catch (error) {

    console.error(
      "[loadOrdersPage] initOrdersPage failed:",
      error
    );

  }

}
