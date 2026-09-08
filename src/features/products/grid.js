import {
  createShowcaseCard,
} from "../../features/showcase/showcaseCard.js";

import { productsState } from "./state.js";


function createEmptyState() {

  return `
<section
  class="
    py-20

    flex
    flex-col
    items-center
    justify-center

    text-center
  "
>

  <h2
    class="
      font-serif

      text-4xl

      text-[#181818]
    "
  >
    No Products Found
  </h2>


  <p
    class="
      mt-4

      max-w-md

      leading-7

      text-[#666]
    "
  >
    Try adjusting your filters or browse
    another collection.
  </p>

</section>
`;
}


export function renderProductsLoading() {

  const container =
    document.getElementById(
      "productsGrid"
    );


  if (!container) return;


  container.innerHTML = `
<div
  class="
    flex

    flex-col

    items-center

    gap-5

    py-24
  "
  role="status"
  aria-live="polite"
>

  <span
    class="
      h-10
      w-10

      animate-spin

      rounded-full

      border-2
      border-[#ECE5D8]
      border-t-[#A07936]
    "
  ></span>

  <p class="text-[#777]">
    Loading products…
  </p>

</div>
`;
}


export function renderProductsError() {

  const container =
    document.getElementById(
      "productsGrid"
    );


  if (!container) return;


  container.innerHTML = `
<p
  class="
    w-full

    py-24

    text-center

    text-red-600
  "
>
  Unable to load products.
  Please try again later.
</p>
`;
}


export function renderProductsGrid() {

  const container =
    document.getElementById(
      "productsGrid"
    );


  if (!container) return;


  if (
    !productsState.products.length
  ) {

    container.innerHTML =
      createEmptyState();

    return;
  }


  container.innerHTML = `

<div
  class="
    grid

    grid-cols-2

    gap-x-5
    gap-y-10

    md:grid-cols-3

    xl:grid-cols-4

    2xl:grid-cols-4
  "
>

  ${productsState.products
    .map(
      (product) =>
        createShowcaseCard(
          product,
          false
        )
    )
    .join("")}

</div>

`;


  window.lucide?.createIcons();
}
