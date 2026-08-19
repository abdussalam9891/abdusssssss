import { productState } from "./state.js";

import {
  isWishlisted,
  toggleWishlist,
} from "../wishlist/wishlistState.js";


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
        ? "Saved to Wishlist"
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


  setPressed(
    button,
    label,
    isWishlisted(productId)
  );


  button.addEventListener(
    "click",
    () => {

      const nowSaved =
        toggleWishlist(productId);

      setPressed(
        button,
        label,
        nowSaved
      );

    }
  );

}
