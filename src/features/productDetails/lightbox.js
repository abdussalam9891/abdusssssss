import { getProductImages } from "../../utils/getProductImages.js";

import {
  productState,
  setActiveImage,
} from "./state.js";


export function initLightbox() {

  const images = Object.values(
    getProductImages(productState.product)
  ).filter(Boolean);


  const modal =
    document.getElementById(
      "productLightbox"
    );

  const image =
    document.getElementById(
      "lightboxImage"
    );

  const mainImage =
    document.getElementById(
      "productMainImage"
    );

  const closeBtn =
    document.getElementById(
      "closeLightbox"
    );

  const prevBtn =
    document.getElementById(
      "lightboxPrev"
    );

  const nextBtn =
    document.getElementById(
      "lightboxNext"
    );


  /* ------------------------------------------ */
  /* VALIDATION                                */
  /* ------------------------------------------ */

  if (
    !modal ||
    !image ||
    !mainImage
  ) {
    console.warn(
      "[Lightbox] Required elements not found."
    );

    return;
  }


  if (!images.length) {
    console.warn(
      "[Lightbox] No product images found."
    );

    return;
  }


  /* ------------------------------------------ */
  /* RENDER                                    */
  /* ------------------------------------------ */

  function render() {

    const index =
      productState.activeImageIndex;

    const src =
      images[index];

    if (!src) {
      console.warn(
        "[Lightbox] Image not found for index:",
        index
      );

      return;
    }

    image.src = src;

    image.alt =
      productState.product?.name ||
      "Product image";
  }


  /* ------------------------------------------ */
  /* OPEN                                      */
  /* ------------------------------------------ */

  function open() {

    render();

    modal.classList.remove(
      "hidden"
    );

    modal.classList.add(
      "flex"
    );

    document.body.classList.add(
      "overflow-hidden"
    );
  }


  /* ------------------------------------------ */
  /* CLOSE                                     */
  /* ------------------------------------------ */

  function close() {

    modal.classList.remove(
      "flex"
    );

    modal.classList.add(
      "hidden"
    );

    document.body.classList.remove(
      "overflow-hidden"
    );
  }


  /* ------------------------------------------ */
  /* PREVIOUS                                  */
  /* ------------------------------------------ */

  function previous() {

    const current =
      productState.activeImageIndex;

    const index =
      current === 0
        ? images.length - 1
        : current - 1;

    setActiveImage(index);

    render();
  }


  /* ------------------------------------------ */
  /* NEXT                                      */
  /* ------------------------------------------ */

  function next() {

    const current =
      productState.activeImageIndex;

    const index =
      current === images.length - 1
        ? 0
        : current + 1;

    setActiveImage(index);

    render();
  }


  /* ------------------------------------------ */
  /* EVENTS                                    */
  /* ------------------------------------------ */

  mainImage.addEventListener(
    "click",
    open
  );


  closeBtn?.addEventListener(
    "click",
    close
  );


  prevBtn?.addEventListener(
    "click",
    previous
  );


  nextBtn?.addEventListener(
    "click",
    next
  );


  /* ------------------------------------------ */
  /* BACKDROP                                  */
  /* ------------------------------------------ */

  modal.addEventListener(
    "click",
    (event) => {

      if (
        event.target === modal
      ) {
        close();
      }

    }
  );


  /* ------------------------------------------ */
  /* KEYBOARD                                  */
  /* ------------------------------------------ */

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        modal.classList.contains(
          "hidden"
        )
      ) {
        return;
      }


      switch (event.key) {

        case "Escape":
          close();
          break;

        case "ArrowLeft":
          previous();
          break;

        case "ArrowRight":
          next();
          break;

      }

    }
  );

}
