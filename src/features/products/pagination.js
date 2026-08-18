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

  data-page="${page - 1}"

  ${page <= 1 ? "disabled" : ""}

  class="
    h-10
    min-w-10

    rounded-full

    border
    border-[#E7DDD3]

    px-4

    text-sm

    transition

    disabled:cursor-not-allowed
    disabled:opacity-40

    hover:border-[#A07936]
    hover:text-[#A07936]
  "
>
  ←
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

  data-page="${page + 1}"

  ${page >= totalPages ? "disabled" : ""}

  class="
    h-10
    min-w-10

    rounded-full

    border
    border-[#E7DDD3]

    px-4

    text-sm

    transition

    disabled:cursor-not-allowed
    disabled:opacity-40

    hover:border-[#A07936]
    hover:text-[#A07936]
  "
>
  →
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
