import { isWishlisted, toggleWishlist } from "./wishlistState.js";


/*
 * components/showcase/showcaseCard.js renders a `.wishlist-button`
 * heart icon (data-product-id) on every product card sitewide —
 * homepage showcase, products listing, related products, recently
 * viewed, and the wishlist page itself — but until now nothing
 * wired it up, so it silently did nothing but bubble the click up
 * to the card's own link and navigate to the product instead.
 *
 * This wires all of them from one place, using event delegation on
 * `document` so it works for cards that don't exist yet at page
 * load (every one of those sections renders asynchronously after
 * its own backend request resolves).
 */

function applyState(button, active) {

  button.classList.toggle(
    "border-[#C9A45C]",
    active
  );

  button.classList.toggle(
    "text-[#C9A45C]",
    active
  );


  button
    .querySelector("[data-lucide]")
    ?.classList.toggle("fill-current", active);

}


function syncButton(button) {

  const productId =
    button.dataset.productId;

  if (!productId) return;


  applyState(
    button,
    isWishlisted(productId)
  );

}


function syncAll(root) {

  root
    .querySelectorAll(".wishlist-button")
    .forEach(syncButton);

}


export function initWishlistButtons() {

  // Click-to-toggle, delegated so it covers cards rendered later.
  document.addEventListener(
    "click",
    (event) => {

      const button =
        event.target.closest(".wishlist-button");

      if (!button) return;


      const productId =
        button.dataset.productId;

      if (!productId) return;


      // Every showcase card is a full-tile <a> to the product —
      // the heart means "save," not "open the product."
      event.preventDefault();

      event.stopPropagation();


      const nowSaved =
        toggleWishlist(productId);

      applyState(
        button,
        nowSaved
      );

    }
  );


  // Cards already on the page when this runs.
  syncAll(document);


  // Cards rendered afterwards (every showcase/related/recently-
  // viewed section fetches its products asynchronously) need their
  // heart's saved-state applied once they actually exist.
  const observer =
    new MutationObserver((mutations) => {

      mutations.forEach((mutation) => {

        mutation.addedNodes.forEach((node) => {

          if (node.nodeType !== 1) return;


          if (node.matches?.(".wishlist-button")) {
            syncButton(node);
          }


          node
            .querySelectorAll?.(".wishlist-button")
            .forEach(syncButton);

        });

      });

    });


  observer.observe(
    document.body,
    {
      childList: true,
      subtree: true,
    }
  );


  // Wishlisting/un-wishlisting from anywhere (e.g. the wishlist
  // page's own cards) keeps every other visible heart in sync.
  window.addEventListener(
    "wishlistChanged",
    () => syncAll(document)
  );

}
