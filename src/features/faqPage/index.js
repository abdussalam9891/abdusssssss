import {
  renderFaqs,
} from "./renderFaqs.js";

import {
  initAccordion,
} from "./accordion.js";

import {
  initCategoryFilter,
} from "./filter.js";


export async function initFAQ() {

  try {

    // ==============================
    // LOAD FAQ FROM BACKEND
    // ==============================

    await renderFaqs();


    // ==============================
    // INITIAL ACCORDION
    // ==============================

    initAccordion();


    // ==============================
    // CATEGORY FILTER
    // ==============================

    initCategoryFilter();


  } catch (error) {

    console.error(
      "[initFAQ] Failed:",
      error
    );

  }

}
