import { createBestSellersSection } from "./bestSellersSection.js";
import {
  renderBestSellersSkeleton,
  loadAndRenderBestSellers,
} from "./renderBestSellers.js";
import { initCarousel } from "../../utils/carousel.js";

export async function initBestSellers() {
  const container =
    document.getElementById("bestSellers-container");

  if (!container) return;

  container.innerHTML =
    createBestSellersSection();

  // Show a loading state immediately so the section is never
  // blank while the API call is in flight.
  renderBestSellersSkeleton();

  await loadAndRenderBestSellers();

  initCarousel({
    containerId: "bestSellersProducts",
    prevId: "bestSellersPrev",
    nextId: "bestSellersNext",
  });
}
