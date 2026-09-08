import { createDesktopNav } from "./desktopNav.js";
import { createMobileNav } from "./mobileNav.js";
import { createSearchOverlay } from "./renderSearchOverlay.js";
 


export function createNavbar(
  theme = "light",
  user = null,
  {
    showAnnouncement = true,
  } = {}
) {

  return `
    <header
      id="siteHeader"
      data-theme="${theme}"

      class="
        fixed
        inset-x-0
        top-0
        z-[100]
        bg-transparent
        transition-all
        duration-500
      "
    >

      ${
        showAnnouncement
          ? `<div id="navbar-announcement"></div>`
          : ""
      }

      ${createDesktopNav(theme, user)}

      ${createMobileNav(theme)}

      ${createSearchOverlay()}

    </header>
  `;
}
