import { createShowcaseCard } from "../showcase/showcaseCard.js";
import { productService } from "../../services/productService.js";
import { isActiveProduct } from "../../utils/productStatus.js";
import {
  createProductCarouselSkeleton,
  createFetchErrorState,
  setSkeletonBusy,
} from "../../components/skeleton/skeleton.js";

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

export function renderBestSellersSkeleton() {
  const container =
    document.getElementById("bestSellersProducts");

  if (!container) return;

  setSkeletonBusy(container, true);

  container.innerHTML =
    createProductCarouselSkeleton({ count: 4 });
}

function renderBestSellersMessage(message, { retryable = false } = {}) {
  return createFetchErrorState({
    message,
    retryId: retryable ? "bestSellersRetry" : "",
  });
}

export async function loadAndRenderBestSellers() {
  const container =
    document.getElementById("bestSellersProducts");

  if (!container) return;

  let failed = false;

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

    setSkeletonBusy(container, false);

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

    failed = true;

    setSkeletonBusy(container, false);

    container.innerHTML = renderBestSellersMessage(
      "We couldn't load our best sellers right now. Please try again shortly.",
      { retryable: true }
    );

  }

  if (failed) {

    document
      .getElementById("bestSellersRetry")
      ?.addEventListener(
        "click",
        () => {
          renderBestSellersSkeleton();
          loadAndRenderBestSellers();
        },
        { once: true }
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
