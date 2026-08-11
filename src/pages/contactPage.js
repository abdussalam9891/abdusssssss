export function initFAQ() {
  const faqItems = document.querySelectorAll(".faq-item");

  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    const icon = item.querySelector(".faq-icon");

    if (!question || !answer || !icon) return;

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      faqItems.forEach((otherItem) => {
        if (otherItem === item) return;

        otherItem.classList.remove("is-open");

        otherItem
          .querySelector(".faq-answer")
          ?.classList.replace(
            "grid-rows-[1fr]",
            "grid-rows-[0fr]"
          );

        otherItem
          .querySelector(".faq-answer")
          ?.classList.replace(
            "opacity-100",
            "opacity-0"
          );

        otherItem
          .querySelector(".faq-icon")
          ?.classList.remove(
            "bg-[#A07936]",
            "border-[#A07936]",
            "text-white"
          );

        otherItem
          .querySelector(".faq-icon")
          ?.classList.add(
            "border-[#E5DED5]",
            "text-[#181818]"
          );

        otherItem
          .querySelector(".faq-icon svg")
          ?.classList.remove("rotate-45");
      });

      if (isOpen) {
        item.classList.remove("is-open");

        answer.classList.replace(
          "grid-rows-[1fr]",
          "grid-rows-[0fr]"
        );

        answer.classList.replace(
          "opacity-100",
          "opacity-0"
        );

        icon.classList.remove(
          "bg-[#A07936]",
          "border-[#A07936]",
          "text-white"
        );

        icon.classList.add(
          "border-[#E5DED5]",
          "text-[#181818]"
        );

        icon
          .querySelector("svg")
          ?.classList.remove("rotate-45");

      } else {
        item.classList.add("is-open");

        answer.classList.replace(
          "grid-rows-[0fr]",
          "grid-rows-[1fr]"
        );

        answer.classList.replace(
          "opacity-0",
          "opacity-100"
        );

        icon.classList.remove(
          "border-[#E5DED5]",
          "text-[#181818]"
        );

        icon.classList.add(
          "bg-[#A07936]",
          "border-[#A07936]",
          "text-white"
        );

        icon
          .querySelector("svg")
          ?.classList.add("rotate-45");
      }
    });
  });
}



initFAQ();
