import { renderShowcase } from "./renderShowcase.js";

let activeTab = "trending";

export function initShowcaseTabs() {
  const tabsContainer =
    document.getElementById("showcaseTabs");

  const productsContainer =
    document.getElementById("showcaseProducts");

  if (!tabsContainer || !productsContainer) return;

  tabsContainer.addEventListener("click", (event) => {

    const button =
      event.target.closest("[data-tab]");

    if (!button) return;

    const selectedTab =
      button.dataset.tab;

    if (selectedTab === activeTab) return;

    activeTab = selectedTab;

    // Reset all tabs

    tabsContainer
      .querySelectorAll(".showcase-tab")
      .forEach((tab) => {

        tab.classList.remove(
          "text-ink"
        );

        tab.classList.add(
          "text-[#8A8A8A]"
        );

        const underline =
          tab.querySelector("span");

        if (underline) {

          underline.classList.remove(
            "w-full",
            "opacity-100"
          );

          underline.classList.add(
            "w-0",
            "opacity-0"
          );

        }

      });

    // Active tab

    button.classList.remove(
      "text-[#8A8A8A]"
    );

    button.classList.add(
      "text-ink"
    );

    const activeUnderline =
      button.querySelector("span");

    if (activeUnderline) {

      activeUnderline.classList.remove(
        "w-0",
        "opacity-0"
      );

      activeUnderline.classList.add(
        "w-full",
        "opacity-100"
      );

    }

    // Fade products

    productsContainer.classList.add(
      "opacity-0"
    );

    setTimeout(() => {

      renderShowcase(activeTab);

      requestAnimationFrame(() => {

        productsContainer.scrollLeft = 0;

        productsContainer.dispatchEvent(
          new Event("scroll")
        );

        productsContainer.classList.remove(
          "opacity-0"
        );

      });

    }, 180);

  });

}
