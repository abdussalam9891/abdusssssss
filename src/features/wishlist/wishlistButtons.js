import { isWishlisted, toggleWishlist, removeFromWishlist } from "./wishlistState.js";
import { requireAuth } from "../auth/authGuard.js";
import { showToast } from "../../utils/toast.js";

import { productService } from "../../services/productService.js";
import { normalizeProduct, pickDefaultSize } from "../productDetails/model.js";
import { addToCart } from "../cart/cartState.js";


 

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


      requireAuth(async () => {

        try {

          await toggleWishlist(productId);

        } catch (error) {

          console.error(
            "[Wishlist] Toggle failed:",
            error
          );

          showToast({
            type: "error",
            title: "Couldn't Update Wishlist",
            message:
              "Please try again in a moment.",
          });

        }

      }, "wishlist");

    }
  );


  // Delete button on the wishlist page's own cards (GIVA-style —
  // no heart there, just a direct remove action).
  document.addEventListener(
    "click",
    (event) => {

      const button =
        event.target.closest(".wishlist-remove-button");

      if (!button) return;


      const productId =
        button.dataset.productId;

      if (!productId) return;


      event.preventDefault();

      event.stopPropagation();


      requireAuth(async () => {

        try {

          await removeFromWishlist(productId);

        } catch (error) {

          console.error(
            "[Wishlist] Remove failed:",
            error
          );

          showToast({
            type: "error",
            title: "Couldn't Remove Item",
            message:
              "Please try again in a moment.",
          });

        }

      }, "wishlist");

    }
  );


  // "Move to Cart" on the wishlist page's own cards: adds the
  // product to the (local, guest-friendly) cart, then drops it
  // from the wishlist — a re-fetch is used rather than trusting
  // any data-attributes so the size/price/stock added are current,
  // not whatever was true when the wishlist page last loaded.
  document.addEventListener(
    "click",
    (event) => {

      const button =
        event.target.closest(
          ".wishlist-move-to-cart-button"
        );

      if (!button) return;


      const productId =
        button.dataset.productId;

      if (!productId) return;


      event.preventDefault();

      event.stopPropagation();


      (async () => {

        try {

          const product =
            await productService.getPublicProductById(
              productId
            );

          if (!product) {
            throw new Error(
              "Product no longer available."
            );
          }


          const normalized =
            normalizeProduct(product);

          const size =
            pickDefaultSize(normalized);


          addToCart({
            id: normalized.id,
            name: normalized.name,
            slug: normalized.slug,
            sku: normalized.sku,
            image: normalized.gallery?.[0] || "",
            price: normalized.price,
            finalPrice: normalized.finalPrice,
            size: size?.label || "",
            quantity: 1,
          });


          await removeFromWishlist(productId);


          showToast({
            type: "success",
            title: "Moved to Cart",
            message:
              `${normalized.name} was moved to your cart.`,
          });

        } catch (error) {

          console.error(
            "[Wishlist] Move to cart failed:",
            error
          );

          showToast({
            type: "error",
            title: "Couldn't Move to Cart",
            message:
              "Please try again in a moment.",
          });

        }

      })();

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
