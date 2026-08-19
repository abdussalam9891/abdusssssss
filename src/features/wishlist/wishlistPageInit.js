import { productService } from "../../services/productService.js";

import {
  getWishlistIds,
  removeFromWishlist,
} from "./wishlistState.js";

import { createWishlistLayout } from "../../components/wishlist/wishlistLayout.js";
import { createShowcaseCard } from "../../components/showcase/showcaseCard.js";


/*
 * Every card on this page is, by definition, already saved —
 * mark its (otherwise decorative sitewide) heart icon as active
 * so it reads as "saved, tap to remove" rather than a plain
 * outline heart. Scoped to this page only; showcaseCard.js itself
 * is untouched.
 */
function markHeartsActive(container) {

  container
    .querySelectorAll(".wishlist-button")
    .forEach((button) => {

      button.classList.add(
        "border-[#C9A45C]",
        "text-[#C9A45C]"
      );

      button
        .querySelector("[data-lucide]")
        ?.classList.add("fill-current");

    });

}


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


  markHeartsActive(grid);


  window.lucide?.createIcons();

}


function initRemoveControl() {

  const grid =
    document.getElementById("wishlistItems");

  if (!grid) return;


  grid.addEventListener(
    "click",
    (event) => {

      const button =
        event.target.closest(".wishlist-button");

      if (!button) return;


      // showcaseCard wraps the whole tile in a product link —
      // the heart here means "remove," not "open product."
      event.preventDefault();

      event.stopPropagation();


      const productId =
        button.dataset.productId;

      if (!productId) return;


      removeFromWishlist(productId);

    }
  );

}


export function initWishlistPage() {

  const container =
    document.getElementById("wishlistPage");

  if (!container) return;


  container.innerHTML =
    createWishlistLayout();


  renderWishlist();

  initRemoveControl();


  window.addEventListener(
    "wishlistChanged",
    renderWishlist
  );

}
