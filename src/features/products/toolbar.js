import { productsState } from "./state.js";
import { updateProductsURL } from "./query.js";
import { openMobileFilters } from "./filters.js";


// Number of filter groups currently narrowing the results, shown
// on the mobile "Filters" button — the sidebar itself is off-screen
// there, so without this there is no sign that a filter is active.
function countActiveFilters() {

  const {
    categories,
    badges,
    price,
  } = productsState.filters;


  return (
    categories.length +
    badges.length +
    (price ? 1 : 0)
  );
}


export function createProductsToolbar() {

  return `

<section
  class="
    border-b
    border-[#F1ECE6]
    bg-white
  "
>

  <div
    class="
      mx-auto
      max-w-[1600px]

      px-4
      sm:px-6
      lg:px-8
      xl:px-10

      py-6
    "
  >

    <div
      class="
        flex
        flex-col

        gap-5

        lg:flex-row
        lg:items-center
        lg:justify-between
      "
    >

      <div
        class="
          inline-flex
          items-center
          gap-3

          self-start

          lg:px-5
          py-2.5
        "
      >

        <p
          class="
            text-sm
            text-[#666]
          "
        >

          Showing

          <strong
            id="toolbarProductsCount"

            class="
              mx-1
              font-semibold
              text-[#181818]
            "
          >
            0
          </strong>

          Products

        </p>

      </div>


      <div
        class="
          flex
          items-center

          gap-3
        "
      >

        <button
          id="mobileFilterButton"

          type="button"

          aria-controls="mobileFiltersDrawer"
          aria-expanded="false"

          class="
            inline-flex
            lg:hidden

            shrink-0

            items-center
            justify-center

            gap-2

            h-11

            rounded-full

            border
            border-[#E7DDD3]

            bg-white

            px-5

            text-sm
          "
        >

          <i
            data-lucide="sliders-horizontal"
            class="h-4 w-4"
          ></i>

          Filters

          <span
            id="mobileFilterCount"

            class="
              hidden

              h-5
              min-w-5

              items-center
              justify-center

              rounded-full

              bg-[#A07936]

              px-1.5

              text-[11px]
              font-semibold
              text-white
            "
          ></span>

        </button>


        <div
          class="
            flex
            flex-1
            lg:flex-none

            items-center
            gap-3
          "
        >

          <span
            class="
              hidden
              lg:block

              text-sm
              text-[#777]
            "
          >
            Sort by
          </span>


          <select
            id="productsSort"

            aria-label="Sort products"

            class="
              h-11

              w-full
              lg:w-auto
              lg:min-w-[220px]

              rounded-full

              border
              border-[#E7DDD3]

              bg-white

              px-5

              text-[15px]

              text-[#181818]

              outline-none

              focus:border-[#A07936]
            "
          >

            <option value="featured">
              Featured
            </option>

            <option value="price-low">
              Price: Low to High
            </option>

            <option value="price-high">
              Price: High to Low
            </option>

            <option value="rating">
              Highest Rated
            </option>

            <option value="newest">
              Newest
            </option>

          </select>

        </div>

      </div>

    </div>

  </div>

</section>

`;
}


export function renderProductsToolbar() {

  const container =
    document.getElementById(
      "productsToolbar"
    );


  if (!container) return;


  // Rendered once, then only its values are updated — re-writing
  // the markup would drop the listeners bound in initToolbarEvents.
  if (
    !container.innerHTML.trim()
  ) {

    container.innerHTML =
      createProductsToolbar();


    window.lucide?.createIcons();

  }


  const count =
    document.getElementById(
      "toolbarProductsCount"
    );


  if (count) {

    count.textContent =
      productsState.total;

  }


  const sort =
    document.getElementById(
      "productsSort"
    );


  if (sort) {

    sort.value =
      productsState.sort;

  }


  const filterCount =
    document.getElementById(
      "mobileFilterCount"
    );


  if (filterCount) {

    const active =
      countActiveFilters();


    filterCount.textContent =
      active;


    filterCount.classList.toggle(
      "hidden",
      active === 0
    );

    filterCount.classList.toggle(
      "inline-flex",
      active > 0
    );

  }
}


export function initToolbarEvents(
  onSort
) {

  document
    .getElementById(
      "productsSort"
    )
    ?.addEventListener(
      "change",
      async (event) => {

        productsState.sort =
          event.target.value;


        productsState.page = 1;


        updateProductsURL();


        await onSort();

      }
    );


  document
    .getElementById(
      "mobileFilterButton"
    )
    ?.addEventListener(
      "click",
      openMobileFilters
    );
}
