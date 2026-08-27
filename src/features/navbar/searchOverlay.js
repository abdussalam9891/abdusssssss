import { productService } from "../../services/productService.js";

import {
  formatPrice,
  getProductDetailsHref,
  escapeHtml,
} from "../../utils/format.js";


let isOpen = false;

const SEARCH_DEBOUNCE_MS = 350;
const MIN_QUERY_LENGTH = 2;
const RESULTS_LIMIT = 6;


function getResultImage(product) {
  const images = Array.isArray(product.images)
    ? product.images
    : [];

  return (
    images.find((image) => image?.url)?.url ||
    "/assets/images/placeholder.webp"
  );
}


function getResultCategory(product) {
  const subCategory = Array.isArray(product.subCategory)
    ? product.subCategory[0]
    : product.subCategory;

  const childCategory = Array.isArray(product.childCategory)
    ? product.childCategory[0]
    : product.childCategory;

  return subCategory || childCategory || "Jewellery";
}


function createSearchResultItem(product) {
  const price = Number(
    product.finalPrice || product.price || 0
  );

  const originalPrice = Number(product.price || 0);

  const name = escapeHtml(
    product.name || "Untitled Product"
  );

  return `
<a
  href="${getProductDetailsHref(product._id, product.slug)}"
  class="group flex flex-col"
>

  <div
    class="
      relative

      aspect-square

      overflow-hidden

      rounded-2xl

      border
      border-[#F2ECE3]

      bg-[#FAF8F4]

      transition-all
      duration-300

      group-hover:border-[#D6B170]
    "
  >
    <img
      src="${getResultImage(product)}"
      alt="${name}"
      loading="lazy"
      onerror="this.onerror=null;this.src='/assets/images/placeholder.webp';"
      class="
        h-full
        w-full

        object-cover

        transition-transform
        duration-500

        group-hover:scale-105
      "
    />
  </div>

  <div class="mt-3">

    <p
      class="
        truncate

        font-serif

        text-[15px]

        text-[#181818]

        transition-colors
        duration-300

        group-hover:text-[#A07936]
      "
    >
      ${name}
    </p>

    <p
      class="
        mt-0.5

        truncate

        text-[11px]
        uppercase
        tracking-[0.12em]

        text-[#9A9184]
      "
    >
      ${escapeHtml(getResultCategory(product))}
    </p>

    <div class="mt-1.5 flex items-center gap-2">

      <span class="text-sm font-semibold text-[#181818]">
        ${formatPrice(price)}
      </span>

      ${
        originalPrice > price
          ? `<span class="text-xs text-[#B9B2A6] line-through">${formatPrice(
              originalPrice
            )}</span>`
          : ""
      }

    </div>

  </div>

</a>
`;
}


