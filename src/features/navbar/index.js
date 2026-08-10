import { createNavbar } from "../../components/navbar/navbar.js";

import { initScroll } from "./scroll.js";
import { initActiveLink } from "./activeLink.js";
import { initMobileDrawer } from "./mobileDrawer.js";
import { initSearchOverlay } from "./searchOverlay.js";

import { initAccountDropdown } from "../accountDropdown/index.js";


import { getCurrentUser } from "../auth/authState.js";


export function initNavbar() {
  const container = document.getElementById("navbar-container");

  if (!container) {
    console.warn("[Navbar] #navbar-container not found.");
    return;
  }

  const theme =
    container.dataset.theme || "light";

  const showAnnouncement =
    container.dataset.announcement !== "false";

  // Get current authenticated user
  const user = getCurrentUser();

  container.innerHTML = createNavbar(
    theme,
    user,
    {
      showAnnouncement,
    }
  );

  // Render Lucide icons
  window.lucide?.createIcons();

  // Initialize navbar features
  initScroll();
  initActiveLink();
  initMobileDrawer();
  initSearchOverlay();
  initAccountDropdown();
}
