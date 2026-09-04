import { productService } from "../../services/productService.js";

import {
  normalizeProduct,
  pickDefaultSize,
  pickDefaultVariant,
  formatPrice,
  escapeHtml,
  PLACEHOLDER_IMAGE,
} from "../productDetails/model.js";

import { applyVariantToProduct } from "../productDetails/state.js";

import { pruneProductImages } from "../../utils/pruneBrokenImages.js";

import { addToCart } from "../cart/cartState.js";
import { removeFromWishlist } from "../wishlist/wishlistState.js";
import { requireAuth } from "../auth/authGuard.js";
import { showToast } from "../../utils/toast.js";
import { buildCartSize } from "../../utils/cartLine.js";

import { createQuickAddModal } from "../../components/quickAdd/quickAddModal.js";


/*
 * One shared "pick a size, then add to cart" modal for every trigger
 * sitewide — showcase product cards' Add to Cart button and the
 * wishlist page's Move to Cart button both open this instead of
 * silently guessing a size. A product with no size/variant choice
 * skips the modal entirely and adds straight to cart, same as it
 * always has.
 */

const TRIGGER_SELECTOR =
  ".quick-add-to-cart-button, .wishlist-move-to-cart-button";


let state = {
  product: null,
  selectedSize: null,
  selectedVariant: null,
  source: null,
  submitting: false,
};


function resetState(source) {

  state = {
    product: null,
    selectedSize: null,
    selectedVariant: null,
    source,
    submitting: false,
  };

}


function getElements() {

  return {
    modal: document.getElementById("quickAddModal"),
    panel: document.getElementById("quickAddModalPanel"),
    body: document.getElementById("quickAddModalBody"),
  };

}


