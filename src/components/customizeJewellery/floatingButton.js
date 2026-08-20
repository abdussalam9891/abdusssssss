export function createCustomizeJewelleryButton() {
  return `
<button
  id="customizeJewelleryBtn"
  type="button"
  aria-label="Custom Jewellery"

  class="
    js-open-customize-modal

    group

    fixed
    right-0
    top-[40%]
    -translate-y-1/2

    z-[90]

    overflow-hidden

    rounded-l-2xl

    bg-[#181818]

    px-1
    py-5

    text-white

    shadow-[0_18px_45px_rgba(0,0,0,0.25)]
  "
>

  <!-- Animated Background -->

  <span
    class="
      absolute
      inset-0

      origin-bottom

      scale-y-0

      bg-[#A07936]

      transition-transform
      duration-700
      ease-[cubic-bezier(0.22,1,0.36,1)]

      group-hover:scale-y-100
    "
  ></span>

  <!-- Text -->

  <span
    class="
      relative
      z-10

      [writing-mode:vertical-rl]
      rotate-180

      text-[10px]
      font-medium
      uppercase
      tracking-[0.35em]
    "
  >
    Custom Jewellery
  </span>

</button>
`;
}
