import { getWishlistCount } from "./wishlistState.js";


/*
 * Syncs the navbar's existing #wishlistCount badge (see
 * features/navbar/desktopNav.js) with the backend-backed
 * wishlist (features/wishlist/wishlistState.js). Reads/writes
 * only that one existing element — the navbar component itself is
 * untouched. Runs sitewide, from main.js, since the navbar
 * renders on every page. Mirrors features/cart/cartBadge.js.
 */

export function initWishlistBadgeSync() {

  function render() {

    const badge =
      document.getElementById("wishlistCount");

    if (!badge) return;


    const count =
      getWishlistCount();


    badge.textContent =
      String(count);

    badge.classList.toggle(
      "hidden",
      count === 0
    );

  }


  render();


  window.addEventListener(
    "wishlistChanged",
    render
  );


  // main.js re-renders the navbar (and its default-state badge)
  // on every login/logout — including once during initial guest
  // hydration — via its own, separately registered `authChanged`
  // listener. Listeners fire in registration order, and main.js's
  // navbar re-render isn't guaranteed to run before this one, so
  // re-applying the count synchronously here can end up writing to
  // the badge element that's about to be replaced. Deferring to
  // the next tick lets that re-render finish first either way.
  window.addEventListener(
    "authChanged",
    () => setTimeout(render, 0)
  );

}
