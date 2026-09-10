import { toStringList } from "../../utils/categoryMatch.js";
import { escapeHtml } from "../../features/productDetails/model.js";
import {
  getCardImages,
  PLACEHOLDER_IMAGE,
} from "../../utils/productImages.js";
import { getProductDetailsHref } from "../../utils/format.js";









// Compact "4.5 ★ (12)" line — mirrors the wishlist card's rating
// format (features/wishlist/wishlistCard.js) instead of the old
// full 5-star row, so adding the Add to Cart button below doesn't
// make the card noticeably taller.
function createCompactRating(rating, reviewCount) {

  if (reviewCount <= 0) return "";

  return `
<span
  class="
    inline-flex
    items-center

    gap-1

    text-[11px]
    sm:text-[12px]

    text-[#8A8A8A]
  "
>
  <span
    class="
      inline-flex
      items-center

      gap-0.5

      font-medium

      text-[#181818]
    "
  >
    ${rating.toFixed(1)}

    <i
      data-lucide="star"

      class="
        h-3
        w-3

        fill-[#C89B3C]
        text-[#C89B3C]
      "
    ></i>
  </span>

  <span>(${reviewCount})</span>
</span>
`;
}


function createDiscount(product) {
  const discountValue =
    Number(product.discountValue) || 0;

  if (discountValue <= 0) return "";

  const label =
    product.discountType === "Percentage"
      ? `${discountValue}% OFF`
      : `${Math.round(discountValue).toLocaleString(
          "en-IN"
        )} % OFF`;

  return `
<span
  class="
    absolute

    left-3
    top-3

    lg:left-5
    lg:top-5

    z-20

    rounded-full

    border
    border-[#E9D9B8]

    bg-[#FBF4E7]

    px-2.5
    py-1

    lg:px-3.5
    lg:py-1.5

    backdrop-blur

    text-[9px]
    lg:text-[10px]

    font-semibold

    uppercase

    tracking-[0.14em]

    text-[#A07936]

    shadow-[0_8px_20px_rgba(0,0,0,.06)]
  "
>
  ${label}
</span>
`;
}


function createWishlistButton(product) {
  return `
<button
  type="button"

  aria-label="Add ${product.name || "product"} to wishlist"

  data-product-id="${product._id || ""}"

  class="
    wishlist-button

    flex

    h-9
    w-9

    lg:h-10
    lg:w-10

    items-center
    justify-center

    rounded-full

    border
    border-[#EEE7DB]

    bg-white/95

    text-[#181818]

    backdrop-blur

    shadow-[0_8px_20px_rgba(0,0,0,.08)]

    transition-all
    duration-300

    hover:-translate-y-1

    hover:border-[#C9A45C]

    hover:text-[#C9A45C]

    hover:shadow-[0_16px_35px_rgba(0,0,0,.12)]
  "
>
  <i
    data-lucide="heart"

    class="
      h-[15px]
      w-[15px]

      lg:h-[17px]
      lg:w-[17px]
    "
  ></i>
</button>
`;
}


function getProductCategory(product) {
  // subCategory/childCategory can arrive as a string instead of an
  // array (or vice versa); toStringList normalizes either shape so
  // this never picks a single character out of a plain string.
  return (
    toStringList(product.subCategory)[0] ||
    toStringList(product.childCategory)[0] ||
    (typeof product.sizeCategory === "string"
      ? product.sizeCategory
      : "") ||
    "Jewellery"
  );
}


function getProductPrice(product) {
  const finalPrice = Number(product.finalPrice);

  if (
    Number.isFinite(finalPrice) &&
    finalPrice > 0
  ) {
    return Math.round(finalPrice);
  }

  return Math.round(Number(product.price) || 0);
}


