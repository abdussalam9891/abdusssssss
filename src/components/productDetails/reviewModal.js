/*
 * Static markup only — open/close, star selection and the POST
 * /review/createReview submission are wired up in
 * features/productDetails/reviews.js.
 */

export function createReviewModal() {

  return `

<div
  id="reviewModal"

  class="
    fixed
    inset-0
    z-[200]

    hidden

    items-center
    justify-center

    bg-black/60
    backdrop-blur-sm

    p-4
  "
>

  <div
    id="reviewModalOverlay"

    class="absolute inset-0"
  ></div>


  <div
    id="reviewModalPanel"

    class="
      relative
      z-10

      w-full
      max-w-md

      rounded-2xl

      border
      border-[#ECE5D8]

      bg-white

      p-6
      sm:p-7

      opacity-0
      scale-95

      transition-all
      duration-300
    "
  >

    <div class="flex items-center justify-between">

      <h3
        class="
          font-serif

          text-[22px]

          italic

          text-ink
        "
      >
        Add Your Review
      </h3>

      <button
        type="button"
        id="closeReviewModal"

        class="
          text-[#B0AA9D]

          transition-colors
          duration-300

          hover:text-ink
        "
      >
        <i data-lucide="x" class="h-5 w-5"></i>
      </button>

    </div>


    <form id="reviewForm" class="mt-6 space-y-5">

      <div>

        <p
          class="
            text-[12px]

            font-semibold

            uppercase

            tracking-[0.18em]

            text-primary
          "
        >
          Your Rating
        </p>

        <div
          id="reviewStarInput"

          class="mt-3 flex gap-2"
        >
          ${[1, 2, 3, 4, 5]
            .map(
              (value) => `
<button
  type="button"
  data-review-star="${value}"

  class="
    text-[30px]
    leading-none

    text-[#DCD5C7]

    transition-transform
    duration-150

    hover:scale-110
  "
>&#9733;</button>
`
            )
            .join("")}
        </div>

      </div>


      <div>

        <label
          for="reviewTextInput"

          class="
            text-[12px]

            font-semibold

            uppercase

            tracking-[0.18em]

            text-primary
          "
        >
          Your Review
        </label>

        <textarea
          id="reviewTextInput"

          rows="4"

          placeholder="Share your experience..."

          class="
            mt-3

            w-full

            resize-none

            rounded-xl

            border
            border-[#ECE5D8]

            px-4
            py-3

            text-[14px]

            text-ink

            outline-none

            transition-colors
            duration-300

            placeholder:text-[#B5AE9F]

            focus:border-primary
          "
        ></textarea>

      </div>


      <p
        id="reviewFormError"

        class="hidden text-[13px] text-[#B3261E]"
      ></p>


      <div class="flex gap-3 pt-1">

        <button
          type="button"
          id="cancelReviewModal"

          class="
            flex-1

            rounded-full

            border
            border-[#ECE5D8]

            py-3

            text-[12px]

            font-medium

            uppercase

            tracking-[0.14em]

            text-ink

            transition-colors
            duration-300

            hover:border-primary
          "
        >
          Cancel
        </button>

        <button
          type="submit"
          id="submitReviewButton"

          class="
            flex-1

            rounded-full

            bg-ink

            py-3

            text-[12px]

            font-medium

            uppercase

            tracking-[0.14em]

            text-white

            transition-colors
            duration-300

            hover:bg-primary

            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          Submit Review
        </button>

      </div>

    </form>

  </div>

</div>

`;
}
