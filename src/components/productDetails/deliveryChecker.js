/*
 * There is no backend pincode-serviceability endpoint anywhere in
 * this project (checked services/). This checker validates the
 * pincode format client-side and gives an honest, generic result
 * — it deliberately does not claim a real per-pincode delivery
 * estimate, since no trustworthy data exists to back one.
 */

export function createDeliveryChecker() {

  return `

<div>

  <p
    class="
      text-[12px]

      font-semibold

      uppercase

      tracking-[0.22em]

      text-[#A07936]
    "
  >
    Check Delivery
  </p>


  <div
    class="
      mt-4

      flex

      gap-3
    "
  >

    <input
      id="productPincodeInput"

      type="text"

      inputmode="numeric"

      maxlength="6"

      placeholder="Enter 6-digit pincode"

      aria-label="Pincode"

      class="
        w-full

        rounded-2xl

        border
        border-[#ECE5D8]

        px-4
        py-3

        text-[14px]

        text-[#181818]

        outline-none

        transition-colors
        duration-300

        placeholder:text-[#B5AE9F]

        focus:border-[#A07936]
      "
    >

    <button
      type="button"
      id="productPincodeCheck"

      class="
        shrink-0

        rounded-2xl

        border
        border-[#181818]

        px-6
        py-3

        text-[13px]

        font-medium

        uppercase

        tracking-[0.14em]

        text-[#181818]

        transition-colors
        duration-300

        hover:border-[#A07936]
        hover:text-[#A07936]
      "
    >
      Check
    </button>

  </div>


  <p
    id="productPincodeResult"

    class="
      mt-3

      min-h-[1.25em]

      text-[13px]

      leading-6

      text-[#777]
    "
  ></p>

</div>

`;
}
