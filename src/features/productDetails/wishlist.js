import { productState } from "./state.js";

import { requireAuth } from "../auth/authGuard.js";

import {
  isWishlisted,
  toggleWishlist,
} from "../wishlist/wishlistState.js";

import { showToast } from "../../utils/toast.js";


function setPressed(button, label, pressed) {

  button.setAttribute(
    "aria-pressed",
    String(pressed)
  );


  button.classList.toggle(
    "border-[#A07936]",
    pressed
  );

  button.classList.toggle(
    "text-[#A07936]",
    pressed
  );


  const icon =
    button.querySelector("[data-lucide]");

  icon?.classList.toggle(
    "fill-current",
    pressed
  );


  if (label) {

    label.textContent =
      pressed
        ? "Wishlisted"
        : "Add to Wishlist";

  }

}


export function initWishlistToggle() {

  const button =
    document.getElementById(
      "productWishlistButton"
    );

  if (!button) return;


  const productId =
    productState.product?.id;

  if (!productId) return;


  const label =
    document.getElementById(
      "productWishlistLabel"
    );


  function sync() {

    setPressed(
      button,
      label,
      isWishlisted(productId)
    );

  }


  // The wishlist requires login, so its initial GET only starts
  // once auth is known — this button may render before that
  // resolves, and corrects itself once it does.
  sync();

  window.addEventListener(
    "wishlistChanged",
    sync
  );


  button.addEventListener(
    "click",
    () => {

      requireAuth(async () => {

        try {

          await toggleWishlist(productId);

        } catch (error) {

          console.error(
            "[Product Details] Wishlist toggle failed:",
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

}
