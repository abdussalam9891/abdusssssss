import { createShowcaseCard } from "../showcase/showcaseCard.js";
import { productService } from "../../services/productService.js";
import { isActiveProduct } from "../../utils/productStatus.js";

const MAX_PRODUCTS = 10;

// The catalog has no real "units sold" figure (see
// features/products/pipeline.js), so rating and review count —
// both real, backend-reported fields — are the most honest proxy
// for "best seller" available: highest-rated first, and among
// equal ratings, the more-reviewed product is the safer bet.
function byRatingThenReviews(a, b) {
  const ratingDelta =
    (Number(b?.averageRating) || 0) -
    (Number(a?.averageRating) || 0);

  if (ratingDelta !== 0) return ratingDelta;

  return (
    (Number(b?.totalReviews) || 0) -
    (Number(a?.totalReviews) || 0)
  );
}

function createBestSellersSkeletonCard() {
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

export function renderBestSellersSkeleton() {
  const container =
    document.getElementById("bestSellersProducts");

  if (!container) return;

  container.innerHTML =
    Array.from({ length: 4 }, createBestSellersSkeletonCard)
      .join("");
}

function renderBestSellersMessage(message) {
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
      <p class="text-ink font-medium">
        ${message}
      </p>
    </div>
  `;
}

export async function loadAndRenderBestSellers() {
  const container =
    document.getElementById("bestSellersProducts");

  if (!container) return;

  try {
    const response =
      await productService.getPublicProducts();

    const products =
      response?.data?.products || [];

    // No `totalReviews > 0` gate here: every product starts at 0
    // reviews, and gating on it would leave this section empty
    // until the first review comes in. Sorting is stable, so with
    // no reviews yet this just keeps the backend's own order (same
    // as Showcase's "Trending" tab) — real ratings take over
    // automatically as reviews arrive, with no code change needed.
    const topProducts = products
      .filter(isActiveProduct)
      .sort(byRatingThenReviews)
      .slice(0, MAX_PRODUCTS);

    container.innerHTML =
      topProducts.length
        ? topProducts
            .map((product) => createShowcaseCard(product))
            .join("")
        : renderBestSellersMessage(
            "No best sellers to show just yet."
          );

  } catch (error) {

    console.error(
      "Failed to load best sellers:",
      error
    );

    container.innerHTML = renderBestSellersMessage(
      "We couldn't load our best sellers right now. Please try again shortly."
    );

  }

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
