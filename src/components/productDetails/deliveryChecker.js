/*
 * Static markup only — the checker itself (pincode validation,
 * the GET /postalcode/:pincode call, and the result message) is
 * wired up in features/productDetails/delivery.js.
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

      text-primary
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

      placeholder="6-digit pincode"

      aria-label="Pincode"

      class="
        w-full
        min-w-0

        rounded-xl
        sm:rounded-2xl

        border
        border-[#ECE5D8]

        px-3.5
        py-2.5

        sm:px-4
        sm:py-3

        text-[13px]
        sm:text-[14px]

        text-ink

        outline-none

        transition-colors
        duration-300

        placeholder:text-[#B5AE9F]

        focus:border-primary
      "
    >

    <button
      type="button"
      id="productPincodeCheck"

      class="
        shrink-0

        rounded-xl
        sm:rounded-2xl

        border
        border-ink

        px-4
        py-2.5

        sm:px-6
        sm:py-3

        text-[11.5px]
        sm:text-[13px]

        font-medium

        uppercase

        tracking-[0.05em]
        sm:tracking-[0.14em]

        text-ink

        transition-colors
        duration-300

        hover:border-primary
        hover:text-primary

        active:scale-[0.97]
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
