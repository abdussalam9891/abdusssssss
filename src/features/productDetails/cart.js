import { productState } from "./state.js";
import { addToCart } from "../cart/cartState.js";
import { showToast } from "../../utils/toast.js";
import { isLoggedIn } from "../auth/authState.js";
import { cartService } from "../../services/cartService.js";


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
    size: productState.selectedSize?.label || "",
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


// Best-effort mirror to the real backend cart (see
// services/cartService.js) for a logged-in user. The local cart
// (features/cart/cartState.js) stays the source of truth for the
// UI, so a failure here is only logged — it must never block or
// undo the local add.
function syncAddToCartBackend(item) {

  if (!isLoggedIn()) return;


  cartService
    .addToCart({
      productId: item.id,
      quantity: item.quantity,
      size: item.size,
    })
    .catch((error) => {

      console.error(
        "[Cart] Backend addToCart sync failed:",
        error
      );

    });

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


        addToCart(item);

        syncAddToCartBackend(item);


        showToast({
          type: "success",
          title: "Added to Cart",
          message:
            `${item.name} × ${item.quantity} added to your cart.`,
        });

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


        addToCart(item);

        syncAddToCartBackend(item);


        window.location.href =
          "/pages/checkout.html";

      }
    );

  });

}
