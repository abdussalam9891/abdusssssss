import {
  createFaqCard,
} from "../../components/faq/faqCard.js";

import {
  getFAQData,
} from "./renderFaqs.js";

import {
  initAccordion,
} from "./accordion.js";


export function initCategoryFilter() {

  const buttons =
    document.querySelectorAll(
      ".faq-filter"
    );

  const container =
    document.getElementById(
      "faqContainer"
    );


  if (
    !buttons.length ||
    !container
  ) {
    return;
  }


  buttons.forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          const category =
            button.dataset.category;


          const faqs =
            getFAQData();


          const filteredFAQs =
            category === "all"
              ? faqs
              : faqs.filter(
                  faq =>
                    faq.category ===
                    category
                );


          container.innerHTML =
            filteredFAQs
              .map(createFaqCard)
              .join("");


          initAccordion();


          // ==============================
          // ACTIVE FILTER UI
          // ==============================

          buttons.forEach(
            (item) => {

              item.classList.remove(
                "border-ink",
                "bg-ink",
                "text-white"
              );

              item.classList.add(
                "border-[#E8E2DA]",
                "bg-white",
                "text-[#555]"
              );

            }
          );


          button.classList.remove(
            "border-[#E8E2DA]",
            "bg-white",
            "text-[#555]"
          );

          button.classList.add(
            "border-ink",
            "bg-ink",
            "text-white"
          );

        }
      );

    }
  );

}
