import { productService } from "../../services/productService.js";

import {
  normalizeProduct,
  pickDefaultSize,
  formatPrice,
  formatDiscount,
  escapeHtml,
  PLACEHOLDER_IMAGE,
} from "../productDetails/model.js";

import { addToCart } from "../cart/cartState.js";
import { showToast } from "../../utils/toast.js";
import { getProductDetailsHref } from "../../utils/format.js";

import { createQuickViewModal } from "../../components/quickView/quickViewModal.js";


/*
 * A lightweight preview of a product — photos, price, sizes and a
 * short description — opened from every showcase card's eye icon
 * (components/showcase/showcaseCard.js) without navigating away
 * from the listing. Deliberately doesn't try to replace the full
 * product-details page: reviews, specifications and shipping info
 * stay behind the "View Full Details" link.
 */

const TRIGGER_SELECTOR = ".quick-view-button";


let state = {
  product: null,
  selectedSize: null,
  submitting: false,
};


function resetState() {

  state = {
    product: null,
    selectedSize: null,
    submitting: false,
  };

}


function getElements() {

  return {
    modal: document.getElementById("quickViewModal"),
    panel: document.getElementById("quickViewModalPanel"),
    body: document.getElementById("quickViewModalBody"),
  };

}


function ensureModalMounted() {

  if (document.getElementById("quickViewModal")) return;

  document.body.insertAdjacentHTML(
    "beforeend",
    createQuickViewModal()
  );

}


function openModal() {

  const { modal, panel } = getElements();

  if (!modal || !panel) return;


  modal.classList.remove("hidden");
  modal.classList.add("flex");

  requestAnimationFrame(() => {

    panel.classList.remove(
      "opacity-0",
      "scale-95"
    );

  });

  document.documentElement.classList.add(
    "overflow-hidden"
  );

}


function closeModal() {

  const { modal, panel } = getElements();

  if (!modal || !panel) return;


  panel.classList.add(
    "opacity-0",
    "scale-95"
  );

  document.documentElement.classList.remove(
    "overflow-hidden"
  );

  setTimeout(() => {

    modal.classList.remove("flex");
    modal.classList.add("hidden");

  }, 300);


  resetState();

}


function renderLoading() {

  const { body } = getElements();

  if (!body) return;


  body.innerHTML = `
<div
  class="
    flex
    flex-col
    items-center

    gap-4

    py-16
  "
>
  <span
    class="
      h-8
      w-8

      animate-spin

      rounded-full

      border-2
      border-[#ECE5D8]
      border-t-[#A07936]
    "
  ></span>

  <p class="text-[13px] text-[#8A8A8A]">
    Loading product…
  </p>
</div>
`;

}


function renderError() {

  const { body } = getElements();

  if (!body) return;


  body.innerHTML = `
<div class="py-16 text-center">
  <p class="text-[14px] text-[#B3261E]">
    Couldn't load this product. Please try again.
  </p>
</div>
`;

}


function getCategoryLabel(product) {

  return (
    product.category ||
    product.subCategory?.[0] ||
    product.childCategory?.[0] ||
    product.sizeCategory ||
    "Jewellery"
  );

}


function renderGallery(product) {

  const images =
    product.gallery?.length
      ? product.gallery
      : [PLACEHOLDER_IMAGE];

  const multiple =
    images.length > 1;

  const name =
    escapeHtml(product.name || "Product");


  return `
<div>

  <div
    class="
      relative

      overflow-hidden

      rounded-2xl

      border
      border-[#ECE5D8]

      bg-[#FCFBF9]

      aspect-square
    "
  >
    <img
      id="quickViewMainImage"

      src="${escapeHtml(images[0])}"

      alt="${name}"

      onerror="this.onerror=null;this.src='${PLACEHOLDER_IMAGE}';"

      class="
        h-full
        w-full

        object-cover

        transition-opacity
        duration-300
      "
    >
  </div>

  ${
    multiple
      ? `
<div
  id="quickViewThumbnails"

  class="
    mt-3

    flex

    gap-2.5

    overflow-x-auto

    no-scrollbar
  "
>
  ${images
    .map(
      (image, index) => `
<button
  type="button"

  data-image="${escapeHtml(image)}"

  aria-label="View image ${index + 1} of ${images.length}"

  class="
    quick-view-thumbnail

    h-14
    w-14

    sm:h-16
    sm:w-16

    shrink-0

    overflow-hidden

    rounded-xl

    border

    ${
      index === 0
        ? "border-[#A07936]"
        : "border-[#ECE5D8]"
    }

    bg-white

    transition-all
    duration-300

    hover:border-[#A07936]
  "
>
  <img
    src="${escapeHtml(image)}"

    alt="${name}"

    onerror="this.onerror=null;this.src='${PLACEHOLDER_IMAGE}';"

    class="h-full w-full object-cover"
  />
</button>
`
    )
    .join("")}
</div>
`
      : ""
  }

</div>
`;

}


