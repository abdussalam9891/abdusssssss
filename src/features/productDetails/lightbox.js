import {
  productState,
  setActiveImage,
} from "./state.js";


const SWIPE_THRESHOLD = 50;


/*
 * The lightbox markup sits outside #productGallery (see
 * components/productDetails/productDetailsLayout.js), so its modal,
 * close button and arrows survive a variant switch while the gallery
 * beside them is re-rendered and initGallery/initLightbox run again.
 * Binding those shared elements on every init would stack a second
 * listener on each — one "next" click would then advance two images
 * — so they are wired exactly once and read the current gallery live
 * instead of capturing it.
 */
let boundControls = false;


// The gallery as it stands right now: variant switches replace it
// (features/productDetails/state.js applyVariantToProduct), and a
// variant can carry a different number of photos than the one before.
function getImages() {

  return productState.product?.gallery || [];
}


export function initLightbox() {

  const images =
    getImages();


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

    const gallery =
      getImages();

    const index =
      productState.activeImageIndex;

    const src =
      gallery[index];

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
  /* NAVIGATION VISIBILITY                     */
  /* ------------------------------------------ */

  /*
   * A product with a single photo has nothing to page through, so
   * the arrows would only ever swap the image for itself. They are
   * hidden through style rather than the `hidden` class because the
   * markup carries `hidden lg:flex`, which would win over it.
   */
  function applyNavVisibility() {

    const multiple =
      getImages().length > 1;

    [prevBtn, nextBtn].forEach((button) => {

      if (!button) return;

      button.style.display =
        multiple ? "" : "none";

    });

  }


  applyNavVisibility();


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

    const gallery =
      getImages();

    if (gallery.length < 2) return;


    const current =
      productState.activeImageIndex;

    const index =
      current === 0
        ? gallery.length - 1
        : current - 1;

    setActiveImage(index);

    render();
  }


  /* ------------------------------------------ */
  /* NEXT                                      */
  /* ------------------------------------------ */

  function next() {

    const gallery =
      getImages();

    if (gallery.length < 2) return;


    const current =
      productState.activeImageIndex;

    const index =
      current === gallery.length - 1
        ? 0
        : current + 1;

    setActiveImage(index);

    render();
  }


  /* ------------------------------------------ */
  /* EVENTS                                    */
  /* ------------------------------------------ */

  // The main image is rebuilt with the gallery, so this one always
  // binds a fresh element.
  mainImage.addEventListener(
    "click",
    open
  );


  // Swipe lives on the lightbox's own image, which is shared too —
  // hence the once-only block below.
  if (boundControls) return;

  boundControls = true;


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
  /* SWIPE (MOBILE/TOUCH)                      */
  /* ------------------------------------------ */

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

      // previous()/next() no-op on a one-photo gallery.
      if (distance > 0) {
        next();
      } else {
        previous();
      }

    },
    { passive: true }
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
