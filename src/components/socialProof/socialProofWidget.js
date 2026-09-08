import { escapeHtml } from "../../features/productDetails/model.js";

// Persistent shell, appended once. Visibility is toggled purely via
// opacity/translate/pointer-events (mirrors scrollToTopButton.js)
// so the feature never has to add/remove this element itself —
// only swap #socialProofCardSlot's content per rotation.
export function createSocialProofContainer() {
  return `
<div
  id="socialProofToast"

  aria-live="polite"

  class="
    fixed
    bottom-6
    left-5

    z-[80]

    hidden
    lg:block

    opacity-0
    pointer-events-none
    -translate-x-3

    transition-all
    duration-500
  "
>
  <div id="socialProofCardSlot"></div>
</div>
`;
}

// One rotation's content. Rebuilt and swapped into
// #socialProofCardSlot on every show() — cheap, and keeps the close
// button's listener from ever going stale between rotations.
export function createSocialProofCard({
  customerName,
  productLabel,
  imageUrl,
  href,
}) {
  return `
<a
  href="${href}"

  class="
    relative

    group

    flex
    items-center

    gap-3

    w-[300px]

    rounded-2xl

    border
    border-[#ECE5D8]

    bg-white

    p-3
    pr-8

    shadow-[0_20px_50px_rgba(0,0,0,.14)]

    transition-all
    duration-300

    hover:-translate-y-0.5
    hover:shadow-[0_25px_60px_rgba(0,0,0,.2)]
  "
>

  <img
    src="${imageUrl}"
    alt=""

    class="
      h-14
      w-14

      shrink-0

      rounded-xl

      object-cover
    "
  />

  <div class="min-w-0 flex-1">

    <p
      class="
        truncate

        text-[13px]
        leading-5

        text-[#181818]
      "
    >
      <span class="font-semibold">${escapeHtml(customerName)}</span>
      explored
    </p>

    <p
      class="
        truncate

        text-[13px]
        font-medium
        leading-5

        text-[#A07936]
      "
    >
      ${escapeHtml(productLabel)}
    </p>

    <p
      class="
        mt-1

        inline-flex
        items-center

        gap-1.5

        text-[10px]
        font-semibold

        uppercase
        tracking-[0.12em]

        text-[#946E1F]
      "
    >
      <span
        class="
          h-1.5
          w-1.5

          rounded-full

          bg-[#2E7D32]

          animate-pulse
        "
      ></span>
      Trending now
    </p>

  </div>

  <button
    type="button"
    id="socialProofClose"

    aria-label="Dismiss"

    class="
      absolute

      right-2
      top-2

      flex
      h-6
      w-6

      items-center
      justify-center

      rounded-full

      text-[#B0AA9D]

      transition
      duration-300

      hover:bg-[#F3F1EC]
      hover:text-[#181818]
    "
  >
    <i data-lucide="x" class="h-3.5 w-3.5"></i>
  </button>

</a>
`;
}