export function createShowcaseCard(
  product,
  isSlider = true
) {
  if (!product) return "";

  // `hasHover` is false for a product the backend has published
  // with a single photo: the card then renders one image that zooms
  // gently on hover, instead of cross-fading that photo into a copy
  // of itself. Nothing is hardcoded per product — the day a second
  // photo is added, the swap below starts working on its own.
  const images =
    getCardImages(product);

  const price =
    getProductPrice(product);

  const rating =
    Number(product.averageRating) || 0;

  const reviewCount =
    Number(product.totalReviews) || 0;

  const category =
    getProductCategory(product);

  const productId =
    product._id;

  if (!productId) {
    console.warn(
      "Showcase product is missing _id:",
      product
    );

    return "";
  }

  return `

<a
  href="${getProductDetailsHref(
    productId,
    product.slug
  )}"

  class="
    group
    block

    ${
      isSlider
        ? `
          flex-shrink-0

          w-[46%]
          sm:w-[31%]
          md:w-[23%]
          lg:w-[calc((100%-96px)/4)]

          snap-start
        `
        : `
          w-full
        `
    }
  "
>

  <!-- ==========================================
       IMAGE CARD
  =========================================== -->

  <div
    class="
      relative

      overflow-hidden

      rounded-2xl
      lg:rounded-[26px]

      aspect-square
      lg:aspect-[1/1.02]

      border
      border-[#F2ECE3]

      bg-white

      transition-all
      duration-500

      group-hover:border-[#D6B170]
    "
  >

    ${createDiscount(product)}

    <div
      class="
        absolute

        right-3
        top-3

        lg:right-5
        lg:top-5

        z-20

        flex
        flex-col

        gap-2
        lg:gap-2.5
      "
    >
      ${createWishlistButton(product)}
    </div>


    <!-- ========================================
         FRONT IMAGE
    ========================================= -->

    <img
      src="${images.front}"

      alt="${product.name || "Jewellery product"}"

      loading="lazy"

      onerror="
        this.onerror=function(){
          this.onerror=null;
          this.src='${PLACEHOLDER_IMAGE}';
        };
        this.src='${images.frontFallback}';
      "

      class="
        absolute
        inset-0

        m-auto

       h-full
       w-full

        object-cover

        transition-all
        duration-700
        ease-out

        opacity-100

        ${
          images.hasHover
            ? `
              group-hover:opacity-0
              group-hover:scale-110
            `
            : `
              group-hover:scale-105
            `
        }
      "
    />

${
  images.hasHover
    ? `
    <!-- ========================================
         BACK IMAGE
    ========================================= -->

    <img
      src="${images.back}"

      alt="${product.name || "Jewellery product"}"

      loading="lazy"

      onerror="
        this.onerror=function(){
          this.onerror=null;
          this.src='${PLACEHOLDER_IMAGE}';
        };
        this.src='${images.backFallback}';
      "

      class="
        absolute
        inset-0

        h-full
        w-full

        object-cover

        opacity-0

        transition-all
        duration-700

        group-hover:opacity-100
        group-hover:scale-105
      "
    />
`
    : ""
}


    <!-- ========================================
         BOTTOM GRADIENT
    ========================================= -->

    <div
      class="
        absolute
        inset-x-0
        bottom-0

        h-32



        transition-opacity
        duration-500

        opacity-100

        group-hover:opacity-0
      "
    ></div>

  </div>


  <!-- ==========================================
       PRODUCT INFO
  =========================================== -->

  <div
    class="
      mt-1
      lg:mt-2

      px-0.5
      lg:px-1
    "
  >



    <!-- Product Name -->

   <h3
  class="
    truncate

    font-serif

    text-[18px]
    sm:text-[20px]
    lg:text-[26px]

    leading-tight

    tracking-[-0.025em]

    text-[#181818]

    transition-colors
    duration-300

    group-hover:text-[#A07936]
  "
>
      ${product.name || "Untitled Product"}
    </h3>


    <!-- ========================================
         PRICE + RATING
    ========================================= -->

    <div
      class="
        mt-1

        flex

        items-center

        justify-between

        gap-3
      "
    >

      <span
        class="
          text-[18px]
          sm:text-[22px]
          lg:text-[26px]

          font-semibold

          tracking-tight

          text-[#181818]
        "
      >
        ₹${price.toLocaleString("en-IN", {
          maximumFractionDigits: 2,
        })}
      </span>

      ${createCompactRating(rating, reviewCount)}

    </div>


    <!-- ========================================
         ADD TO CART
    ========================================= -->

    <button
      type="button"

      data-product-id="${escapeHtml(productId)}"

      class="
        quick-add-to-cart-button

        relative
        z-10

        mt-3
        lg:mt-5

        flex

        h-10
        lg:h-12

        w-full

        items-center
        justify-center

        gap-2

        rounded-lg
        lg:rounded-xl

        bg-[#181818]

        text-[11px]
        sm:text-[12px]
        lg:text-[13px]

        font-medium

        uppercase

        tracking-[0.08em]
        lg:tracking-[0.14em]

        text-white

        transition-colors
        duration-300

        hover:bg-[#A07936]
      "
    >
      <i
        data-lucide="shopping-bag"

        class="
          h-3.5
          w-3.5

          lg:h-4
          lg:w-4
        "
      ></i>

      <span>Add to Cart</span>
    </button>

  </div>

</a>

`;
}

