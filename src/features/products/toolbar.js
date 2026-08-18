import { productsState } from "./state.js";
import { updateProductsURL } from "./query.js";


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

          px-5
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
          flex-col

          gap-3

          sm:flex-row
          sm:items-center
        "
      >

        <button
          id="mobileFilterButton"

          type="button"

          class="
            inline-flex
            lg:hidden

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

          Filters

        </button>


        <div
          class="
            flex
            items-center
            gap-3
          "
        >

          <span
            class="
              hidden
              sm:block

              text-sm
              text-[#777]
            "
          >
            Sort by
          </span>


          <select
            id="productsSort"

            class="
              h-11

              min-w-[220px]

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


  if (
    !container.innerHTML.trim()
  ) {

    container.innerHTML =
      createProductsToolbar();

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
}


export function initToolbarEvents(
  onSort
) {

  const sort =
    document.getElementById(
      "productsSort"
    );


  sort?.addEventListener(
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
      () => {

        document
          .getElementById(
            "mobileFiltersDrawer"
          )
          ?.classList.remove(
            "translate-x-full"
          );


        document
          .getElementById(
            "mobileFiltersOverlay"
          )
          ?.classList.remove(
            "hidden"
          );

      }
    );
}
