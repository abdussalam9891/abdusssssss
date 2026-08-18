import { productsState } from "./state.js";
import { updateProductsURL } from "./query.js";


const PRODUCT_FILTERS = {

  categories: [
    "rings",
    "chains",
    "bracelets",
    "pendants",
    "earrings",
  ],

  badges: [
    "BESTSELLER",
    "NEW",
    "LIMITED",
  ],

  priceRanges: [

    {
      label: "Under ₹2,000",
      min: 0,
      max: 2000,
    },

    {
      label: "₹2,000 - ₹5,000",
      min: 2000,
      max: 5000,
    },

    {
      label: "Above ₹5,000",
      min: 5000,
      max: Infinity,
    },

  ],

};


function capitalize(text) {

  return (
    text.charAt(0).toUpperCase() +
    text.slice(1)
  );

}


export function createProductsFilters() {

  return `

<aside
  id="productsFilters"

  class="
    hidden
    lg:block

    sticky
    top-28

    h-fit

    rounded-2xl

    border
    border-[#ECE6DF]

    bg-white

    p-7
  "
>

  <h3
    class="
      text-xl
      font-semibold
      text-[#181818]
    "
  >
    Filters
  </h3>


  <!-- CATEGORY -->

  <div class="mt-9">

    <h4
      class="
        mb-5

        text-[12px]

        font-semibold

        uppercase

        tracking-[0.22em]
      "
    >
      Category
    </h4>


    <div class="space-y-4">

      ${PRODUCT_FILTERS.categories
        .map(
          (category) => `

<label
  class="
    flex
    items-center
    gap-3

    cursor-pointer
  "
>

  <input
    type="checkbox"

    data-filter="category"

    value="${category}"

    class="
      h-4
      w-4

      accent-[#A07936]
    "
  >

  <span
    class="
      text-[15px]
      text-[#555]
    "
  >
    ${capitalize(category)}
  </span>

</label>

`
        )
        .join("")}

    </div>

  </div>


  <!-- PRICE -->

  <div
    class="
      mt-10

      border-t
      border-[#EFE8E0]

      pt-8
    "
  >

    <h4
      class="
        mb-5

        text-[12px]

        font-semibold

        uppercase

        tracking-[0.22em]
      "
    >
      Price
    </h4>


    <div class="space-y-4">

      ${PRODUCT_FILTERS.priceRanges
        .map(
          (range, index) => `

<label
  class="
    flex
    items-center
    gap-3

    cursor-pointer
  "
>

  <input
    type="radio"

    name="price"

    data-filter="price"

    data-index="${index}"

    class="
      h-4
      w-4

      accent-[#A07936]
    "
  >

  <span
    class="
      text-[15px]
      text-[#555]
    "
  >
    ${range.label}
  </span>

</label>

`
        )
        .join("")}

    </div>

  </div>


  <!-- COLLECTION -->

  <div
    class="
      mt-10

      border-t
      border-[#EFE8E0]

      pt-8
    "
  >

    <h4
      class="
        mb-5

        text-[12px]

        font-semibold

        uppercase

        tracking-[0.22em]
      "
    >
      Collection
    </h4>


    <div class="space-y-4">

      ${PRODUCT_FILTERS.badges
        .map(
          (badge) => `

<label
  class="
    flex
    items-center
    gap-3

    cursor-pointer
  "
>

  <input
    type="checkbox"

    data-filter="badge"

    value="${badge}"

    class="
      h-4
      w-4

      accent-[#A07936]
    "
  >

  <span
    class="
      text-[15px]
      text-[#555]
    "
  >
    ${badge}
  </span>

</label>

`
        )
        .join("")}

    </div>

  </div>


  <button
    id="clearFilters"

    type="button"

    class="
      mt-10

      w-full

      rounded-lg

      border
      border-[#181818]

      px-5
      py-3

      text-sm

      transition

      hover:bg-[#181818]
      hover:text-white
    "
  >
    Clear Filters
  </button>

</aside>

`;
}


export function renderProductsFilters() {

  const container =
    document.getElementById(
      "productsFiltersContainer"
    );


  if (!container) return;


  container.innerHTML =
    createProductsFilters();
}


export function initFilterEvents(
  onChange
) {

  document
    .querySelectorAll(
      "#productsFilters input"
    )
    .forEach(
      (input) => {

        input.addEventListener(
          "change",
          async () => {

            productsState.filters.categories =
              [
                ...document.querySelectorAll(
                  '[data-filter="category"]:checked'
                ),
              ].map(
                (input) =>
                  input.value.toLowerCase()
              );


            productsState.filters.badges =
              [
                ...document.querySelectorAll(
                  '[data-filter="badge"]:checked'
                ),
              ].map(
                (input) =>
                  input.value.toUpperCase()
              );


            const selectedPrice =
              document.querySelector(
                '[data-filter="price"]:checked'
              );


            if (selectedPrice) {

              const range =
                PRODUCT_FILTERS.priceRanges[
                  Number(
                    selectedPrice.dataset.index
                  )
                ];


              productsState.filters.price = {
                min: range.min,
                max: range.max,
              };

            } else {

              productsState.filters.price =
                null;

            }


            productsState.page = 1;


            updateProductsURL();


            await onChange();

          }
        );

      }
    );


  document
    .getElementById(
      "clearFilters"
    )
    ?.addEventListener(
      "click",
      async () => {

        document
          .querySelectorAll(
            "#productsFilters input"
          )
          .forEach(
            (input) => {
              input.checked = false;
            }
          );


        productsState.filters = {
          categories: [],
          badges: [],
          price: null,
        };


        productsState.page = 1;


        updateProductsURL();


        await onChange();

      }
    );
}


export function restoreFilterUI() {

  document
    .querySelectorAll(
      '[data-filter="category"]'
    )
    .forEach(
      (input) => {

        input.checked =
          productsState.filters.categories.includes(
            input.value.toLowerCase()
          );

      }
    );


  document
    .querySelectorAll(
      '[data-filter="badge"]'
    )
    .forEach(
      (input) => {

        input.checked =
          productsState.filters.badges.includes(
            input.value.toUpperCase()
          );

      }
    );


  if (
    !productsState.filters.price
  ) {
    return;
  }


  PRODUCT_FILTERS.priceRanges
    .forEach(
      (range, index) => {

        if (
          range.min ===
            productsState.filters.price.min &&
          range.max ===
            productsState.filters.price.max
        ) {

          const radio =
            document.querySelector(
              `[data-index="${index}"]`
            );


          if (radio) {
            radio.checked = true;
          }

        }

      }
    );
}
