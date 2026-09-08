function renderAnswer(answer = "") {

  return String(answer)
    .split("\n")
    .map(
      line => line.trim()
    )
    .filter(Boolean)
    .map(
      line => {

        if (
          line.startsWith("•")
        ) {

          return `
            <li>
              ${line.replace(
                /^•\s*/,
                ""
              )}
            </li>
          `;

        }


        return `
          <p class="leading-8 text-[#666]">
            ${line}
          </p>
        `;

      }
    )
    .join("");

}


export function createFaqCard(faq) {

  const answer =
    renderAnswer(
      faq.answer
    );


  return `
    <div
      class="
        faq-item
        group
        overflow-hidden
        rounded-3xl
        border
        border-[#E8E2DA]
        bg-white
        transition-all
        duration-300
        ease-out
        hover:-translate-y-1
        hover:border-[#D9C7A3]
        hover:shadow-[0_20px_45px_-15px_rgba(160,121,54,0.35)]
      "
      data-category="${faq.category}"
    >

      <button
        type="button"
        class="
          faq-toggle
          flex
          w-full
          items-center
          justify-between
          gap-6
          px-8
          py-7
          text-left
        "
      >

        <div>

          <h3
            class="
              text-xl
              font-medium
              text-[#181818]
              transition-colors
              duration-300
              group-hover:text-[#A07936]
            "
          >
            ${faq.question}
          </h3>

        </div>


        <svg
          class="
            faq-icon
            h-6
            w-6
            shrink-0
            text-[#A07936]
            transition-transform
            duration-300
            group-hover:scale-110
          "
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >

          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.8"
            d="M12 5v14m7-7H5"
          />

        </svg>

      </button>


      <div
        class="
          faq-content
          hidden
          border-t
          border-[#ECE7E1]
          px-8
          py-6
        "
      >

        <div
          class="
            space-y-3
            leading-8
            text-[#666]
          "
        >

          ${answer}

        </div>

      </div>

    </div>
  `;
}
