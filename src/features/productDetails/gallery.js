import {
  productState,
  setActiveImage,
} from "./state.js";

import { PLACEHOLDER_IMAGE } from "./model.js";


const SWIPE_THRESHOLD = 50;

export function initGallery() {

  // Normalized product: `gallery` is an ordered list of urls.
  const images =
    productState.product?.gallery || [];

  const image =
    document.getElementById("productMainImage");

  if (!image || !images.length) return;


  const buttons =
    document.querySelectorAll(".product-thumbnail");

  const counter =
    document.getElementById(
      "productGalleryCounter"
    );

  const prevButton =
    document.getElementById(
      "productGalleryPrev"
    );

  const nextButton =
    document.getElementById(
      "productGalleryNext"
    );


  function render(index) {

    setActiveImage(index);

    image.src =
      images[index] ||
      PLACEHOLDER_IMAGE;


    buttons.forEach((button) => {

      const isActive =
        Number(button.dataset.index) === index;

      button.classList.toggle(
        "border-primary",
        isActive
      );

      button.classList.toggle(
        "border-[#ECE5D8]",
        !isActive
      );

    });


    if (counter) {

      counter.textContent =
        `${index + 1} / ${images.length}`;

    }

  }


  buttons.forEach((button) => {

    button.addEventListener("click", () => {

      render(
        Number(button.dataset.index)
      );

    });

  });


  prevButton?.addEventListener(
    "click",
    () => {

      const next =
        productState.activeImageIndex === 0
          ? images.length - 1
          : productState.activeImageIndex - 1;

      render(next);

    }
  );


  nextButton?.addEventListener(
    "click",
    () => {

      const next =
        productState.activeImageIndex ===
        images.length - 1
          ? 0
          : productState.activeImageIndex + 1;

      render(next);

    }
  );


  // Swipe support (mobile/touch)

  if (images.length > 1) {

    let touchStartX = 0;
    let touchEndX = 0;

    image.addEventListener(
      "touchstart",
      (event) => {

        touchStartX =
          event.changedTouches[0].clientX;

      },
      { passive: true }
    );

    image.addEventListener(
      "touchend",
      (event) => {

        touchEndX =
          event.changedTouches[0].clientX;

        const distance =
          touchStartX - touchEndX;

        if (
          Math.abs(distance) < SWIPE_THRESHOLD
        ) {
          return;
        }

        const current =
          productState.activeImageIndex;

        if (distance > 0) {

          const next =
            current === images.length - 1
              ? 0
              : current + 1;

          render(next);

        } else {

          const previous =
            current === 0
              ? images.length - 1
              : current - 1;

          render(previous);

        }

      },
      { passive: true }
    );

  }

}
