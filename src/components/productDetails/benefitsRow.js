import { WHY_CHOOSE_US } from "../../constants/whyChooseUs.js";
import { icon } from "../../utils/icon.js";


/*
 * Reuses the site's existing, already-published service
 * claims (WHY_CHOOSE_US) rather than inventing new
 * product-page-only guarantees.
 */

const ICONS = {

  certified: "award",

  exchange: "repeat",

  shipping: "truck",

  designs: "globe",

};


export function createBenefitsRow() {

  if (!WHY_CHOOSE_US.length) return "";


  return `

<div
  class="
    grid

    grid-cols-2

    gap-3

    sm:grid-cols-4
  "
>

  ${WHY_CHOOSE_US
    .map(
      (benefit) => `

<div
  class="
    flex

    flex-col

    items-center

    gap-2

    rounded-2xl

    border
    border-[#F2ECE3]

    bg-[#FCFBF9]

    px-3
    py-4

    text-center
  "
>

  ${icon(
    ICONS[benefit.icon] || "sparkles",
    "h-5 w-5 text-primary"
  )}

  <span
    class="
      text-[11px]

      font-medium

      leading-tight

      text-[#555]
    "
  >
    ${benefit.title}
  </span>

</div>

`
    )
    .join("")}

</div>

`;
}
