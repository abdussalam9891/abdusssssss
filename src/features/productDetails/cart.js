import { productState } from "./state.js";
import { addToCart } from "../cart/cartState.js";
import { showToast } from "../../utils/toast.js";


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


        window.location.href =
          "/pages/cart.html";

      }
    );

  });

}
