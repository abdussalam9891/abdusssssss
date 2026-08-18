import {
  createShowcaseCard,
} from "../../components/showcase/showcaseCard.js";

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
