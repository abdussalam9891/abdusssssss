import { escapeHtml } from "../../utils/format.js";
import { icon } from "../../utils/icon.js";


/*
 * Field names mirror components/profile/addressCard.js — same
 * backend Address schema (fullName / mobile / address / city /
 * state / pincode / isDefault).
 */

function createAddressOption(address, isSelected) {

  const id =
    address?._id || address?.id || "";

  const name =
    address?.fullName || address?.name || "";

  const mobile =
    address?.mobile || address?.phone || "";

  const line =
    address?.address ||
    [address?.addressLine1, address?.addressLine2]
      .filter(Boolean)
      .join(", ") ||
    "";

  const city =
    address?.city || "";

  const state =
    address?.state || "";

  const pincode =
    address?.pincode || address?.postalCode || "";

  const isDefault =
    Boolean(address?.isDefault || address?.default);


  return `

<label
  data-address-option
  data-address-id="${escapeHtml(id)}"

  class="
    flex

    cursor-pointer

    items-start

    gap-4

    rounded-2xl

    border

    ${isSelected ? "border-primary bg-[#FBF7EF]" : "border-[#ECE5D8]"}

    p-5

    transition-colors
    duration-300
  "
>

  <input
    type="radio"
    name="checkoutAddress"
    value="${escapeHtml(id)}"
    ${isSelected ? "checked" : ""}

    class="
      mt-1

      h-4
      w-4

      shrink-0

      accent-primary
    "
  />

  <div class="min-w-0 flex-1">

    <div class="flex flex-wrap items-center gap-2">

      <p class="text-[15px] font-medium text-ink">
        ${escapeHtml(name)}
      </p>

      ${
        isDefault
          ? `
<span
  class="
    rounded-full

    bg-[#FAF7F1]

    px-2.5
    py-0.5

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

    </div>

    ${
      mobile
        ? `<p class="mt-1 text-[13px] text-[#8A8A8A]">${escapeHtml(mobile)}</p>`
        : ""
    }

    <p class="mt-2 text-[14px] leading-6 text-[#55514B]">
      ${escapeHtml(line)}
      ${city || state ? `, ${escapeHtml([city, state].filter(Boolean).join(", "))}` : ""}
      ${pincode ? ` - ${escapeHtml(pincode)}` : ""}
    </p>

  </div>

  <button
    type="button"
    data-address-edit
    data-address-id="${escapeHtml(id)}"

    class="
      shrink-0

      rounded-full

      border
      border-[#E8E1D8]

      p-2

      text-[#55514B]

      transition-colors
      duration-300

      hover:border-primary
      hover:text-primary
    "
  >
    ${icon("pencil", "h-3.5 w-3.5")}
  </button>

</label>

`;
}


export function createAddressSelector(addresses = [], selectedId = "") {

  return `

<div
  class="
    rounded-[28px]

    border
    border-[#ECE5D8]

    bg-[#FCFBF9]

    p-6
    sm:p-7
  "
>

  <div class="flex flex-wrap items-center justify-between gap-4">

    <h2 class="font-serif text-[22px] italic text-ink">
      Shipping Address
    </h2>

    <button
      type="button"
      id="checkoutAddAddressButton"

      class="
        inline-flex

        items-center

        gap-1.5

        rounded-full

        border
        border-ink

        px-4
        py-2

        text-[11px]

        font-medium

        uppercase

        tracking-[0.14em]

        text-ink

        transition-colors
        duration-300

        hover:border-primary
        hover:text-primary
      "
    >
      ${icon("plus", "h-3.5 w-3.5")}
      Add New
    </button>

  </div>


  ${
    addresses.length
      ? `
<div
  id="checkoutAddressList"

  class="
    mt-6

    space-y-4
  "
>
  ${addresses
    .map((address) => {

      const id =
        address?._id || address?.id || "";

      return createAddressOption(
        address,
        id === selectedId
      );
    })
    .join("")}
</div>
`
      : `
<div
  class="
    mt-6

    rounded-2xl

    border
    border-dashed
    border-[#E8E1D8]

    py-10

    text-center
  "
>
  <p class="text-[14px] text-[#8A8A8A]">
    You haven't saved any addresses yet. Add one to continue.
  </p>
</div>
`
  }

</div>

`;
}
