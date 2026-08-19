import { getCartCount } from "./cartState.js";


/*
 * Syncs the navbar's existing #cartCount badge (see
 * components/navbar/desktopNav.js) with the local cart. Reads/
 * writes only that one existing element — the navbar component
 * itself is untouched. Runs sitewide, from main.js, since the
 * navbar renders on every page.
 */

export function initCartBadgeSync() {

  function render() {

    const badge =
      document.getElementById("cartCount");

    if (!badge) return;


    const count =
      getCartCount();


    badge.textContent =
      String(count);

    badge.classList.toggle(
      "hidden",
      count === 0
    );

  }


  render();


  window.addEventListener(
    "cartChanged",
    render
  );


  // Keeps other tabs/windows in sync too.
  window.addEventListener(
    "storage",
    (event) => {

      if (event.key === "banshiwale_cart_items") {
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
