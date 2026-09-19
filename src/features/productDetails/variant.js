import { productState, setSelectedVariant } from "./state.js";
import { initGallery } from "./gallery.js";
import { initLightbox } from "./lightbox.js";

import { createProductGallery } from "../../components/productDetails/productGallery.js";
import { createPricing } from "../../components/productDetails/productInfo.js";


/*
 * Variants render only when the backend provides variantPricing
 * (see components/productDetails/productInfo.js createVariants),
 * and a default is already applied to the product in state on load
 * (see setProduct in state.js) — this just wires up choosing a
 * different one, swapping the gallery and price to match.
 */

export function initVariantSelector() {

  const container =
    document.getElementById(
      "productVariantOptions"
    );

  if (!container) return;


  const buttons =
    container.querySelectorAll(
      ".product-variant-option"
    );


  function applyActive(selectedId) {

    buttons.forEach((button) => {

      const isActive =
        button.dataset.variantId ===
        selectedId;

      button.classList.toggle(
        "border-primary",
        isActive
      );

      button.classList.toggle(
        "border-[#ECE5D8]",
        !isActive
      );

    });

  }


  buttons.forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        const variantId =
          button.dataset.variantId;

        const variant =
          productState.product?.variants.find(
            (candidate) =>
              candidate.id === variantId
          );

        if (!variant) return;


        setSelectedVariant(variant);

        applyActive(variantId);


        const galleryContainer =
          document.getElementById(
            "productGallery"
          );

        if (galleryContainer) {

          galleryContainer.innerHTML =
            createProductGallery(
              productState.product
            );

          initGallery();

          initLightbox();

          window.lucide?.createIcons();

        }


        const pricingContainer =
          document.getElementById(
            "productPricing"
          );

        if (pricingContainer) {

          pricingContainer.innerHTML =
            createPricing(
              productState.product
            );

        }

      }
    );

  });

}
