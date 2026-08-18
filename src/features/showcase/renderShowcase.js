import { SHOWCASE_TABS } from "../../constants/showcaseProducts.js";
import { createShowcaseCard } from "../../components/showcase/showcaseCard.js";
import { productService } from "../../services/productService.js";

let products = [];

export async function loadShowcaseProducts() {
  try {
    const response =
      await productService.getPublicProducts();

    products = response?.data?.products || [];

    return products;
  } catch (error) {
    console.error(
      "Failed to load showcase products:",
      error
    );

    products = [];

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

  const filteredProducts =
    products.filter(selectedTab.filter);

  container.innerHTML =
    filteredProducts.length
      ? filteredProducts
          .map((product) =>
            createShowcaseCard(product)
          )
          .join("")
      : `
        <p class="text-center text-[#777777] py-10 w-full">
          No products in this collection yet.
        </p>
      `;

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
