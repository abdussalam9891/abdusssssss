import {
  createShowcaseCard,
} from "../../features/showcase/showcaseCard.js";

import { productsState } from "./state.js";

import {
  createProductGridSkeleton,
  createFetchErrorState,
  setSkeletonBusy,
} from "../../components/skeleton/skeleton.js";


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

      text-ink
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


  setSkeletonBusy(container, true);

  container.innerHTML =
    createProductGridSkeleton({
      count: productsState.limit || 12,
      label: "Loading products",
    });
}


// `onRetry` re-runs the same load that just failed. Owned by the
// caller (productsInit.js) so this module doesn't need to know how
// products are fetched.
export function renderProductsError(onRetry) {

  const container =
    document.getElementById(
      "productsGrid"
    );


  if (!container) return;


  setSkeletonBusy(container, false);

  const retryId = "productsGridRetry";

  container.innerHTML =
    createFetchErrorState({
      message:
        "Unable to load products right now. Please try again.",
      retryId,
    });

  if (typeof onRetry === "function") {

    document
      .getElementById(retryId)
      ?.addEventListener(
        "click",
        onRetry,
        { once: true }
      );

  }
}


export function renderProductsGrid() {

  const container =
    document.getElementById(
      "productsGrid"
    );


  if (!container) return;


  setSkeletonBusy(container, false);


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
