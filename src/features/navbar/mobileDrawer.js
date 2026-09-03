import { logout } from "../../features/auth/authState.js";


const PANEL_OPEN = ["translate-x-0"];

const PANEL_CLOSE = ["-translate-x-full"];

const BACKDROP_VISIBLE = "opacity-100";
const BACKDROP_HIDDEN = "opacity-0";

let isOpen = false;

export function initMobileDrawer() {
  const drawer = document.getElementById("mobileDrawer");
  const panel = document.getElementById("mobilePanel");
  const backdrop = document.getElementById("mobileBackdrop");

  const openBtn = document.getElementById("menuBtn");
  const closeBtn = document.getElementById("closeDrawerBtn");

  if (
    !drawer ||
    !panel ||
    !backdrop ||
    !openBtn ||
    !closeBtn
  ) {
    return;
  }


  panel.addEventListener("click", async (event) => {
  const customizeTrigger = event.target.closest(
    ".js-open-customize-modal"
  );

  if (customizeTrigger) {
    closeDrawer();
  }

  const logoutBtn = event.target.closest("#mobileLogoutBtn");

  if (!logoutBtn) return;

  event.preventDefault();
  event.stopPropagation();

  logoutBtn.disabled = true;

  try {
    await logout();

    closeDrawer();

  } catch (error) {
    console.error("Mobile logout failed:", error);
  } finally {
    logoutBtn.disabled = false;
  }
});

  function openDrawer() {
    if (isOpen) return;

    isOpen = true;

    drawer.classList.remove("hidden");

    document.body.classList.add("overflow-hidden");

    requestAnimationFrame(() => {
      backdrop.classList.remove(BACKDROP_HIDDEN);
      backdrop.classList.add(BACKDROP_VISIBLE);

      panel.classList.remove(...PANEL_CLOSE);
      panel.classList.add(...PANEL_OPEN);
    });
  }

  function closeDrawer() {
    if (!isOpen) return;

    isOpen = false;

    backdrop.classList.remove(BACKDROP_VISIBLE);
    backdrop.classList.add(BACKDROP_HIDDEN);

    panel.classList.remove(...PANEL_OPEN);
    panel.classList.add(...PANEL_CLOSE);

    document.body.classList.remove("overflow-hidden");

    panel.addEventListener(
      "transitionend",
      () => {
        if (!isOpen) {
          drawer.classList.add("hidden");
        }
      },
      { once: true }
    );
  }

  openBtn.addEventListener("click", openDrawer);

  closeBtn.addEventListener("click", closeDrawer);

  backdrop.addEventListener("click", closeDrawer);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDrawer();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024 && isOpen) {
      closeDrawer();
    }
  });
}
