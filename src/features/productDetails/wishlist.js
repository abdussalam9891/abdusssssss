import { productState } from "./state.js";


/*
 * There is no backend wishlist endpoint anywhere in this project
 * (checked: services/, config.js API_ENDPOINTS). The navbar's
 * wishlist link/count is already a pre-existing dead affordance
 * sitewide, so rather than adding another decorative button,
 * this makes the details-page toggle a real — but local-only —
 * feature: it persists to localStorage and nothing else claims
 * to sync it anywhere.
 */

const STORAGE_KEY =
  "banshiwale_wishlist_ids";


function readIds() {

  try {

    const stored =
      JSON.parse(
        localStorage.getItem(STORAGE_KEY)
      );


    return Array.isArray(stored)
      ? stored.filter(
          (id) => typeof id === "string" && id
        )
      : [];

  } catch (error) {

    console.warn(
      "[Wishlist] Stored ids could not be read:",
      error
    );

    return [];
  }

}


function writeIds(ids) {

  try {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(ids)
    );

  } catch (error) {

    console.warn(
      "[Wishlist] Could not persist wishlist:",
      error
    );

  }

}


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
    readIds().includes(productId)
  );


  button.addEventListener(
    "click",
    () => {

      const ids =
        readIds();

      const isSaved =
        ids.includes(productId);

      const next =
        isSaved
          ? ids.filter(
              (id) => id !== productId
            )
          : [
              productId,
              ...ids,
            ];


      writeIds(next);

      setPressed(
        button,
        label,
        !isSaved
      );

    }
  );

}
