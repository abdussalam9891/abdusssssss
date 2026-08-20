import { reviewService } from "../../services/reviewService.js";
import { productState } from "./state.js";
import { requireAuth } from "../auth/authGuard.js";
import { showToast } from "../../utils/toast.js";

import {
  escapeHtml,
} from "./model.js";

import {
  createStars,
  createReviewsSummary,
} from "../../components/productDetails/reviewsSection.js";


function getReviewerName(review) {

  return (
    review?.userId?.name ||
    review?.userId?.email?.split("@")[0] ||
    review?.user?.name ||
    review?.user?.email?.split("@")[0] ||
    review?.name ||
    "Anonymous"
  );
}


function getReviewDate(review) {

  if (!review?.createdAt) return "Recent";

  try {

    return new Date(review.createdAt)
      .toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

  } catch {

    return "Recent";
  }
}


function createReviewCard(review) {

  const text =
    review?.reviewText ||
    review?.comment ||
    "";

  return `

<div
  class="
    rounded-2xl

    border
    border-[#ECE5D8]

    bg-white

    p-5

    text-left
  "
>

  ${createStars(Number(review?.rating) || 0, "h-4 w-4")}

  <p
    class="
      mt-3

      text-[14px]

      leading-6

      text-[#555]
    "
  >
    &ldquo;${escapeHtml(text)}&rdquo;
  </p>

  <div
    class="
      mt-4

      flex

      items-center

      justify-between

      border-t
      border-[#F2ECE3]

      pt-3
    "
  >

    <span
      class="
        text-[13px]

        font-medium

        text-[#181818]
      "
    >
      ${escapeHtml(getReviewerName(review))}
    </span>

    <span class="text-[12px] text-[#B0AA9D]">
      ${escapeHtml(getReviewDate(review))}
    </span>

  </div>

</div>

`;
}


function renderReviewList(container, reviews) {

  if (!reviews.length) {

    container.innerHTML = `
<p
  class="
    col-span-full

    text-[14px]

    text-[#8A8A8A]
  "
>
  No reviews yet — be the first to share your experience.
</p>
`;

    return;
  }


  container.innerHTML =
    reviews
      .map((review) => createReviewCard(review))
      .join("");

}


async function loadReviews(productId) {

  const listContainer =
    document.getElementById("productReviewsList");

  const summaryContainer =
    document.getElementById("productReviewsSummary");

  if (!listContainer) return;


  const [reviewsResult, summaryResult] =
    await Promise.allSettled([
      reviewService.getProductReviews(productId),
      reviewService.getRatingSummary(productId),
    ]);


  if (reviewsResult.status === "fulfilled") {

    renderReviewList(
      listContainer,
      reviewsResult.value
    );

  } else {

    console.error(
      "[Product Details] Failed to load reviews:",
      reviewsResult.reason
    );

  }


  if (
    summaryResult.status === "fulfilled" &&
    summaryContainer
  ) {

    summaryContainer.innerHTML =
      createReviewsSummary({
        name: productState.product?.name || "",
        averageRating: summaryResult.value.averageRating,
        totalReviews: summaryResult.value.totalReviews,
      });

  } else if (summaryResult.status === "rejected") {

    console.error(
      "[Product Details] Failed to load rating summary:",
      summaryResult.reason
    );

  }

}


function getModalElements() {

  return {
    modal: document.getElementById("reviewModal"),
    panel: document.getElementById("reviewModalPanel"),
  };
}


function openModal() {

  const { modal, panel } = getModalElements();

  if (!modal || !panel) return;


  modal.classList.remove("hidden");
  modal.classList.add("flex");

  requestAnimationFrame(() => {

    panel.classList.remove(
      "opacity-0",
      "scale-95"
    );

  });

  document.documentElement.classList.add(
    "overflow-hidden"
  );

}


function closeModal() {

  const { modal, panel } = getModalElements();

  if (!modal || !panel) return;


  panel.classList.add(
    "opacity-0",
    "scale-95"
  );

  document.documentElement.classList.remove(
    "overflow-hidden"
  );

  setTimeout(() => {

    modal.classList.remove("flex");
    modal.classList.add("hidden");

  }, 300);

}


export function initReviews() {

  const productId =
    productState.product?.id;

  if (!productId) return;


  loadReviews(productId).catch((error) => {

    console.error(
      "[Product Details] Reviews failed to load:",
      error
    );

  });


  const writeButton =
    document.getElementById("productWriteReviewButton");

  const form =
    document.getElementById("reviewForm");

  const starInput =
    document.getElementById("reviewStarInput");

  const textInput =
    document.getElementById("reviewTextInput");

  const errorMessage =
    document.getElementById("reviewFormError");

  const submitButton =
    document.getElementById("submitReviewButton");

  const overlay =
    document.getElementById("reviewModalOverlay");

  const closeButton =
    document.getElementById("closeReviewModal");

  const cancelButton =
    document.getElementById("cancelReviewModal");

  if (
    !writeButton ||
    !form ||
    !starInput ||
    !textInput
  ) return;


  let selectedRating = 0;


  function setRating(rating) {

    selectedRating = rating;

    starInput
      .querySelectorAll("[data-review-star]")
      .forEach((star) => {

        const active =
          Number(star.dataset.reviewStar) <= rating;

        star.classList.toggle(
          "text-[#C89B3C]",
          active
        );

        star.classList.toggle(
          "text-[#DCD5C7]",
          !active
        );

      });

  }


  function resetForm() {

    setRating(0);

    textInput.value = "";

    errorMessage?.classList.add("hidden");

  }


  writeButton.addEventListener("click", () => {

    requireAuth(() => {

      resetForm();

      openModal();

    }, "review");

  });


  starInput
    .querySelectorAll("[data-review-star]")
    .forEach((star) => {

      star.addEventListener("click", () => {

        setRating(
          Number(star.dataset.reviewStar)
        );

      });

    });


  overlay?.addEventListener("click", closeModal);
  closeButton?.addEventListener("click", closeModal);
  cancelButton?.addEventListener("click", closeModal);


  form.addEventListener("submit", async (event) => {

    event.preventDefault();


    const reviewText =
      textInput.value.trim();


    if (!selectedRating || !reviewText) {

      if (errorMessage) {

        errorMessage.textContent =
          "Please select a rating and write a review.";

        errorMessage.classList.remove("hidden");

      }

      return;
    }


    if (errorMessage) {
      errorMessage.classList.add("hidden");
    }

    if (submitButton) {
      submitButton.disabled = true;
    }


    try {

      await reviewService.createReview({
        productId,
        rating: selectedRating,
        reviewText,
      });

      showToast({
        type: "success",
        title: "Review Submitted",
        message: "Thank you for sharing your feedback!",
      });

      closeModal();

      await loadReviews(productId);

    } catch (error) {

      console.error(
        "[Product Details] Failed to submit review:",
        error
      );

      if (errorMessage) {

        errorMessage.textContent =
          error?.message ||
          "Please login to submit a review.";

        errorMessage.classList.remove("hidden");

      }

    } finally {

      if (submitButton) {
        submitButton.disabled = false;
      }

    }

  });

}
