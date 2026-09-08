import {
  initFAQ,
} from "../features/faqPage/faqPageInit.js";


export async function loadFAQPage() {

  const container =
    document.getElementById(
      "faqContainer"
    );


  if (!container) {
    return;
  }


  try {

    await initFAQ();

  } catch (err) {

    console.error(
      "[loadFAQPage] initFAQ failed:",
      err
    );

  }

}
