import { isAuthPage } from "../../utils/isAuthPage.js";

const SCROLL_THRESHOLD = 400;

function createScrollToTopButton() {
  return `
<button
  id="scrollToTopButton"
  type="button"

  aria-label="Scroll to top"
  title="Scroll to top"

  class="
    fixed
    bottom-24
    right-5

    z-[85]

    hidden
    lg:flex

    h-12
    w-12

    items-center
    justify-center

    rounded-full

    bg-ink

    text-white

    opacity-0
    pointer-events-none
    translate-y-2

    shadow-[0_10px_30px_rgba(0,0,0,0.3)]

    transition-all
    duration-300

    hover:scale-110
    hover:bg-primary

    focus-visible:outline
    focus-visible:outline-2
    focus-visible:outline-offset-2
    focus-visible:outline-primary
  "
>

  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    class="h-5 w-5"
  >
    <path d="M12 19V5" />
    <path d="M5 12l7-7 7 7" />
  </svg>

</button>
`;
}

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