function ensureModalMounted() {

  if (document.getElementById("quickAddModal")) return;

  document.body.insertAdjacentHTML(
    "beforeend",
    createQuickAddModal()
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


  resetState(null);

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

    py-10
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
<div class="py-10 text-center">
  <p class="text-[14px] text-[#B3261E]">
    Couldn't load this product. Please try again.
  </p>
</div>
`;

}


function createSizeOption(size, isActive) {

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
    quick-add-size-option

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


function createVariantOption(variant, isActive) {

  const thumb =
    variant.images?.[0] || "";

  return `
<button
  type="button"

  data-variant-id="${escapeHtml(variant.id)}"

  aria-label="${escapeHtml(variant.label)}"

  class="
    quick-add-variant-option

    flex

    items-center

    gap-2

    rounded-lg

    border

    py-1.5
    pl-1.5
    pr-3.5

    text-[13px]

    font-medium

    transition-all
    duration-300

    ${
      isActive
        ? "border-[#A07936]"
        : "border-[#ECE5D8]"
    }

    text-[#181818]

    hover:border-[#A07936]
    active:scale-95
  "
>
  ${
    thumb
      ? `
<img
  src="${escapeHtml(thumb)}"

  alt=""

  loading="lazy"

  onerror="this.onerror=null;this.src='${PLACEHOLDER_IMAGE}';"

  class="
    h-8
    w-8

    shrink-0

    rounded-md

    object-cover
  "
/>
`
      : ""
  }
  ${escapeHtml(variant.label)}
</button>
`;

}


function renderProduct(product) {

  const { body } = getElements();

  if (!body) return;


  const sizes =
    product.availableSizes;

  const variants =
    product.variants;

  const image =
    product.gallery?.[0] || PLACEHOLDER_IMAGE;


  const title =
    document.getElementById("quickAddModalTitle");

  if (title) {

    title.textContent =
      variants.length && sizes.length
        ? "Choose Options"
        : variants.length
          ? "Select Option"
          : "Select Size";

  }


  body.innerHTML = `

<div class="flex items-center gap-4">

  <div
    class="
      h-16
      w-16

      shrink-0

      overflow-hidden

      rounded-xl

      border
      border-[#ECE5D8]

      bg-[#FCFBF9]
    "
  >
    <img
      src="${escapeHtml(image)}"
      alt="${escapeHtml(product.name)}"

      onerror="this.onerror=null;this.src='${PLACEHOLDER_IMAGE}';"

      class="h-full w-full object-cover"
    >
  </div>

  <div class="min-w-0">

    <p
      class="
        truncate

        font-serif
        italic

        text-[15px]

        text-[#181818]
      "
    >
      ${escapeHtml(product.name)}
    </p>

    <p
      class="
        mt-1

        text-[15px]

        font-semibold

        text-[#181818]
      "
    >
      ${formatPrice(product.finalPrice)}
    </p>

  </div>

</div>

${
  variants.length
    ? `
<div class="mt-6">

  <p
    class="
      text-[12px]

      font-semibold

      uppercase

      tracking-[0.22em]

      text-[#A07936]
    "
  >
    Select Option
  </p>

  <div
    id="quickAddVariantOptions"

    class="
      mt-3

      flex
      flex-wrap

      gap-2.5
    "
  >
    ${variants
      .map((variant) =>
        createVariantOption(
          variant,
          variant.id === state.selectedVariant?.id
        )
      )
      .join("")}
  </div>

</div>
`
    : ""
}

${
  sizes.length
    ? `
<div class="mt-6">

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
    id="quickAddSizeOptions"

    class="
      mt-3

      flex
      flex-wrap

      gap-2.5
    "
  >
    ${sizes
      .map((size) =>
        createSizeOption(
          size,
          size.label === state.selectedSize?.label
        )
      )
      .join("")}
  </div>

</div>
`
    : ""
}

<p
  id="quickAddModalError"

  class="mt-4 hidden text-[13px] text-[#B3261E]"
></p>

<button
  type="button"
  id="quickAddConfirmButton"

  class="
    mt-6

    flex

    w-full

    items-center
    justify-center

    gap-2

    rounded-full

    bg-[#181818]

    py-3.5

    text-[12px]

    font-medium

    uppercase

    tracking-[0.14em]

    text-white

    transition-colors
    duration-300

    hover:bg-[#A07936]

    disabled:cursor-not-allowed
    disabled:opacity-60
  "
>
  <i data-lucide="shopping-bag" class="h-4 w-4"></i>
  <span>Add to Cart</span>
</button>

`;

  window.lucide?.createIcons();

}


async function confirmAdd() {

  const product =
    state.product;

  if (!product || state.submitting) return;


  const confirmButton =
    document.getElementById("quickAddConfirmButton");

  const errorMessage =
    document.getElementById("quickAddModalError");


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


  // Every clickable size option is already disabled at 0 stock (see
  // createSizeOption above) — this only catches pickDefaultSize()
  // having defaulted to one because every size was out of stock.
  if (
    typeof state.selectedSize?.stock === "number" &&
    state.selectedSize.stock <= 0
  ) {

    if (errorMessage) {

      errorMessage.textContent =
        "This size is currently out of stock.";

      errorMessage.classList.remove("hidden");

    }

    return;
  }


  state.submitting = true;

  if (confirmButton) confirmButton.disabled = true;

  errorMessage?.classList.add("hidden");


  const isFromWishlist =
    state.source === "wishlist";


  try {

    await addToCart({
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
        state.selectedSize?.label,
        state.selectedVariant
      ),
      quantity: 1,
    });

  } catch (error) {

    console.error(
      "[Quick Add] Failed to add to cart:",
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

    if (confirmButton) confirmButton.disabled = false;

    return;
  }


  // The cart add itself succeeded — report that now and close,
  // rather than making the user wait on (or blaming a failed add
  // on) the wishlist removal below, which is a secondary cleanup
  // step, not the thing the user asked for.
  showToast({
    type: "success",
    title: isFromWishlist ? "Moved to Cart" : "Added to Cart",
    message: isFromWishlist
      ? `${product.name} was moved to your cart.`
      : `${product.name} was added to your cart.`,
  });

  closeModal();


  if (isFromWishlist) {

    removeFromWishlist(product.id).catch((error) => {

      console.error(
        "[Quick Add] Added to cart, but failed to remove from wishlist:",
        error
      );

    });

  }

}


async function openForProduct(productId, source) {

  resetState(source);


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


    /*
     * A product can be published with a photo whose file never
     * reached storage — the url is in the payload but answers 403.
     * The product-details page already drops those before building
     * its gallery (features/productDetails/index.js); doing the
     * same here matters twice over, because gallery[0] is both what
     * this modal shows and the thumbnail addToCart() remembers for
     * the cart line, so a dead url carted here would follow the
     * shopper all the way to checkout.
     */
    await pruneProductImages(normalized);

    state.product = normalized;


    // A default variant (if any) drives price/image from the
    // start, same as the product-details page — see
    // features/productDetails/state.js's setProduct.
    state.selectedVariant =
      pickDefaultVariant(normalized);

    if (state.selectedVariant) {

      applyVariantToProduct(
        normalized,
        state.selectedVariant
      );

    }


    // No size or variant to choose — add straight to cart, same
    // as the product-details page does for a product with neither.
    if (
      !normalized.availableSizes.length &&
      !normalized.variants.length
    ) {

      await confirmAdd();

      return;
    }


    state.selectedSize =
      pickDefaultSize(normalized);

    openModal();
    renderProduct(normalized);


  } catch (error) {

    console.error(
      "[Quick Add] Failed to load product:",
      error
    );

    openModal();
    renderError();

  }

}


export function initQuickAdd() {

  ensureModalMounted();


  // Opening: either trigger fetches the full product (for its
  // current sizes/stock) before showing anything.
  document.addEventListener(
    "click",
    (event) => {

      const trigger =
        event.target.closest(TRIGGER_SELECTOR);

      if (!trigger) return;


      const productId =
        trigger.dataset.productId;

      if (!productId) return;


      // Every trigger sits on/inside a full-tile product link.
      event.preventDefault();
      event.stopPropagation();


      const source =
        trigger.classList.contains(
          "wishlist-move-to-cart-button"
        )
          ? "wishlist"
          : "card";


      // Adding to cart needs an account, so check before fetching
      // the product — a guest gets the sign-in modal, not a size
      // picker they can't act on.
      requireAuth(() => {

        openForProduct(productId, source).catch((error) => {

          console.error(
            "[Quick Add] Unexpected error:",
            error
          );

        });

      }, "cart");

    }
  );


  // Closing: the X button or clicking the backdrop.
  document.addEventListener(
    "click",
    (event) => {

      if (
        event.target.closest("#closeQuickAddModal") ||
        event.target.id === "quickAddModalOverlay"
      ) {
        closeModal();
        return;
      }


      const variantOption =
        event.target.closest(".quick-add-variant-option");

      if (variantOption) {

        const variant =
          state.product?.variants.find(
            (candidate) =>
              candidate.id === variantOption.dataset.variantId
          );

        if (variant && state.product) {

          state.selectedVariant = variant;

          applyVariantToProduct(
            state.product,
            variant
          );

          renderProduct(state.product);

        }

        return;
      }


      const sizeOption =
        event.target.closest(".quick-add-size-option");

      if (sizeOption && !sizeOption.disabled) {

        state.selectedSize = {
          label: sizeOption.dataset.sizeLabel,
          stock:
            sizeOption.dataset.sizeStock === ""
              ? null
              : Number(sizeOption.dataset.sizeStock),
        };


        document
          .querySelectorAll(".quick-add-size-option")
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
          .getElementById("quickAddModalError")
          ?.classList.add("hidden");

        return;
      }


      if (event.target.closest("#quickAddConfirmButton")) {
        confirmAdd();
      }

    }
  );


  document.addEventListener(
    "keydown",
    (event) => {

      if (event.key !== "Escape") return;


      const modal =
        document.getElementById("quickAddModal");

      if (modal && !modal.classList.contains("hidden")) {
        closeModal();
      }

    }
  );

}
