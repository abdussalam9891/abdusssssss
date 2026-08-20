import { createScrollToTopButton } from "../../components/scrollToTop/index.js";
import { isAuthPage } from "../../utils/isAuthPage.js";

const SCROLL_THRESHOLD = 400;

export function initScrollToTopButton() {
  if (isAuthPage()) {
    return;
  }

  if (document.getElementById("scrollToTopButton")) {
    return;
  }

  document.body.insertAdjacentHTML(
    "beforeend",
    createScrollToTopButton()
  );

  const button = document.getElementById("scrollToTopButton");

  let ticking = false;

  function updateVisibility() {
    const visible = window.scrollY > SCROLL_THRESHOLD;

    button.classList.toggle("opacity-0", !visible);
    button.classList.toggle("pointer-events-none", !visible);
    button.classList.toggle("translate-y-2", !visible);

    ticking = false;
  }

  function handleScroll() {
    if (!ticking) {
      requestAnimationFrame(updateVisibility);
      ticking = true;
    }
  }

  window.addEventListener("scroll", handleScroll, {
    passive: true,
  });

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  updateVisibility();
}
