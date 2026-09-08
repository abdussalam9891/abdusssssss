import { initProductsPage } from "../features/products/productsInit.js";

export function loadProductsPage() {
  // If this page doesn't contain the products layout,
  // do nothing.
  const container = document.getElementById("productsHero");

  if (!container) return;

  try {
    initProductsPage();
  } catch (err) {
    console.error("[loadProductsPage] initProductsPage failed:", err);
  }
}
