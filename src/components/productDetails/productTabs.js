import {
  escapeHtml,
  formatDiscount,
  formatPrice,
} from "../../features/productDetails/model.js";


/*
 * Receives the normalized product produced by
 * features/productDetails/model.js.
 *
 * Rows are built from backend data only: a row that has no
 * backend value is dropped, and a tab with no rows at all is not
 * rendered.
 */


function createRows(rows) {

  const visible =
    rows.filter(
      ([, value]) =>
        value !== "" &&
        value !== null &&
        value !== undefined
    );


  if (!visible.length) return "";


  return `
<div class="space-y-4">

  ${visible
    .map(
      ([key, value]) => `
<div
  class="
    flex

    justify-between

    gap-6

    border-b
    border-[#F2ECE3]

    pb-3
  "
>

  <span class="text-[#777]">
    ${escapeHtml(key)}
  </span>

  <span
    class="
      text-right

      font-medium

      text-[#181818]
    "
  >
    ${escapeHtml(value)}
  </span>

</div>
`
    )
    .join("")}

</div>
`;
}


function createList(items) {

  return `
<ul
  class="
    space-y-3

    text-[#666]
  "
>

  ${items
    .map(
      (item) => `
<li>• ${escapeHtml(item)}</li>
`
    )
    .join("")}

</ul>
`;
}


function createSpecifications(product) {

  const rows = [

    ...product.attributes.map(
      (attribute) => [
        attribute.name,
        attribute.value,
      ]
    ),

    [
      "SKU",
      product.sku,
    ],

    [
      "Category",
      [
        ...product.subCategory,
        ...product.childCategory,
      ].join(", "),
    ],

    [
      "Collection",
      product.sizeCategory,
    ],

    [
      "Gender",
      product.gender.join(", "),
    ],

    [
      "Availability",
      product.inStock === null
        ? ""
        : product.stockStatus ||
          (product.inStock
            ? `In stock (${product.stock})`
            : "Out of stock"),
    ],

  ];


  return createRows(rows);
}


function createPricingBreakdown(product) {

  const rows = [

    [
      "Base Price",
      formatPrice(product.price),
    ],

    [
      "Discount",
      formatDiscount(product),
    ],

    [
      "Making Charges",
      product.makingCharges !== null
        ? `${product.makingCharges}%`
        : "",
    ],

    [
      "Tax",
      product.taxRate !== null
        ? `${product.taxRate}%`
        : "",
    ],

    [
      "Final Price",
      formatPrice(product.finalPrice),
    ],

  ];


  return createRows(rows);
}


function createShipping(product) {

  const rows = [

    [
      "Shipping Weight",
      product.shippingWeight !== null
        ? `${product.shippingWeight}${
            product.weightUnit
              ? ` ${product.weightUnit}`
              : ""
          }`
        : "",
    ],

    [
      "Package Dimensions",
      product.shippingDimensions
        ? `${product.shippingDimensions}${
            product.dimensionUnit
              ? ` ${product.dimensionUnit}`
              : ""
          }`
        : "",
    ],

  ];


  const table =
    createRows(rows);


  return `
${table}

<div class="${table ? "mt-6" : ""}">
  ${createList([
    "Orders are dispatched after quality checks.",
    "Secure packaging for every order.",
    "Return eligibility follows our Refund Policy.",
    "Dedicated WhatsApp support for order updates.",
  ])}
</div>
`;
}


function createGifting(product) {

  const rows = [

    [
      "Occasion",
      product.occasion.join(", "),
    ],

    [
      "Ideal For",
      product.recipient.join(", "),
    ],

  ];


  return createRows(rows);
}


export function createProductTabs(product) {

  const tabs = [

    {
      title: "Description",

      content:
        product.description
          ? `
<p
  class="
    leading-8

    text-[#666]
  "
>
  ${escapeHtml(product.description)}
</p>
`
          : "",
    },

    {
      title: "Specifications",
      content: createSpecifications(product),
    },

    {
      title: "Price Breakdown",
      content: createPricingBreakdown(product),
    },

    {
      title: "Occasion & Gifting",
      content: createGifting(product),
    },

    {
      title: "Jewellery Care",

      content: createList([
        "Store in a dry place after every use.",
        "Keep away from perfumes and harsh chemicals.",
        "Clean gently using a soft polishing cloth.",
        "Remove before swimming or showering.",
        "Store separately to avoid scratches.",
      ]),
    },

    {
      title: "Shipping & Returns",
      content: createShipping(product),
    },

  ].filter(
    (tab) =>
      tab.content &&
      tab.content.trim()
  );


  if (!tabs.length) return "";


  return `

<div
  id="productSpecs"

  class="
    border-t
    border-[#ECE5D8]

    pt-8
  "
>

    <p
      class="
        text-[12px]

        font-semibold

        uppercase

        tracking-[0.28em]

        text-[#A07936]
      "
    >
      Product Details
    </p>


    <div class="mt-4">
${tabs
  .map(
    (tab, index) => `
<div
  class="
    border-b
    border-[#ECE5D8]
  "
>

  <button
    type="button"

    class="
      product-tab

      flex

      w-full

      items-center
      justify-between

      py-6

      text-left
    "

    data-index="${index}"
  >

    <span
      class="
        font-serif

        text-[21px]

        italic

        text-[#181818]
      "
    >
      ${tab.title}
    </span>

    <i
      data-lucide="${
        index === 0
          ? "minus"
          : "plus"
      }"

      class="
        tab-icon

        h-5
        w-5

        text-[#A07936]

        transition-transform
        duration-300
      "
    ></i>

  </button>


  <div
    class="
      tab-content

      overflow-hidden

      transition-all
      duration-500

      ${
        index === 0
          ? "max-h-[600px] pb-8"
          : "max-h-0"
      }
    "
  >
    ${tab.content}
  </div>

</div>
`
  )
  .join("")}
    </div>

</div>

`;
}
