import { SHOWCASE_TABS } from "../../constants/showcaseProducts.js";
import { createShowcaseCard } from "./showcaseCard.js";
import { productService } from "../../services/productService.js";
import { isActiveProduct } from "../../utils/productStatus.js";
import {
  createProductCarouselSkeleton,
  createFetchErrorState,
  setSkeletonBusy,
} from "../../components/skeleton/skeleton.js";

let products = [];
let loadFailed = false;

// ==========================================
// SKELETON / LOADING STATE
// ==========================================

export function renderShowcaseSkeleton() {
  const container =
    document.getElementById("showcaseProducts");

  if (!container) return;

  setSkeletonBusy(container, true);

  container.innerHTML =
    createProductCarouselSkeleton({ count: 4 });
}

// ==========================================
// EMPTY / ERROR STATE
// ==========================================

function renderShowcaseMessage(message, { retryable = false } = {}) {
  return createFetchErrorState({
    message,
    retryId: retryable ? "showcaseRetry" : "",
  });
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

// Retries the fetch from scratch (skeleton -> load -> render) rather
// than just re-rendering, since a failed load left `products` empty.
async function retryShowcase(activeTab) {

  renderShowcaseSkeleton();

  await loadShowcaseProducts();

  renderShowcase(activeTab);
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

  setSkeletonBusy(container, false);

  if (loadFailed) {
    container.innerHTML = renderShowcaseMessage(
      "We couldn't load our showcase right now. Please try again shortly.",
      { retryable: true }
    );

    document
      .getElementById("showcaseRetry")
      ?.addEventListener(
        "click",
        () => retryShowcase(activeTab),
        { once: true }
      );

    return;
  }

  // Every tab draws from the same unfiltered fetch, so the
  // published-only check has to live here rather than per-tab —
  // each tab's `select` only picks/orders which of the active
  // products it shows (see constants/showcaseProducts.js).
  const filteredProducts =
    selectedTab.select(
      products.filter(isActiveProduct)
    );

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
