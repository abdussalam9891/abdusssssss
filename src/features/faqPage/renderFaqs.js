import {
  websiteService,
} from "../../services/websiteService.js";

import {
  createFaqCard,
} from "../../components/faq/faqCard.js";


let faqData = [];


export async function renderFaqs() {

  const container =
    document.getElementById(
      "faqContainer"
    );


  if (!container) {
    return;
  }


  try {

    faqData =
      await websiteService.getFAQs();


    if (!faqData.length) {

      container.innerHTML = `
        <p class="text-center text-[#777777]">
          No FAQs available at the moment.
        </p>
      `;

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


    container.innerHTML = `
      <p class="text-center text-red-600">
        Unable to load FAQs.
        Please try again later.
      </p>
    `;

  }

}


export function getFAQData() {
  return faqData;
}
