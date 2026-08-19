import { productService } from "../../services/productService.js";

import {
  getWishlistIds,
  removeFromWishlist,
} from "./wishlistState.js";

import { createWishlistLayout } from "../../components/wishlist/wishlistLayout.js";
import { createShowcaseCard } from "../../components/showcase/showcaseCard.js";


/*
 * Every card on this page is, by definition, already saved.
 * features/wishlist/wishlistButtons.js (wired sitewide from
 * main.js) already handles marking each `.wishlist-button` heart
 * active and toggling it on click — including removal here, since
 * clicking an already-saved heart un-saves it — so this file only
 * needs to fetch and render the saved products themselves.
 */

async function renderWishlist() {

  const emptyState =
    document.getElementById("wishlistEmptyState");

  const grid =
    document.getElementById("wishlistItems");

  if (!emptyState || !grid) return;


  const ids =
    getWishlistIds();


  if (!ids.length) {

    emptyState.classList.remove("hidden");

    grid.classList.add("hidden");

    grid.innerHTML = "";

    window.lucide?.createIcons();

    return;
  }


  const results =
    await Promise.allSettled(
      ids.map(
        (id) =>
          productService.getPublicProductById(id)
      )
    );


  const products =
    results
      .filter(
        (result) =>
          result.status === "fulfilled" &&
          result.value
      )
      .map(
        (result) => result.value
      );


  const failed =
    results.filter(
      (result) => result.status === "rejected"
    );

  if (failed.length) {

    console.error(
      "[Wishlist] Some saved products could not be loaded:",
      failed.map((result) => result.reason)
    );

  }


  // A saved id whose product no longer exists (deleted/unpublished)
  // is quietly dropped from the wishlist rather than shown broken.
  const validIds =
    new Set(
      products.map((product) => product._id)
    );

  const staleIds =
    ids.filter((id) => !validIds.has(id));

  staleIds.forEach(
    (id) => removeFromWishlist(id)
  );


  if (!products.length) {

    emptyState.classList.remove("hidden");

    grid.classList.add("hidden");

    grid.innerHTML = "";

    window.lucide?.createIcons();

    return;
  }


  emptyState.classList.add("hidden");

  grid.classList.remove("hidden");


  grid.innerHTML =
    products
      .map(
        (product) =>
          createShowcaseCard(product, false)
      )
      .join("");


  window.lucide?.createIcons();

}


export function initWishlistPage() {

  const container =
    document.getElementById("wishlistPage");

  if (!container) return;


  container.innerHTML =
    createWishlistLayout();


  renderWishlist();


  window.addEventListener(
    "wishlistChanged",
    renderWishlist
  );

}
