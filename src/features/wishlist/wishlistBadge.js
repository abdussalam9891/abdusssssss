import { getWishlistCount } from "./wishlistState.js";


/*
 * Syncs the navbar's existing #wishlistCount badge (see
 * components/navbar/desktopNav.js) with the local wishlist.
 * Reads/writes only that one existing element — the navbar
 * component itself is untouched. Runs sitewide, from main.js,
 * since the navbar renders on every page. Mirrors
 * features/cart/cartBadge.js.
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


  // Keeps other tabs/windows in sync too.
  window.addEventListener(
    "storage",
    (event) => {

      if (event.key === "banshiwale_wishlist_ids") {
        render();
      }

    }
  );


  // main.js re-renders the navbar (and its default-state badge)
  // on every login/logout, so re-apply the real count afterwards.
  window.addEventListener(
    "authChanged",
    render
  );

}
