import { productService } from "../../services/productService.js";

import { isActiveProduct } from "../../utils/productStatus.js";

import { getProductId, getProductSlug, setProduct } from "./state.js";
import { normalizeProduct } from "./model.js";
import { pruneProductImages } from "../../utils/pruneBrokenImages.js";
import { getProductDetailsHref } from "../../utils/format.js";
import { setCanonicalUrl } from "../../utils/seo.js";
import { initGallery } from "./gallery.js";
import { initQuantitySelector } from "./quantity.js";
import { initWishlistToggle } from "./wishlist.js";
import { initSizeSelector } from "./size.js";
import { initVariantSelector } from "./variant.js";
import { initDeliveryChecker } from "./delivery.js";
import { initAddToCart, initBuyNow } from "./cart.js";
import { initShareButton } from "./share.js";
import { initOffers } from "./offers.js";
import { initReviews } from "./reviews.js";

import { createProductDetailsLayout } from "../../components/productDetails/productDetailsLayout.js";
import { createProductGallery } from "../../components/productDetails/productGallery.js";
import { createProductInfo } from "../../components/productDetails/productInfo.js";
import { initProductTabs } from "./tabs.js";
import { initRelatedProducts } from "./relatedProducts.js";
import { initLightbox } from "./lightbox.js";

import {
  saveRecentlyViewed,
  initRecentlyViewed,
} from "./recentlyViewed.js";


/* ------------------------------------------------ */
/* STATE TEMPLATES                                  */
/* ------------------------------------------------ */

function createStateShell(content) {

  return `
<div
  class="
    mx-auto

    max-w-[1600px]

    px-6

    pt-40
    pb-32

    text-center
  "
>
  ${content}
</div>
`;
}


function renderLoading(container) {

  container.innerHTML =
    createStateShell(`
<div
  class="
    flex

    flex-col

    items-center

    gap-5
  "
  role="status"
  aria-live="polite"
>

  <span
    class="
      h-10
      w-10

      animate-spin

      rounded-full

      border-2
      border-[#ECE5D8]
      border-t-[#A07936]
    "
  ></span>

  <p class="text-[#777]">
    Loading product details…
  </p>

</div>
`);
}


function renderNotFound(container) {

  container.innerHTML =
    createStateShell(`
<h2
  class="
    font-serif

    text-5xl

    text-[#181818]
  "
>
  Product Not Found
</h2>

<p class="mt-4 text-[#777]">
  The product you're looking for doesn't exist or is no
  longer available.
</p>

<a
  href="/pages/products.html"

  class="
    mt-8

    inline-flex

    items-center

    rounded-full

    bg-[#181818]

    px-8
    py-4

    text-[13px]

    font-medium

    uppercase

    tracking-[0.18em]

    text-white

    transition-colors
    duration-300

    hover:bg-[#A07936]
  "
>
  Browse Collections
</a>
`);
}


function renderError(container) {

  container.innerHTML =
    createStateShell(`
<p class="text-red-600">
  Unable to load this product.
  Please try again later.
</p>

<a
  href="/pages/products.html"

  class="
    mt-8

    inline-flex

    items-center

    rounded-full

    border
    border-[#181818]

    px-8
    py-4

    text-[13px]

    font-medium

    uppercase

    tracking-[0.18em]

    text-[#181818]

    transition-colors
    duration-300

    hover:border-[#A07936]
    hover:text-[#A07936]
  "
>
  Browse Collections
</a>
`);
}


/* ------------------------------------------------ */
/* RENDER PRODUCT                                   */
/* ------------------------------------------------ */

function renderProduct(container, product) {

  container.innerHTML =
    createProductDetailsLayout(product);


  const gallery =
    document.getElementById(
      "productGallery"
    );

  const info =
    document.getElementById(
      "productInfo"
    );


  if (gallery) {

    gallery.innerHTML =
      createProductGallery(product);

  }


  if (info) {

    info.innerHTML =
      createProductInfo(product);

  }


  /* ---------------------------------------------- */
  /* INITIALIZE COMPONENTS                          */
  /* ---------------------------------------------- */

  initGallery();

  initLightbox();

  initProductTabs();

  initSizeSelector();

  initVariantSelector();

  initQuantitySelector();

  initWishlistToggle();

  initDeliveryChecker();

  initAddToCart();

  initBuyNow();

  initShareButton();


  /*
   * Each of these depends on its own backend request or on
   * local storage, so a failure in one must not take the
   * rendered product down with it.
   */

  saveRecentlyViewed();

  initRelatedProducts();

  initRecentlyViewed();

  initOffers();

  initReviews();


  window.lucide?.createIcons();
}


/* ------------------------------------------------ */
/* ENTRY                                            */
/* ------------------------------------------------ */

export async function initProductDetailsPage() {

  const container =
    document.getElementById("productDetails");

  if (!container) return;


  const productSlug =
    getProductSlug();

  const productId =
    getProductId();


  if (!productSlug && !productId) {

    renderNotFound(container);

    return;
  }


  renderLoading(container);


  let product;

  try {

    // Slug takes priority when both are present — it's the
    // human-readable identifier the API is built around, `id` is
    // kept only as a fallback for links that predate the slug.
    const response =
      productSlug
        ? await productService.getPublicProductBySlug(
            productSlug
          )
        : await productService.getPublicProductById(
            productId
          );


    product =
      normalizeProduct(response);


  } catch (error) {

    console.error(
      "[Product Details] Failed to load product:",
      error
    );


    /*
     * A 400/404 is an answered request: the id is invalid or
     * the product does not exist. Anything else (network,
     * timeout, 5xx) means the backend could not be reached.
     */

    if (
      error?.status === 404 ||
      error?.status === 400
    ) {

      renderNotFound(container);

    } else {

      renderError(container);

    }

    return;
  }


  if (!product) {

    renderNotFound(container);

    return;
  }


  // A direct link/bookmark to a product the admin has since
  // unpublished must 404 like any other missing product, not
  // render a fully purchasable page.
  if (!isActiveProduct(product)) {

    renderNotFound(container);

    return;
  }


  /*
   * Drop gallery images whose files are missing from storage before
   * anything renders. Without this a dead url still claims the
   * first slide and a thumbnail, so the product opens on a
   * placeholder even though its other photos are fine.
   */
  await pruneProductImages(product);


  setProduct(product);

  // Canonicalize to this product's own URL (slug preferred, id as
  // fallback — same rule getProductDetailsHref uses everywhere else)
  // so slug/id both resolving to the same product don't read as
  // duplicate content, and search results land on a clean URL.
  setCanonicalUrl(
    getProductDetailsHref(product.id, product.slug)
  );

  renderProduct(container, product);

}
