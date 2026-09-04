import { getCartCount } from "./cartState.js";


/*
 * Syncs the navbar's existing #cartCount badge (see
 * components/navbar/desktopNav.js) with the cart cache in
 * cartState.js. Reads/writes only that one existing element — the
 * navbar component itself is untouched. Runs sitewide, from
 * main.js, since the navbar renders on every page.
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


  // The cart itself is no longer kept in localStorage (it's
  // account-bound — see cartState.js), so there's nothing for a
  // cross-tab storage listener to watch; another tab's changes
  // land on the next load of this one.


  // main.js re-renders the navbar (and its default-state badge)
  // on every login/logout — including once during the initial
  // signed-in/signed-out hydration — via its own, separately
  // registered `authChanged` listener. Listeners fire in
  // registration order, and main.js's navbar re-render isn't
  // guaranteed to run before this one, so
  // re-applying the count synchronously here can end up writing to
  // the badge element that's about to be replaced. Deferring to
  // the next tick lets that re-render finish first either way.
  window.addEventListener(
    "authChanged",
    () => setTimeout(render, 0)
  );

}
