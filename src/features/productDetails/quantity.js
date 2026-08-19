import {
  productState,
  setQuantity,
} from "./state.js";

import { formatPrice } from "./model.js";


/*
 * The quantity control only renders when the backend reports a
 * positive `stock` (see components/productDetails/quantitySelector.js),
 * so a known stock ceiling is always available here.
 *
 * The ceiling is read fresh on every render rather than cached
 * once, because selecting a size (features/productDetails/size.js)
 * can narrow it to that size's own stock count.
 */

function getMax() {

  const sizeStock =
    productState.selectedSize?.stock;

  if (
    typeof sizeStock === "number" &&
    sizeStock > 0
  ) {
    return sizeStock;
  }


  return productState.product?.stock || 1;
}


let renderQuantity = null;


export function initQuantitySelector() {

  const value =
    document.getElementById(
      "productQuantityValue"
    );

  if (!value) return;


  const decrease =
    document.getElementById(
      "productQuantityDecrease"
    );

  const increase =
    document.getElementById(
      "productQuantityIncrease"
    );

  const total =
    document.getElementById(
      "productQuantityTotal"
    );


  function render() {

    const max =
      getMax();

    // A newly-selected size may allow fewer units than the
    // quantity already chosen.
    if (productState.quantity > max) {

      setQuantity(max);

    }


    const quantity =
      productState.quantity;

    value.textContent =
      String(quantity);

    value.dataset.quantity =
      String(quantity);


    decrease.disabled =
      quantity <= 1;

    increase.disabled =
      quantity >= max;


    if (total) {

      const finalPrice =
        productState.product?.finalPrice;


      total.textContent =
        quantity > 1 &&
        Number.isFinite(
          Number(finalPrice)
        )
          ? `Total: ${formatPrice(
              Number(finalPrice) * quantity
            )}`
          : "";

    }

  }


  decrease?.addEventListener(
    "click",
    () => {

      setQuantity(
        Math.max(
          1,
          productState.quantity - 1
        )
      );

      render();

    }
  );


  increase?.addEventListener(
    "click",
    () => {

      setQuantity(
        Math.min(
          getMax(),
          productState.quantity + 1
        )
      );

      render();

    }
  );


  renderQuantity = render;

  render();

}


/*
 * Called by features/productDetails/size.js after a size
 * selection changes the effective stock ceiling.
 */
export function refreshQuantityLimits() {

  renderQuantity?.();

}