function renderRating(product) {

  if (!product.totalReviews) return "";


  return `
<span
  class="
    inline-flex
    items-center

    gap-1.5

    text-[13px]

    text-[#8A8A8A]
  "
>
  <span
    class="
      inline-flex
      items-center

      gap-1

      font-medium

      text-[#181818]
    "
  >
    ${product.averageRating.toFixed(1)}

    <i
      data-lucide="star"

      class="
        h-3.5
        w-3.5

        fill-[#C89B3C]
        text-[#C89B3C]
      "
    ></i>
  </span>

  <span>
    (${product.totalReviews} review${
    product.totalReviews === 1 ? "" : "s"
  })
  </span>
</span>
`;

}


function renderPricing(product) {

  const finalPrice =
    formatPrice(product.finalPrice);

  const basePrice =
    formatPrice(product.price);

  const showBasePrice =
    basePrice &&
    finalPrice &&
    Number(product.price) !==
      Number(product.finalPrice);

  const discount =
    formatDiscount(product);


  return `
<div
  class="
    flex
    flex-wrap

    items-center

    gap-3
  "
>
  <span
    class="
      text-[24px]
      sm:text-[28px]

      font-semibold

      text-[#181818]
    "
  >
    ${finalPrice || "Price on request"}
  </span>

  ${
    showBasePrice
      ? `
<span
  class="
    text-[15px]

    text-[#B0A99B]

    line-through
  "
>
  ${basePrice}
</span>
`
      : ""
  }

  ${
    discount
      ? `
<span
  class="
    inline-flex
    items-center

    rounded-full

    border
    border-[#E9D9B8]

    bg-[#FBF4E7]

    px-2.5
    py-1

    text-[10px]

    font-semibold

    uppercase

    tracking-[0.14em]

    text-[#A07936]
  "
>
  ${escapeHtml(discount)}
</span>
`
      : ""
  }
</div>
`;

}


function renderSizeOption(size, isActive) {

  const outOfStock =
    size.stock === 0;

  return `
<button
  type="button"

  data-size-label="${escapeHtml(size.label)}"
  data-size-stock="${
    size.stock === null ? "" : size.stock
  }"

  ${outOfStock ? "disabled" : ""}

  class="
    quick-view-size-option

    rounded-lg

    border

    px-3.5
    py-2

    text-[13px]

    font-medium

    transition-all
    duration-300

    ${
      isActive
        ? "border-[#181818] bg-[#181818] text-white"
        : "border-[#ECE5D8] text-[#181818]"
    }

    ${
      outOfStock
        ? "cursor-not-allowed opacity-40 line-through"
        : "hover:border-[#A07936] active:scale-95"
    }
  "
>
  ${escapeHtml(size.label)}
</button>
`;

}


function renderSizes(product) {

  if (!product.availableSizes.length) return "";


  return `
<div class="mt-5">

  <p
    class="
      text-[12px]

      font-semibold

      uppercase

      tracking-[0.22em]

      text-[#A07936]
    "
  >
    Select Size
  </p>

  <div
    id="quickViewSizeOptions"

    class="
      mt-3

      flex
      flex-wrap

      gap-2.5
    "
  >
    ${product.availableSizes
      .map((size) =>
        renderSizeOption(
          size,
          size.label === state.selectedSize?.label
        )
      )
      .join("")}
  </div>

</div>
`;

}


function renderProduct(product) {

  const { body } = getElements();

  if (!body) return;


  const description =
    product.description
      ? `
<p
  class="
    mt-4

    text-[13px]

    leading-6

    text-[#767066]

    line-clamp-3
  "
>
  ${escapeHtml(product.description)}
</p>
`
      : "";


  body.innerHTML = `

<div
  class="
    grid

    gap-6
    sm:gap-10

    sm:grid-cols-2
  "
>

  ${renderGallery(product)}

  <div class="flex flex-col">

    <p
      class="
        text-[11px]

        font-semibold

        uppercase

        tracking-[0.28em]

        text-[#A07936]
      "
    >
      ${escapeHtml(getCategoryLabel(product))}
    </p>

    <h2
      class="
        mt-2

        font-serif
        italic

        text-[22px]
        sm:text-[26px]

        leading-tight

        text-[#181818]
      "
    >
      ${escapeHtml(product.name)}
    </h2>

    <div class="mt-3">
      ${renderRating(product)}
    </div>

    <div class="mt-4">
      ${renderPricing(product)}
    </div>

    ${description}

    ${renderSizes(product)}

    <p
      id="quickViewModalError"

      class="mt-3 hidden text-[13px] text-[#B3261E]"
    ></p>

    <div
      class="
        mt-6

        grid
        grid-cols-2

        gap-3
      "
    >
      <button
        type="button"
        id="quickViewAddToCartButton"

        class="
          flex

          items-center
          justify-center

          gap-2

          rounded-xl

          border
          border-[#181818]

          py-3

          text-[12px]

          font-medium

          uppercase

          tracking-[0.1em]

          text-[#181818]

          transition-all
          duration-300

          hover:border-[#A07936]
          hover:text-[#A07936]

          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        <i data-lucide="shopping-bag" class="h-4 w-4"></i>
        <span>Add to Cart</span>
      </button>

      <button
        type="button"
        id="quickViewBuyNowButton"

        class="
          flex

          items-center
          justify-center

          gap-2

          rounded-xl

          bg-[#181818]

          py-3

          text-[12px]

          font-medium

          uppercase

          tracking-[0.1em]

          text-white

          transition-colors
          duration-300

          hover:bg-[#A07936]

          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        <i data-lucide="zap" class="h-4 w-4"></i>
        <span>Buy Now</span>
      </button>
    </div>

    <div
      class="
        mt-3

        grid
        grid-cols-2

        gap-3
      "
    >
      <button
        type="button"

        aria-label="Add ${escapeHtml(
          product.name || "product"
        )} to wishlist"

        data-product-id="${escapeHtml(product.id)}"

        class="
          wishlist-button

          flex

          items-center
          justify-center

          gap-2

          rounded-xl

          border
          border-[#ECE5D8]

          py-3

          text-[12px]

          font-medium

          uppercase

          tracking-[0.1em]

          text-[#181818]

          transition-all
          duration-300

          hover:border-[#C9A45C]
          hover:text-[#C9A45C]
        "
      >
        <i data-lucide="heart" class="h-4 w-4"></i>
        <span>Wishlist</span>
      </button>

      <a
        href="${getProductDetailsHref(
          product.id,
          product.slug
        )}"

        class="
          flex

          items-center
          justify-center

          gap-1.5

          rounded-xl

          py-3

          text-[12px]

          font-medium

          uppercase

          tracking-[0.1em]

          text-[#A07936]

          transition-colors
          duration-300

          hover:text-[#181818]
        "
      >
        <span>View Full Details</span>
        <i data-lucide="arrow-right" class="h-3.5 w-3.5"></i>
      </a>
    </div>

  </div>

</div>

`;

  window.lucide?.createIcons();

}


async function submitCart({ redirectToCheckout }) {

  const product =
    state.product;

  if (!product || state.submitting) return;


  const addButton =
    document.getElementById("quickViewAddToCartButton");

  const buyButton =
    document.getElementById("quickViewBuyNowButton");

  const errorMessage =
    document.getElementById("quickViewModalError");


  if (
    product.availableSizes.length &&
    !state.selectedSize
  ) {

    if (errorMessage) {

      errorMessage.textContent =
        "Please select a size.";

      errorMessage.classList.remove("hidden");

    }

    return;
  }


  state.submitting = true;

  if (addButton) addButton.disabled = true;
  if (buyButton) buyButton.disabled = true;

  errorMessage?.classList.add("hidden");


  try {

    await addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      image: product.gallery?.[0] || "",
      price: product.price,
      finalPrice: product.finalPrice,
      size: state.selectedSize?.label || "",
      quantity: 1,
    });

  } catch (error) {

    console.error(
      "[Quick View] Failed to add to cart:",
      error
    );

    showToast({
      type: "error",
      title: "Couldn't Add to Cart",
      message:
        error?.message ||
        "Please try again in a moment.",
    });

    state.submitting = false;

    if (addButton) addButton.disabled = false;
    if (buyButton) buyButton.disabled = false;

    return;
  }


  if (redirectToCheckout) {

    window.location.href =
      "/pages/checkout.html";

    return;
  }


  showToast({
    type: "success",
    title: "Added to Cart",
    message: `${product.name} was added to your cart.`,
  });

  closeModal();

}


async function openForProduct(productId) {

  resetState();


  try {

    const product =
      await productService.getPublicProductById(productId);

    if (!product) {
      throw new Error(
        "Product no longer available."
      );
    }


    const normalized =
      normalizeProduct(product);

    state.product = normalized;

    state.selectedSize =
      pickDefaultSize(normalized);


    openModal();
    renderProduct(normalized);


  } catch (error) {

    console.error(
      "[Quick View] Failed to load product:",
      error
    );

    openModal();
    renderError();

  }

}


export function initQuickView() {

  ensureModalMounted();


  // Opening: fetch the full product before showing anything, same
  // as the quick-add modal.
  document.addEventListener(
    "click",
    (event) => {

      const trigger =
        event.target.closest(TRIGGER_SELECTOR);

      if (!trigger) return;


      const productId =
        trigger.dataset.productId;

      if (!productId) return;


      // Every trigger sits inside a full-tile product link.
      event.preventDefault();
      event.stopPropagation();


      openForProduct(productId).catch((error) => {

        console.error(
          "[Quick View] Unexpected error:",
          error
        );

      });

    }
  );


  // Closing: the X button or clicking the backdrop.
  document.addEventListener(
    "click",
    (event) => {

      if (
        event.target.closest("#closeQuickViewModal") ||
        event.target.id === "quickViewModalOverlay"
      ) {
        closeModal();
        return;
      }


      const thumbnail =
        event.target.closest(".quick-view-thumbnail");

      if (thumbnail) {

        const mainImage =
          document.getElementById("quickViewMainImage");

        if (mainImage) {
          mainImage.src = thumbnail.dataset.image;
        }


        document
          .querySelectorAll(".quick-view-thumbnail")
          .forEach((button) => {

            const isActive =
              button === thumbnail;

            button.classList.toggle(
              "border-[#A07936]",
              isActive
            );

            button.classList.toggle(
              "border-[#ECE5D8]",
              !isActive
            );

          });

        return;
      }


      const sizeOption =
        event.target.closest(".quick-view-size-option");

      if (sizeOption && !sizeOption.disabled) {

        state.selectedSize = {
          label: sizeOption.dataset.sizeLabel,
          stock:
            sizeOption.dataset.sizeStock === ""
              ? null
              : Number(sizeOption.dataset.sizeStock),
        };


        document
          .querySelectorAll(".quick-view-size-option")
          .forEach((button) => {

            const isActive =
              button === sizeOption;

            button.classList.toggle(
              "border-[#181818]",
              isActive
            );

            button.classList.toggle(
              "bg-[#181818]",
              isActive
            );

            button.classList.toggle(
              "text-white",
              isActive
            );

            if (!button.disabled) {

              button.classList.toggle(
                "border-[#ECE5D8]",
                !isActive
              );

              button.classList.toggle(
                "text-[#181818]",
                !isActive
              );

            }

          });


        document
          .getElementById("quickViewModalError")
          ?.classList.add("hidden");

        return;
      }


      if (event.target.closest("#quickViewAddToCartButton")) {
        submitCart({ redirectToCheckout: false });
        return;
      }


      if (event.target.closest("#quickViewBuyNowButton")) {
        submitCart({ redirectToCheckout: true });
      }

    }
  );


  document.addEventListener(
    "keydown",
    (event) => {

      if (event.key !== "Escape") return;


      const modal =
        document.getElementById("quickViewModal");

      if (modal && !modal.classList.contains("hidden")) {
        closeModal();
      }

    }
  );

}
