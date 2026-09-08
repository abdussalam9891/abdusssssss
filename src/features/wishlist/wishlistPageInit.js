import { productService } from "../../services/productService.js";

import { isActiveProduct } from "../../utils/productStatus.js";

import { isLoggedIn } from "../auth/authState.js";
import { openAuthModal } from "../auth/authTriggers.js";

import {
  getWishlistIds,
  removeFromWishlist,
} from "./wishlistState.js";

import { createWishlistLayout } from "./wishlistLayout.js";
import { createWishlistCard } from "./wishlistCard.js";


/*
 * Every card on this page is, by definition, already saved, so
 * features/wishlist/wishlistCard.js renders a remove button
 * (`.wishlist-remove-button`) instead of the sitewide save/heart
 * toggle — clicking it always means "take this off my wishlist."
 * features/wishlist/wishlistButtons.js (wired sitewide from
 * main.js) handles that click, plus each card's "Move to Cart"
 * button, via delegation, so this file only needs to fetch and
 * render the saved products themselves.
 *
 * The wishlist requires login (see wishlistState.js), so this
 * page has three states: signed out, signed in with nothing
 * saved, and signed in with saved products.
 */

function updateCount(count) {

  const countEl =
    document.getElementById("wishlistPageCount");

  if (!countEl) return;


  if (!count) {

    countEl.classList.add("hidden");
    countEl.textContent = "";

    return;
  }


  countEl.textContent =
    `${count} ${count === 1 ? "item" : "items"} in your wishlist`;

  countEl.classList.remove("hidden");

}


function showState(name) {

  const states = {
    login: document.getElementById("wishlistLoginState"),
    empty: document.getElementById("wishlistEmptyState"),
    items: document.getElementById("wishlistItems"),
  };

  if (
    !states.login ||
    !states.empty ||
    !states.items
  ) {
    return null;
  }


  Object.entries(states).forEach(
    ([key, element]) => {

      element.classList.toggle(
        "hidden",
        key !== name
      );

    }
  );


  return states;

}


async function renderWishlist() {

  if (!isLoggedIn()) {

    showState("login");
    updateCount(0);

    window.lucide?.createIcons();

    return;
  }


  const ids =
    getWishlistIds();


  if (!ids.length) {

    showState("empty");
    updateCount(0);

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
          result.value &&
          isActiveProduct(result.value)
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
    (id) => removeFromWishlist(id).catch(() => {})
  );


  if (!products.length) {

    showState("empty");
    updateCount(0);

    window.lucide?.createIcons();

    return;
  }


  const states =
    showState("items");

  states.items.innerHTML =
    products
      .map(
        (product) =>
          createWishlistCard(product)
      )
      .join("");

  updateCount(products.length);


  window.lucide?.createIcons();

}


function initSignInButton() {

  const button =
    document.getElementById(
      "wishlistSignInButton"
    );

  button?.addEventListener(
    "click",
    () => openAuthModal("wishlist")
  );

}


export function initWishlistPage() {

  const container =
    document.getElementById("wishlistPage");

  if (!container) return;


  container.innerHTML =
    createWishlistLayout();


  renderWishlist();

  initSignInButton();


  // Covers: the initial wishlist load resolving, any add/remove
  // (including from other showcase cards on this same page), and
  // signing in/out via the modal without a full page reload.
  window.addEventListener(
    "wishlistChanged",
    renderWishlist
  );

  window.addEventListener(
    "authChanged",
    renderWishlist
  );

}