export function initSearchOverlay() {
  const overlay = document.getElementById("searchOverlay");
  const backdrop = document.getElementById("searchBackdrop");
  const modal = document.getElementById("searchModal");

  const openBtn = document.getElementById("searchBtn");
  const closeBtn = document.getElementById("closeSearchBtn");
  const input = document.getElementById("searchInput");
  const resultsContainer = document.getElementById("searchResults");

  const popularButtons = document.querySelectorAll(
    ".popular-search-btn"
  );

  if (
    !overlay ||
    !backdrop ||
    !modal ||
    !openBtn ||
    !closeBtn ||
    !input ||
    !resultsContainer
  ) {
    return;
  }


  // =========================================
  // LIVE SEARCH
  // =========================================

  const defaultResultsHTML =
    resultsContainer.innerHTML;

  let debounceTimer = null;
  let requestId = 0;

  function renderLoading() {
    resultsContainer.innerHTML = `
<div class="flex justify-center py-16">
  <span
    class="
      h-9
      w-9

      animate-spin

      rounded-full

      border-2
      border-[#F2ECE3]
      border-t-[#A07936]
    "
  ></span>
</div>
`;
  }

  function renderEmptyQuery() {
    resultsContainer.innerHTML = defaultResultsHTML;
    window.lucide?.createIcons();
  }

  function renderNoResults(query) {
    resultsContainer.innerHTML = `
<div class="py-16 text-center">

  <div
    class="
      mx-auto
      mb-5

      flex
      h-16
      w-16

      items-center
      justify-center

      rounded-full

      bg-[#FBF4E7]
    "
  >
    <i
      data-lucide="search-x"
      class="h-7 w-7 text-[#A07936]"
    ></i>
  </div>

  <h4 class="mb-2 font-serif text-xl text-[#181818]">
    No results found
  </h4>

  <p class="text-sm text-[#8A8A8A]">
    We couldn't find anything for
    "<span class="text-[#181818]">${escapeHtml(query)}</span>".
    Try a different keyword.
  </p>

</div>
`;

    window.lucide?.createIcons();
  }

  function renderError() {
    resultsContainer.innerHTML = `
<div class="py-16 text-center">

  <div
    class="
      mx-auto
      mb-5

      flex
      h-16
      w-16

      items-center
      justify-center

      rounded-full

      bg-[#FBF4E7]
    "
  >
    <i
      data-lucide="triangle-alert"
      class="h-7 w-7 text-[#A07936]"
    ></i>
  </div>

  <p class="text-sm text-[#8A8A8A]">
    Something went wrong while searching.
    Please try again.
  </p>

</div>
`;

    window.lucide?.createIcons();
  }

  function renderResults(products, total, query) {
    resultsContainer.innerHTML = `
<p class="mb-5 text-[11px] uppercase tracking-[0.25em] text-[#9A9184]">
  ${total} ${total === 1 ? "Result" : "Results"}
</p>

<div
  class="
    grid
    grid-cols-2
    sm:grid-cols-3

    gap-x-5
    gap-y-8
  "
>
  ${products.map(createSearchResultItem).join("")}
</div>

${
  total > products.length
    ? `
<div class="mt-10 flex justify-center">
  <a
    href="/pages/products.html?search=${encodeURIComponent(query)}"
    class="
      inline-flex
      items-center
      gap-2

      rounded-full

      bg-[#181818]

      px-7
      py-3

      text-[12px]
      font-medium
      uppercase
      tracking-[0.18em]

      text-white

      transition-colors
      duration-300

      hover:bg-[#A07936]
    "
  >
    View all ${total} results
    <i data-lucide="arrow-right" class="h-3.5 w-3.5"></i>
  </a>
</div>
`
    : ""
}
`;

    window.lucide?.createIcons();
  }

  async function runSearch(query) {
    const currentRequestId = ++requestId;

    renderLoading();

    try {

      const response =
        await productService.getPublicProducts({
          search: query,
          limit: RESULTS_LIMIT,
          page: 1,
        });

      if (currentRequestId !== requestId) return;

      const products =
        response?.data?.products || [];

      const total =
        Number(response?.data?.total) ||
        products.length;

      if (!products.length) {
        renderNoResults(query);
        return;
      }

      renderResults(products, total, query);

    } catch (error) {

      if (currentRequestId !== requestId) return;

      console.error(
        "[Search] Failed to fetch results:",
        error
      );

      renderError();
    }
  }

  input.addEventListener("input", () => {
    const query = input.value.trim();

    clearTimeout(debounceTimer);

    if (!query || query.length < MIN_QUERY_LENGTH) {
      requestId++;
      renderEmptyQuery();
      return;
    }

    debounceTimer = setTimeout(
      () => runSearch(query),
      SEARCH_DEBOUNCE_MS
    );
  });

  input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;

    const query = input.value.trim();

    if (!query) return;

    window.location.href =
      `/pages/products.html?search=${encodeURIComponent(query)}`;
  });

  popularButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const href = button.dataset.href;

      if (href) {
        window.location.href = href;
      }
    });
  });

  function openSearch() {
    if (isOpen) return;

    isOpen = true;

    overlay.classList.remove("hidden");

    document.body.classList.add("overflow-hidden");

    requestAnimationFrame(() => {
      backdrop.classList.remove("opacity-0");
      backdrop.classList.add("opacity-100");

      modal.classList.remove(
        "opacity-0",
        "-translate-y-full"
      );

      modal.classList.add(
        "opacity-100",
        "translate-y-0"
      );

      input.focus();
    });
  }

  function closeSearch() {
    if (!isOpen) return;

    isOpen = false;

    backdrop.classList.remove("opacity-100");
    backdrop.classList.add("opacity-0");

    modal.classList.remove(
      "opacity-100",
      "translate-y-0"
    );

    modal.classList.add(
      "opacity-0",
      "-translate-y-full"
    );

    document.body.classList.remove("overflow-hidden");

    modal.addEventListener(
      "transitionend",
      () => {
        if (!isOpen) {
          overlay.classList.add("hidden");
        }
      },
      { once: true }
    );

    clearTimeout(debounceTimer);
    requestId++;
    input.value = "";
    renderEmptyQuery();
  }

  openBtn.addEventListener("click", openSearch);

  closeBtn.addEventListener("click", closeSearch);

  backdrop.addEventListener("click", closeSearch);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSearch();
    }
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSearch();
    }
  });
}
