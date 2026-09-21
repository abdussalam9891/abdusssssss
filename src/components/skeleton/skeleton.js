/*
 * Reusable skeleton-loading primitives, shared by every section that
 * renders content fetched from the backend at runtime (product grid,
 * showcase/best-sellers carousels, category grid, related/recently
 * viewed products, wishlist). Each section composes these primitives
 * to mirror its own real card's exact box model (same widths,
 * aspect ratios, rounding and line heights as the real markup) so
 * swapping skeleton -> real content never shifts layout (CLS).
 *
 * Shimmer uses Tailwind's own `animate-pulse` plus the site's
 * existing placeholder tokens (bg-[#F5F1EA] / border-[#F2ECE3]),
 * already established by the showcase/best-sellers skeletons rather
 * than a new color. `motion-reduce:animate-none` turns the pulse
 * into a static placeholder for prefers-reduced-motion, per
 * Tailwind's built-in variant.
 */

const PULSE_CLASSES =
  "animate-pulse motion-reduce:animate-none";

const PLACEHOLDER_BG = "bg-[#F5F1EA]";


// ==========================================
// PRIMITIVES
// ==========================================

export function createSkeletonBlock({
  className = "",
} = {}) {
  return `<div class="${PULSE_CLASSES} ${PLACEHOLDER_BG} ${className}"></div>`;
}


export function createSkeletonTextLine({
  width = "w-full",
  height = "h-4",
  className = "",
} = {}) {
  return createSkeletonBlock({
    className: `${height} ${width} rounded ${className}`,
  });
}


export function createSkeletonImage({
  aspect = "aspect-square",
  rounded = "rounded-2xl",
  className = "",
} = {}) {
  return createSkeletonBlock({
    className: `${aspect} ${rounded} border border-[#F2ECE3] ${className}`,
  });
}


// ==========================================
// PRODUCT CARD SKELETON
// Mirrors features/showcase/showcaseCard.js's exact box model:
// image aspect ratio, title line, price line, Add to Cart button.
// ==========================================

export function createProductCardSkeleton({
  isSlider = true,
} = {}) {

  const widthClasses =
    isSlider
      ? `
        flex-shrink-0

        w-[46%]
        sm:w-[31%]
        md:w-[23%]
        lg:w-[calc((100%-96px)/4)]
      `
      : "w-full";

  return `
<div class="${widthClasses}" aria-hidden="true">

  ${createSkeletonImage({
    aspect: "aspect-square lg:aspect-[1/1.02]",
    rounded: "rounded-2xl lg:rounded-[26px]",
  })}

  <div class="mt-1 lg:mt-2 px-0.5 lg:px-1">

    ${createSkeletonTextLine({
      width: "w-3/4",
      height: "h-5 sm:h-6 lg:h-7",
    })}

    <div class="mt-2">
      ${createSkeletonTextLine({
        width: "w-1/3",
        height: "h-6 lg:h-7",
      })}
    </div>

    ${createSkeletonBlock({
      className:
        "mt-3 lg:mt-5 h-10 lg:h-12 w-full rounded-lg lg:rounded-xl",
    })}

  </div>

</div>
`;
}


export function createProductCarouselSkeleton({
  count = 4,
} = {}) {
  return Array.from(
    { length: count },
    () => createProductCardSkeleton({ isSlider: true })
  ).join("");
}


export function createProductGridSkeleton({
  count = 8,
  gridClass = `
    grid

    grid-cols-2

    gap-x-5
    gap-y-10

    md:grid-cols-3

    xl:grid-cols-4

    2xl:grid-cols-4
  `,
  label = "Loading products",
} = {}) {
  return `
<div
  class="${gridClass}"
  role="status"
  aria-label="${label}"
>
  ${Array.from(
    { length: count },
    () => createProductCardSkeleton({ isSlider: false })
  ).join("")}
</div>
`;
}


// ==========================================
// ERROR / EMPTY FALLBACK
// A real, actionable UI — never leaves the skeleton stuck. Pass
// `retryId` and wire a click listener to it after the markup is
// inserted (the caller owns the retry behavior).
// ==========================================

export function createFetchErrorState({
  message = "We couldn't load this right now. Please try again.",
  retryId = "",
  retryLabel = "Retry",
} = {}) {
  return `
<div
  class="
    w-full

    rounded-3xl
    border
    border-dashed
    border-[#E8E2DA]

    px-8
    py-14

    text-center
  "
  role="alert"
>
  <p class="text-ink font-medium">
    ${message}
  </p>

  ${
    retryId
      ? `
  <button
    type="button"
    id="${retryId}"

    class="
      mt-5

      inline-flex

      items-center

      rounded-full

      bg-ink

      px-7
      py-3

      text-[12px]

      font-medium

      uppercase

      tracking-[0.16em]

      text-white

      transition-colors
      duration-300

      hover:bg-primary
    "
  >
    ${retryLabel}
  </button>
  `
      : ""
  }
</div>
`;
}


// ==========================================
// aria-busy HELPER
// Toggles aria-busy on the persistent container so screen readers
// know content is updating; pair with a permanent aria-live="polite"
// on the same container (set once in the static section markup) so
// the resolved state is actually announced.
// ==========================================

export function setSkeletonBusy(container, isBusy) {
  if (!container) return;

  container.setAttribute(
    "aria-busy",
    isBusy ? "true" : "false"
  );
}
