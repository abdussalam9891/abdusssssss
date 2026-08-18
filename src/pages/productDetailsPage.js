import { initProductDetailsPage } from "../features/productDetails/index.js";

export function loadProductDetailsPage() {

  // If this page doesn't contain the product details layout,
  // do nothing.
  const container =
    document.getElementById("productDetails");

  if (!container) return;

  // initProductDetailsPage is async and renders its own
  // loading/error/not-found states, so failures stay inside
  // the product details section.
  initProductDetailsPage().catch((err) => {

    console.error(
      "[loadProductDetailsPage] initProductDetailsPage failed:",
      err
    );

  });

}
