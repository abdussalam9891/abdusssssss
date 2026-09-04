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
