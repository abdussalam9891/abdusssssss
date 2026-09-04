import { productsState } from "./state.js";
import { updateProductsURL } from "./query.js";
import { escapeHtml } from "../../utils/format.js";
import { normalizeForComparison } from "../../utils/categoryMatch.js";


const PRODUCT_FILTERS = {

  /*
   * The catalog has no `badge`/`tag` field — the backend never
   * sends one, and `?badge=...` is ignored. "New Arrivals" is the
   * one collection real product data can back, derived from
   * `createdAt` (see isNewArrival in pipeline.js), which is also
   * what finally makes the existing `?tag=new` links across the
   * navbar, hero and footer filter anything.
   *
   * Bestseller/Limited were dropped rather than faked: nothing in
   * the product payload distinguishes them.
   */
  collections: [
    {
      value: "NEW",
      label: "New Arrivals",
    },
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

<!--
  One panel, two layouts: below lg it is a slide-in drawer over the
  grid (the filters used to be plain "hidden lg:block", so on a
  phone there was no way to reach them at all), from lg up it is
  the same static sidebar as before. Deliberately NOT duplicated
  per breakpoint, so every element id below — and the single
  handler bound to it — stays unique.
-->

<!--
  z-index: above the fixed site header (z-100) and the floating
  customize/WhatsApp buttons (z-90/85), which would otherwise
  paint on top of the open drawer, but below the nav drawer
  (z-999), search overlay (z-1000) and the modals (z-200).
-->

<div
  id="mobileFiltersOverlay"

  class="
    fixed
    inset-0

    z-[140]

    hidden

    bg-black/50

    lg:hidden
  "
></div>


<div
  id="mobileFiltersDrawer"

  role="dialog"
  aria-modal="true"
  aria-label="Product filters"

  class="
    fixed
    inset-y-0
    right-0

    z-[150]

    w-[88%]
    max-w-[380px]

    translate-x-full

    overflow-y-auto
    overscroll-contain

    bg-white

    shadow-2xl

    transition-transform
    duration-300
    ease-out

    lg:static
    lg:z-auto

    lg:w-auto
    lg:max-w-none

    lg:translate-x-0

    lg:overflow-visible

    lg:bg-transparent
    lg:shadow-none

    lg:transition-none
  "
>

<aside
  id="productsFilters"

  class="
    lg:sticky
    lg:top-28

    min-h-full
    lg:min-h-0
    lg:h-fit

    lg:rounded-2xl

    lg:border
    lg:border-[#ECE6DF]

    bg-white

    p-6
    lg:p-7
  "
>

  <div
    class="
      flex
      items-center
      justify-between

      gap-4
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


    <button
      id="closeMobileFilters"

      type="button"

      aria-label="Close filters"

      class="
        inline-flex
        lg:hidden

        h-9
        w-9

        shrink-0

        items-center
        justify-center

        rounded-full

        border
        border-[#ECE6DF]

        text-[#181818]
      "
    >
      <i
        data-lucide="x"
        class="h-4 w-4"
      ></i>
    </button>

  </div>


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

        aria-label="Minimum price"

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

        aria-label="Maximum price"

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

        aria-label="Minimum price slider"

        min="${PRODUCT_FILTERS.priceSlider.min}"
        max="${PRODUCT_FILTERS.priceSlider.max}"
        step="${PRODUCT_FILTERS.priceSlider.step}"

        value="${PRODUCT_FILTERS.priceSlider.min}"
      >

      <input
        id="priceMaxRange"
        type="range"

        data-filter="price"

        aria-label="Maximum price slider"

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

      ${PRODUCT_FILTERS.collections
        .map(
          (collection) => `

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

    value="${collection.value}"

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
    ${collection.label}
  </span>

</label>

`
        )
        .join("")}

    </div>

  </div>


  <div
    class="
      mt-10

      flex
      gap-3
    "
  >

    <button
      id="clearFilters"

      type="button"

      class="
        flex-1

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


    <!--
      Filters already apply as they change; this only dismisses the
      drawer so the results underneath become visible.
    -->
    <button
      id="applyMobileFilters"

      type="button"

      class="
        flex-1
        lg:hidden

        rounded-lg

        bg-[#181818]

        px-5
        py-3

        text-sm
        text-white
      "
    >
      Show Results
    </button>

  </div>

</aside>

</div>

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


  // The drawer's close control is a lucide <i> placeholder.
  window.lucide?.createIcons();
}


// ==========================================
// MOBILE DRAWER
// ==========================================

// Matches Tailwind's `lg` breakpoint, which is what switches the
// panel between drawer and sidebar in the markup above.
const DESKTOP_BREAKPOINT = 1024;


export function openMobileFilters() {

  const drawer =
    document.getElementById(
      "mobileFiltersDrawer"
    );


  if (!drawer) return;


  drawer.classList.remove(
    "translate-x-full"
  );


  document
    .getElementById(
      "mobileFiltersOverlay"
    )
    ?.classList.remove(
      "hidden"
    );


  // Stops the product grid behind the drawer from scrolling along
  // with the touch gesture.
  document.body.style.overflow =
    "hidden";


  document
    .getElementById(
      "mobileFilterButton"
    )
    ?.setAttribute(
      "aria-expanded",
      "true"
    );
}


export function closeMobileFilters() {

  document
    .getElementById(
      "mobileFiltersDrawer"
    )
    ?.classList.add(
      "translate-x-full"
    );


  document
    .getElementById(
      "mobileFiltersOverlay"
    )
    ?.classList.add(
      "hidden"
    );


  document.body.style.overflow =
    "";


  document
    .getElementById(
      "mobileFilterButton"
    )
    ?.setAttribute(
      "aria-expanded",
      "false"
    );
}


function initMobileFiltersEvents() {

  [
    "closeMobileFilters",
    "applyMobileFilters",
    "mobileFiltersOverlay",
  ].forEach(
    (id) => {

      document
        .getElementById(id)
        ?.addEventListener(
          "click",
          closeMobileFilters
        );

    }
  );


  document.addEventListener(
    "keydown",
    (event) => {

      if (event.key === "Escape") {
        closeMobileFilters();
      }

    }
  );


  // Rotating to landscape / resizing past the breakpoint turns the
  // drawer back into the static sidebar. The body scroll lock must
  // not survive that, or the page stays unscrollable on desktop.
  window.addEventListener(
    "resize",
    () => {

      if (
        window.innerWidth >= DESKTOP_BREAKPOINT
      ) {
        closeMobileFilters();
      }

    }
  );
}


// Keeps the filled bar between the two thumbs, and the ₹ labels
// beneath the slider, in sync with whatever the current min/max
// range input values are — used both on drag and on restore.
//
// `sourceInput` is the number field the user is typing into, if
// any: rewriting its value mid-keystroke fights the caret (typing
// "500" turned into "5" then "50", cursor jumping to the end), so
// it is left alone until the value is committed.
function refreshPriceRangeUI(sourceInput) {

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


  if (minInput && minInput !== sourceInput) {
    minInput.value = minValue;
  }

  if (maxInput && maxInput !== sourceInput) {
    maxInput.value = maxValue;
  }


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
function applyPriceValues(min, max, sourceInput) {

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


  // Reorder only once the value is committed — swapping the two
  // fields while the user is still typing into one of them makes
  // the number jump around under the caret.
  if (
    nextMin > nextMax &&
    !sourceInput
  ) {
    [nextMin, nextMax] = [nextMax, nextMin];
  }


  minRange.value = nextMin;
  maxRange.value = nextMax;


  refreshPriceRangeUI(sourceInput);
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
  // commits the filter (and re-renders) once the thumb is released.
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
      minInput.value === ""
        ? PRODUCT_FILTERS.priceSlider.min
        : Number(minInput.value),
      Number(maxRange?.value),
      minInput
    );

  });

  maxInput?.addEventListener("input", () => {

    applyPriceValues(
      Number(minRange?.value),
      maxInput.value === ""
        ? PRODUCT_FILTERS.priceSlider.max
        : Number(maxInput.value),
      maxInput
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

  initMobileFiltersEvents();


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


      const {
        min: sliderMin,
        max: sliderMax,
      } = PRODUCT_FILTERS.priceSlider;


      const minInputEl =
        document.getElementById(
          "priceMinInput"
        );

      const maxInputEl =
        document.getElementById(
          "priceMaxInput"
        );


      // Re-normalize now that the value is committed: this is where
      // a min/max typed the wrong way round gets swapped, and where
      // a cleared field falls back to its slider bound.
      applyPriceValues(
        minInputEl && minInputEl.value !== ""
          ? Number(minInputEl.value)
          : sliderMin,
        maxInputEl && maxInputEl.value !== ""
          ? Number(maxInputEl.value)
          : sliderMax
      );


      const minValue =
        Number(
          document.getElementById("priceMinRange")?.value
        );

      const maxValue =
        Number(
          document.getElementById("priceMaxRange")?.value
        );


      // The full slider range means "no filter" — only apply a
      // price filter once the user has actually narrowed it down.
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

        // Scoped to checkboxes so the price number/range inputs
        // aren't given a bogus `checked` flag; they're reset by
        // applyPriceValues below.
        document
          .querySelectorAll(
            '#productsFilters input[type="checkbox"]'
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
          occasions: [],
          recipients: [],
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
