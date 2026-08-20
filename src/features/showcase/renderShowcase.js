import { SHOWCASE_TABS } from "../../constants/showcaseProducts.js";
import { createShowcaseCard } from "../../components/showcase/showcaseCard.js";
import { productService } from "../../services/productService.js";

let products = [];
let loadFailed = false;

// ==========================================
// SKELETON / LOADING STATE
// ==========================================

function createShowcaseSkeletonCard() {
  return `
    <div
      class="
        animate-pulse

        flex-shrink-0

        w-[72%]
        sm:w-[48%]
        md:w-[34%]
        lg:w-[24%]
        xl:w-[21%]
      "
    >
      <div
        class="
          aspect-square
          lg:aspect-[1/1.02]

          rounded-2xl
          lg:rounded-[26px]

          border
          border-[#F2ECE3]

          bg-[#F5F1EA]
        "
      ></div>

      <div class="mt-4 h-5 w-3/4 rounded bg-[#F5F1EA]"></div>
      <div class="mt-3 h-6 w-1/3 rounded bg-[#F5F1EA]"></div>
    </div>
  `;
}

export function renderShowcaseSkeleton() {
  const container =
    document.getElementById("showcaseProducts");

  if (!container) return;

  container.innerHTML =
    Array.from({ length: 4 }, createShowcaseSkeletonCard)
      .join("");
}

// ==========================================
// EMPTY / ERROR STATE
// ==========================================

function renderShowcaseMessage(message) {
  return `
    <div
      class="
        w-full

        rounded-3xl
        border
        border-dashed
        border-[#E8E2DA]

        px-8
        py-14

        text-center
      "
    >
      <p class="text-[#181818] font-medium">
        ${message}
      </p>
    </div>
  `;
}

export async function loadShowcaseProducts() {
  try {
    const response =
      await productService.getPublicProducts();

    products = response?.data?.products || [];
    loadFailed = false;

    return products;
  } catch (error) {
    console.error(
      "Failed to load showcase products:",
      error
    );

    products = [];
    loadFailed = true;

    return [];
  }
}

export function renderShowcase(activeTab = "trending") {
  const container =
    document.getElementById("showcaseProducts");

  if (!container) return;

  const selectedTab =
    SHOWCASE_TABS.find(
      (tab) => tab.id === activeTab
    );

  if (!selectedTab) return;

  if (loadFailed) {
    container.innerHTML = renderShowcaseMessage(
      "We couldn't load our showcase right now. Please try again shortly."
    );

    return;
  }

  const filteredProducts =
    products.filter(selectedTab.filter);

  container.innerHTML =
    filteredProducts.length
      ? filteredProducts
          .map((product) =>
            createShowcaseCard(product)
          )
          .join("")
      : renderShowcaseMessage(
          "No products in this collection yet."
        );

  window.lucide?.createIcons();

  container
    .querySelectorAll(".reveal, .reveal-up")
    .forEach((el) => {
      el.classList.remove(
        "reveal",
        "reveal-up"
      );
    });
}
