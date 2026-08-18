import { createNavbar }
  from "../../components/navbar/navbar.js";

import { initAnnouncementBar }
  from "../announcement/index.js";

import { initScroll }
  from "./scroll.js";

import { initActiveLink }
  from "./activeLink.js";

import { initMobileDrawer }
  from "./mobileDrawer.js";

import { initSearchOverlay }
  from "./searchOverlay.js";

import { initAccountDropdown }
  from "../accountDropdown/index.js";

import { getCurrentUser }
  from "../auth/authState.js";


export function initNavbar() {

  const container =
    document.getElementById("navbar-container");


  if (!container) {

    console.warn(
      "[Navbar] #navbar-container not found."
    );

    return;

  }


  const theme =
    container.dataset.theme || "light";


  const showAnnouncement =
    container.dataset.announcement !== "false";


  // =========================================
  // CURRENT USER
  // =========================================

  const user =
    getCurrentUser();


  // =========================================
  // RENDER NAVBAR
  // =========================================

  container.innerHTML =
    createNavbar(
      theme,
      user,
      {
        showAnnouncement,
      }
    );


  // =========================================
  // ANNOUNCEMENT
  // =========================================

  if (showAnnouncement) {

    const announcement =
      container.querySelector(
        "#navbar-announcement"
      );


    if (announcement) {

      initAnnouncementBar(
        announcement
      ).catch((error) => {

        console.error(
          "[Navbar Announcement] Failed to initialize:",
          error
        );

      });

    }

  }


  // =========================================
  // LUCIDE ICONS
  // =========================================

  window.lucide?.createIcons();


  // =========================================
  // NAVBAR FEATURES
  // =========================================

  initScroll();

  initActiveLink();

  initMobileDrawer();

  initSearchOverlay();

  initAccountDropdown();

}
