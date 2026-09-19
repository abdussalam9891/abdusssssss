import { escapeHtml } from "../../utils/format.js";
import { icon } from "../../utils/icon.js";


/*
 * Field names (fullName / mobile / address / city / state /
 * pincode / isDefault) match the backend's Address schema,
 * confirmed via its validation error message. A couple of
 * alternate keys are still checked as a fallback in case a given
 * response varies (e.g. an `_id`-less shape), but the primary
 * names above are the real contract.
 */

export function createAddressCard(address = {}) {

  const id =
    address?._id || address?.id || "";

  const name =
    address?.fullName ||
    address?.name ||
    "";

  const mobile =
    address?.mobile ||
    address?.phone ||
    "";

  const line =
    address?.address ||
    [address?.addressLine1, address?.addressLine2]
      .filter(Boolean)
      .join(", ") ||
    "";

  const city =
    address?.city ||
    "";

  const state =
    address?.state ||
    "";

  const pincode =
    address?.pincode ||
    address?.postalCode ||
    "";

  const isDefault =
    Boolean(address?.isDefault || address?.default);

  return `

<div
  data-address-card
  data-address-id="${escapeHtml(id)}"

  class="
    relative

    rounded-[22px]

    border
    ${isDefault ? "border-primary" : "border-[#F3EEE6]"}

    bg-white

    p-6
  "
>

  ${
    isDefault
      ? `
  <span
    class="
      absolute
      right-6
      top-6

      rounded-full

      bg-[#FAF7F1]

      px-3
      py-1

      text-[10px]
      font-medium
      uppercase
      tracking-[0.14em]

      text-primary
    "
  >
    Default
  </span>
  `
      : ""
  }

  <p class="pr-20 text-[15px] font-medium text-ink">
    ${escapeHtml(name)}
  </p>

  ${
    mobile
      ? `
  <p class="mt-1 text-[13px] text-[#8A8A8A]">
    ${escapeHtml(mobile)}
  </p>
  `
      : ""
  }

  <p class="mt-3 text-[14px] leading-6 text-[#55514B]">
    ${escapeHtml(line)}
    ${city || state ? `<br>${escapeHtml([city, state].filter(Boolean).join(", "))}` : ""}
    ${pincode ? `<br>${escapeHtml(pincode)}` : ""}
  </p>

  <div class="mt-5 flex items-center gap-3">

    <button
      type="button"
      data-address-edit
      data-address-id="${escapeHtml(id)}"

      class="
        inline-flex
        items-center
        gap-1.5

        rounded-full

        border
        border-[#E8E1D8]

        px-4
        py-2

        text-[12px]
        font-medium

        text-[#55514B]

        transition-colors
        duration-300

        hover:border-primary
        hover:text-primary
      "
    >
      ${icon("pencil", "h-3.5 w-3.5")}
      Edit
    </button>

    <button
      type="button"
      data-address-delete
      data-address-id="${escapeHtml(id)}"

      class="
        inline-flex
        items-center
        gap-1.5

        rounded-full

        border
        border-[#E8E1D8]

        px-4
        py-2

        text-[12px]
        font-medium

        text-[#55514B]

        transition-colors
        duration-300

        hover:border-[#B3261E]
        hover:text-[#B3261E]
      "
    >
      ${icon("trash-2", "h-3.5 w-3.5")}
      Delete
    </button>

  </div>

</div>

`;
}
