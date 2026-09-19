export function initAccordion() {
  const container = document.getElementById("faqContainer");

  if (!container) return;

  const items = container.querySelectorAll(".faq-item");

  items.forEach((item) => {
    const button = item.querySelector(".faq-toggle");
    const content = item.querySelector(".faq-content");
    const icon = item.querySelector(".faq-icon");

    button.addEventListener("click", () => {
      const isOpen = !content.classList.contains("hidden");

      // Close all
      items.forEach((faq) => {
        faq.querySelector(".faq-content").classList.add("hidden");
        faq.querySelector(".faq-icon").classList.remove("rotate-45");
        faq.classList.remove(
          "border-primary",
          "shadow-xl"
        );
      });

      if (isOpen) return;

      // Open selected
      content.classList.remove("hidden");
      icon.classList.add("rotate-45");

      item.classList.add(
        "border-primary",
        "shadow-xl"
      );
    });
  });
}
