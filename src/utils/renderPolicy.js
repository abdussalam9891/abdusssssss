function escapeHTML(value = "") {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


function renderContent(content = "") {

  const lines =
    String(content)
      .split("\n")
      .map(line => line.trim())
      .filter(Boolean);


  let html = "";
  let listItems = [];


  const flushList = () => {

    if (!listItems.length) {
      return;
    }


    html += `
      <ul
        class="
          mt-6
          list-disc
          space-y-3
          pl-6
          leading-8
          text-[#555555]
        "
      >

        ${listItems
          .map(
            item => `
              <li>
                ${escapeHTML(item)}
              </li>
            `
          )
          .join("")}

      </ul>
    `;


    listItems = [];

  };


  lines.forEach(line => {

    if (
      line.startsWith("•") ||
      line.startsWith("-")
    ) {

      listItems.push(
        line.replace(/^[•-]\s*/, "")
      );

      return;

    }


    flushList();


    html += `
      <p
        class="
          mt-6
          leading-8
          text-[#555555]
        "
      >
        ${escapeHTML(line)}
      </p>
    `;

  });


  flushList();


  return html;

}


export function renderPolicySections(
  sections = {}
) {

  return Object.entries(sections)
    .map(
      ([heading, content]) => {

        return `
          <section>

            <h2
              class="
                font-serif
                text-3xl
                text-[#181818]
              "
            >
              ${escapeHTML(heading)}
            </h2>

            ${renderContent(content)}

          </section>
        `;

      }
    )
    .join("");

}
