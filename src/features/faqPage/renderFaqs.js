import {
  websiteService,
} from "../../services/websiteService.js";

import {
  createFaqCard,
} from "../../components/faq/faqCard.js";


let faqData = [];


// ==========================================
// SKELETON / LOADING STATE
// ==========================================

function createFaqSkeletonCard() {

  return `
    <div
      class="
        animate-pulse
        overflow-hidden
        rounded-3xl
        border
        border-[#E8E2DA]
        bg-white
        px-8
        py-7
      "
    >

      <div class="h-5 w-3/4 rounded bg-[#ECE7E1]"></div>

    </div>
  `;

}

function renderFaqSkeleton(container) {

  container.innerHTML =
    Array.from(
      { length: 6 },
      createFaqSkeletonCard
    ).join("");

}


// ==========================================
// EMPTY / ERROR STATE
// ==========================================

function renderFaqMessage(message) {

  return `
    <div
      class="
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


export async function renderFaqs() {

  const container =
    document.getElementById(
      "faqContainer"
    );


  if (!container) {
    return;
  }


  // Show a loading state immediately so the
  // FAQ list is never blank while the API
  // call is in flight.
  renderFaqSkeleton(container);


  try {

    faqData =
      await websiteService.getFAQs();


    if (!faqData.length) {

      container.innerHTML = renderFaqMessage(
        "No FAQs available at the moment."
      );

      return;
    }


    container.innerHTML =
      faqData
        .map(createFaqCard)
        .join("");


  } catch (error) {

    console.error(
      "[FAQ] Failed to load FAQs:",
      error
    );


    container.innerHTML = renderFaqMessage(
      "We couldn't load our FAQs right now. Please try again shortly."
    );

  }

}


export function getFAQData() {
  return faqData;
}
