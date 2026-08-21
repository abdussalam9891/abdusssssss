import { icon } from "../../utils/icon.js";


const PAYMENT_OPTIONS = [

  {
    id: "online",
    label: "Online Payment",
    subtitle: "UPI, Cards & Netbanking",
    iconName: "credit-card",
  },

  {
    id: "cod",
    label: "Cash on Delivery",
    subtitle: "Pay when your order arrives",
    iconName: "banknote",
  },

];


export function createPaymentMethods(selected = "online") {

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

  <h2 class="font-serif text-[22px] italic text-[#181818]">
    Payment Method
  </h2>

  <div
    id="checkoutPaymentList"

    class="
      mt-6

      space-y-4
    "
  >

    ${PAYMENT_OPTIONS.map((option) => {

      const isSelected =
        option.id === selected;

      return `
<label
  data-payment-option="${option.id}"

  class="
    flex

    cursor-pointer

    items-center

    gap-4

    rounded-2xl

    border

    ${isSelected ? "border-[#A07936] bg-[#FBF7EF]" : "border-[#ECE5D8]"}

    p-5

    transition-colors
    duration-300
  "
>

  <input
    type="radio"
    name="checkoutPayment"
    value="${option.id}"
    ${isSelected ? "checked" : ""}

    class="
      h-4
      w-4

      shrink-0

      accent-[#A07936]
    "
  />

  <span
    class="
      flex
      h-10
      w-10

      shrink-0

      items-center
      justify-center

      rounded-full

      bg-[#FAF7F1]

      text-[#A07936]
    "
  >
    ${icon(option.iconName, "h-4 w-4")}
  </span>

  <span>
    <span class="block text-[14px] font-medium text-[#181818]">
      ${option.label}
    </span>
    <span class="block text-[12px] text-[#8A8A8A]">
      ${option.subtitle}
    </span>
  </span>

</label>
`;
    }).join("")}

  </div>

</div>

`;
}
