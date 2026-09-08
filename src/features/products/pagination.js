import { productsState } from "./state.js";


export function renderProductsPagination(
  onPageChange
) {

  const container =
    document.getElementById(
      "productsPagination"
    );


  if (!container) return;


  const {
    page,
    totalPages,
  } =
    productsState;


  if (
    totalPages <= 1
  ) {

    container.innerHTML =
      "";

    return;
  }


  let html = `

<div
  class="
    flex
    items-center
    justify-center

    gap-2

    mt-12
  "
>

`;


  // Previous

  html += `

<button
  type="button"

  aria-label="Previous page"

  data-page="${page - 1}"

  ${page <= 1 ? "disabled" : ""}

  class="
    flex
    items-center
    justify-center

    h-10
    w-10
    shrink-0

    rounded-full

    border
    border-[#E7DDD3]

    text-[#181818]

    transition

    disabled:cursor-not-allowed
    disabled:opacity-40
    disabled:hover:border-[#E7DDD3]
    disabled:hover:text-[#181818]

    hover:border-[#A07936]
    hover:text-[#A07936]
  "
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="h-4 w-4"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
</button>

`;


  // Pages

  for (
    let i = 1;
    i <= totalPages;
    i++
  ) {

    html += `

<button
  type="button"

  data-page="${i}"

  class="
    h-10
    min-w-10

    rounded-full

    border

    px-3

    text-sm

    transition

    ${
      i === page
        ? "border-[#A07936] bg-[#A07936] text-white"
        : "border-[#E7DDD3] text-[#181818] hover:border-[#A07936] hover:text-[#A07936]"
    }
  "
>
  ${i}
</button>

`;

  }


  // Next

  html += `

<button
  type="button"

  aria-label="Next page"

  data-page="${page + 1}"

  ${page >= totalPages ? "disabled" : ""}

  class="
    flex
    items-center
    justify-center

    h-10
    w-10
    shrink-0

    rounded-full

    border
    border-[#E7DDD3]

    text-[#181818]

    transition

    disabled:cursor-not-allowed
    disabled:opacity-40
    disabled:hover:border-[#E7DDD3]
    disabled:hover:text-[#181818]

    hover:border-[#A07936]
    hover:text-[#A07936]
  "
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="h-4 w-4"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
</button>

`;


  html += `</div>`;


  container.innerHTML =
    html;


  container
    .querySelectorAll(
      "[data-page]"
    )
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            const targetPage =
              Number(
                button.dataset.page
              );


            if (
              targetPage < 1 ||
              targetPage > totalPages
            ) {
              return;
            }


            onPageChange(
              targetPage
            );

          }
        );

      }
    );
}
