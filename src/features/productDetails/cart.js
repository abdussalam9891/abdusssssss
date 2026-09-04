import { productState } from "./state.js";
import { addToCart } from "../cart/cartState.js";
import { requireAuth } from "../auth/authGuard.js";
import { showToast } from "../../utils/toast.js";
import { buildCartSize } from "../../utils/cartLine.js";


const ADD_TO_CART_BUTTON_IDS = [
  "productAddToCartButton",
  "productStickyAddToCartButton",
];

const BUY_NOW_BUTTON_IDS = [
  "productBuyNowButton",
  "productStickyBuyNowButton",
];


/*
 * A number here — including 0 — is the backend's own count for the
 * selected size (null/undefined means it didn't report one, treated
 * as available per model.js's pickDefaultSize). The Add to Cart/Buy
 * Now buttons only disable on the product-wide `inStock` flag, which
 * says nothing about this specific size, so a size explicitly at 0
 * needs its own check here.
 */
function isSelectedSizeOutOfStock() {

  const stock =
    productState.selectedSize?.stock;

  return (
    typeof stock === "number" &&
    stock <= 0
  );
}


function buildCartItem() {

  const product =
    productState.product;

  if (!product) return null;


  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    image: product.gallery?.[0] || "",
    price: product.price,
    finalPrice: product.finalPrice,
    // Size and variant travel together in the one field the
    // backend keys a line by — see utils/cartLine.js.
    size: buildCartSize(
      productState.selectedSize?.label,
      productState.selectedVariant
    ),
    quantity: productState.quantity,
  };
}


function getButtons(ids) {

  return ids
    .map(
      (id) => document.getElementById(id)
    )
    .filter(Boolean);
}


export function initAddToCart() {

  const buttons =
    getButtons(ADD_TO_CART_BUTTON_IDS);

  if (!buttons.length) return;


  buttons.forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        if (isSelectedSizeOutOfStock()) {

          showToast({
            type: "error",
            title: "Out of Stock",
            message: "This size is currently out of stock.",
          });

          return;
        }


        const item =
          buildCartItem();

        if (!item) return;


        // The cart is account-bound, so a guest gets the sign-in
        // modal instead — and lands back on this page afterwards
        // (see utils/authRedirect.js) to add the piece for real.
        requireAuth(async () => {

          try {

            await addToCart(item);

            showToast({
              type: "success",
              title: "Added to Cart",
              message:
                `${item.name} × ${item.quantity} added to your cart.`,
            });

          } catch (error) {

            console.error(
              "[Cart] Failed to add to cart:",
              error
            );

            showToast({
              type: "error",
              title: "Couldn't Add to Cart",
              message:
                error?.message ||
                "Something went wrong. Please try again.",
            });

          }

        }, "cart");

      }
    );

  });

}


export function initBuyNow() {

  const buttons =
    getButtons(BUY_NOW_BUTTON_IDS);

  if (!buttons.length) return;


  buttons.forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        if (isSelectedSizeOutOfStock()) {

          showToast({
            type: "error",
            title: "Out of Stock",
            message: "This size is currently out of stock.",
          });

          return;
        }


        const item =
          buildCartItem();

        if (!item) return;


        // Checkout needs an account too — same gate as Add to Cart.
        requireAuth(async () => {

          try {

            await addToCart(item);

            window.location.href =
              "/pages/checkout.html";

          } catch (error) {

            console.error(
              "[Cart] Failed to add to cart:",
              error
            );

            showToast({
              type: "error",
              title: "Couldn't Add to Cart",
              message:
                error?.message ||
                "Something went wrong. Please try again.",
            });

          }

        }, "cart");

      }
    );

  });

}
