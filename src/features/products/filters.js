import { productsState } from "./state.js";
import { updateProductsURL } from "./query.js";
import { escapeHtml } from "../../utils/format.js";
import { normalizeForComparison } from "../../utils/categoryMatch.js";


const PRODUCT_FILTERS = {

  badges: [
    "BESTSELLER",
    "NEW",
    "LIMITED",
  ],

  // Bounds for the price range slider (and its paired number
  // inputs). There's no backend endpoint for the real catalog min/
  // max, so this is a fixed, generous ceiling rather than derived
  // data.
  priceSlider: {
    min: 0,
    max: 100000,
    step: 100,
  },

};


/*
 * Category checkboxes are data-driven from productsState.categoryOptions
 * (real backend subCategory values — see fetchCategoryFacets in
 * api.js), never a hardcoded list. Values may not be known yet when
 * this first renders, hence the empty-state fallback.
 */
function createCategoryOptionsMarkup() {

  if (!productsState.categoryOptions.length) {

    return `
<p
  class="
    text-sm
    text-[#999]
  "
>
  No categories available.
</p>
`;

  }


  return productsState.categoryOptions
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

    value="${escapeHtml(category)}"

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
    ${escapeHtml(category)}
  </span>

</label>

`
    )
    .join("");
}


function applyCategoryChecks() {

  document
    .querySelectorAll(
      '[data-filter="category"]'
    )
    .forEach(
      (input) => {

        input.checked =
          productsState.filters.categories.some(
            (selected) =>
              normalizeForComparison(selected) ===
              normalizeForComparison(input.value)
          );

      }
    );
}


// Re-renders just the category checkbox group once
// fetchCategoryFacets() resolves, and re-applies any already
// selected category filter (e.g. restored from the URL) against
// the now-available options.
export function renderCategoryOptions() {

  const target =
    document.getElementById(
      "productsCategoryOptions"
    );


  if (!target) return;


  target.innerHTML =
    createCategoryOptionsMarkup();


  applyCategoryChecks();
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


    <div
      id="productsCategoryOptions"
      class="space-y-4"
    >

      ${createCategoryOptionsMarkup()}

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


    <div class="flex items-center gap-3">

      <input
        id="priceMinInput"
        type="number"

        data-filter="price"

        min="0"
        inputmode="numeric"

        placeholder="0"

        class="
          w-full
          min-w-0

          rounded-lg
          border
          border-[#ECE6DF]

          px-3
          py-2

          text-sm
          text-[#181818]

          focus:outline-none
          focus:border-[#A07936]
        "
      >

      <span class="text-[#999]">-</span>

      <input
        id="priceMaxInput"
        type="number"

        data-filter="price"

        min="0"
        inputmode="numeric"

        placeholder="${PRODUCT_FILTERS.priceSlider.max}"

        class="
          w-full
          min-w-0

          rounded-lg
          border
          border-[#ECE6DF]

          px-3
          py-2

          text-sm
          text-[#181818]

          focus:outline-none
          focus:border-[#A07936]
        "
      >

    </div>


    <div class="price-range-slider mt-6 mb-3">

      <div class="price-range-track"></div>

      <div
        id="priceRangeFill"
        class="price-range-fill"
      ></div>

      <input
        id="priceMinRange"
        type="range"

        data-filter="price"

        min="${PRODUCT_FILTERS.priceSlider.min}"
        max="${PRODUCT_FILTERS.priceSlider.max}"
        step="${PRODUCT_FILTERS.priceSlider.step}"

        value="${PRODUCT_FILTERS.priceSlider.min}"
      >

      <input
        id="priceMaxRange"
        type="range"

        data-filter="price"

        min="${PRODUCT_FILTERS.priceSlider.min}"
        max="${PRODUCT_FILTERS.priceSlider.max}"
        step="${PRODUCT_FILTERS.priceSlider.step}"

        value="${PRODUCT_FILTERS.priceSlider.max}"
      >

    </div>


    <div class="flex items-center justify-between text-[13px] text-[#999]">

      <span id="priceMinLabel">₹0</span>

      <span id="priceMaxLabel">₹${PRODUCT_FILTERS.priceSlider.max.toLocaleString("en-IN")}</span>

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


// Keeps the filled bar between the two thumbs, and the ₹ labels
// beneath the slider, in sync with whatever the current min/max
// range input values are — used both on drag and on restore.
function refreshPriceRangeUI() {

  const minRange =
    document.getElementById("priceMinRange");

  const maxRange =
    document.getElementById("priceMaxRange");

  const minInput =
    document.getElementById("priceMinInput");

  const maxInput =
    document.getElementById("priceMaxInput");

  const fill =
    document.getElementById("priceRangeFill");

  const minLabel =
    document.getElementById("priceMinLabel");

  const maxLabel =
    document.getElementById("priceMaxLabel");


  if (!minRange || !maxRange) return;


  const {
    min: sliderMin,
    max: sliderMax,
  } = PRODUCT_FILTERS.priceSlider;

  const span = sliderMax - sliderMin;

  const minValue = Number(minRange.value);
  const maxValue = Number(maxRange.value);


  if (fill) {

    const leftPct =
      ((minValue - sliderMin) / span) * 100;

    const rightPct =
      ((maxValue - sliderMin) / span) * 100;

    fill.style.left = `${leftPct}%`;
    fill.style.width = `${Math.max(rightPct - leftPct, 0)}%`;

  }


  if (minInput) minInput.value = minValue;
  if (maxInput) maxInput.value = maxValue;


  if (minLabel) {
    minLabel.textContent =
      `₹${minValue.toLocaleString("en-IN")}`;
  }

  if (maxLabel) {
    maxLabel.textContent =
      `₹${maxValue.toLocaleString("en-IN")}`;
  }

}


// Number inputs and the two range thumbs all represent the same
// min/max pair, so any of them can drive it. This normalizes a
// candidate (min, max) against the slider bounds and each other,
// applies it to every control, then repaints the fill/labels.
function applyPriceValues(min, max) {

  const minRange =
    document.getElementById("priceMinRange");

  const maxRange =
    document.getElementById("priceMaxRange");


  if (!minRange || !maxRange) return;


  const {
    min: sliderMin,
    max: sliderMax,
  } = PRODUCT_FILTERS.priceSlider;


  let nextMin =
    Number.isFinite(min) ? min : sliderMin;

  let nextMax =
    Number.isFinite(max) ? max : sliderMax;


  nextMin = Math.min(Math.max(nextMin, sliderMin), sliderMax);
  nextMax = Math.min(Math.max(nextMax, sliderMin), sliderMax);


  if (nextMin > nextMax) {
    [nextMin, nextMax] = [nextMax, nextMin];
  }


  minRange.value = nextMin;
  maxRange.value = nextMax;


  refreshPriceRangeUI();
}


function initPriceSliderEvents() {

  const minRange =
    document.getElementById("priceMinRange");

  const maxRange =
    document.getElementById("priceMaxRange");

  const minInput =
    document.getElementById("priceMinInput");

  const maxInput =
    document.getElementById("priceMaxInput");


  // Live drag feedback only — the delegated "change" handler below
  // commits the filter (and re-fetches) once the thumb is released.
  minRange?.addEventListener("input", () => {

    if (Number(minRange.value) > Number(maxRange.value)) {
      minRange.value = maxRange.value;
    }

    refreshPriceRangeUI();

  });

  maxRange?.addEventListener("input", () => {

    if (Number(maxRange.value) < Number(minRange.value)) {
      maxRange.value = minRange.value;
    }

    refreshPriceRangeUI();

  });


  minInput?.addEventListener("input", () => {

    applyPriceValues(
      Number(minInput.value),
      Number(maxRange?.value)
    );

  });

  maxInput?.addEventListener("input", () => {

    applyPriceValues(
      Number(minRange?.value),
      maxInput.value === ""
        ? PRODUCT_FILTERS.priceSlider.max
        : Number(maxInput.value)
    );

  });


  // These inputs sit outside a <form>, so Enter has no default
  // submit/commit behavior — blur explicitly to fire "change".
  [minInput, maxInput].forEach(
    (input) => {

      input?.addEventListener(
        "keydown",
        (event) => {

          if (event.key === "Enter") {
            input.blur();
          }

        }
      );

    }
  );

}


export function initFilterEvents(
  onChange
) {

  const container =
    document.getElementById(
      "productsFilters"
    );


  initPriceSliderEvents();


  // Delegated so the category group can be re-rendered later
  // (once fetchCategoryFacets() resolves) without losing its
  // change handling.
  container?.addEventListener(
    "change",
    async (event) => {

      if (!event.target.matches("[data-filter]")) {
        return;
      }


      productsState.filters.categories =
        [
          ...document.querySelectorAll(
            '[data-filter="category"]:checked'
          ),
        ].map(
          (input) =>
            input.value
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


      const minInputEl =
        document.getElementById(
          "priceMinInput"
        );

      const maxInputEl =
        document.getElementById(
          "priceMaxInput"
        );

      const {
        min: sliderMin,
        max: sliderMax,
      } = PRODUCT_FILTERS.priceSlider;

      const minValue =
        minInputEl && minInputEl.value !== ""
          ? Number(minInputEl.value)
          : sliderMin;

      const maxValue =
        maxInputEl && maxInputEl.value !== ""
          ? Number(maxInputEl.value)
          : sliderMax;

      // The full slider range means "no filter" — only send a price
      // filter once the user has actually narrowed it down.
      productsState.filters.price =
        minValue <= sliderMin &&
        maxValue >= sliderMax
          ? null
          : {
              min: minValue,
              max: maxValue,
            };


      productsState.page = 1;


      updateProductsURL();


      await onChange();

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


        applyPriceValues(
          PRODUCT_FILTERS.priceSlider.min,
          PRODUCT_FILTERS.priceSlider.max
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

  applyCategoryChecks();


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


  const price =
    productsState.filters.price;

  applyPriceValues(
    price?.min ?? PRODUCT_FILTERS.priceSlider.min,
    price?.max ?? PRODUCT_FILTERS.priceSlider.max
  );
}
