import { escapeHtml } from "../../utils/format.js";
import { icon } from "../../utils/icon.js";


const NAV_ITEMS = [
  { tab: "overview", label: "Overview", icon: "layout-grid" },
  { tab: "info", label: "My Profile", icon: "user-round" },
  { tab: "addresses", label: "Addresses", icon: "map-pin" },
  { tab: "orders", label: "My Orders", icon: "package" },
];


function navLinkClasses(isActive) {

  return isActive
    ? `
      flex
      items-center
      gap-3
      rounded-2xl
      bg-ink
      px-5
      py-3.5
      text-[14px]
      font-medium
      text-white
      transition-colors
      duration-300
    `
    : `
      flex
      items-center
      gap-3
      rounded-2xl
      px-5
      py-3.5
      text-[14px]
      text-[#55514B]
      transition-colors
      duration-300
      hover:bg-[#FAF7F1]
      hover:text-primary
    `;
}


function externalLinkClasses() {

  return `
    flex
    items-center
    gap-3
    rounded-2xl
    px-5
    py-3.5
    text-[14px]
    text-[#55514B]
    transition-colors
    duration-300
    hover:bg-[#FAF7F1]
    hover:text-primary
  `;
}


export function createProfileSidebar(user, activeTab = "overview") {

  const fullName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    user?.fullName ||
    user?.name ||
    "My Account";

  const initial =
    fullName.charAt(0).toUpperCase();

  return `

<div
  class="
    overflow-hidden
    rounded-[28px]
    border
    border-[#F3EEE6]
    bg-white
  "
>

  <!-- USER HEADER -->

  <div
    class="
      flex
      items-center
      gap-4

      px-5
      py-6
    "
  >

    <div
      class="
        flex
        h-12
        w-12
        shrink-0
        items-center
        justify-center
        rounded-full
        bg-[#FAF7F1]
        text-[18px]
        font-medium
        text-primary
      "
    >
      ${escapeHtml(initial)}
    </div>

    <div class="min-w-0">

      <p
        class="
          text-[11px]
          uppercase
          tracking-[0.2em]
          text-primary
        "
      >
        Welcome Back
      </p>

      <h3
        class="
          mt-1
          truncate
          text-[16px]
          font-medium
          text-ink
        "
      >
        ${escapeHtml(fullName)}
      </h3>

    </div>

  </div>


  <div class="mx-5 h-px bg-[#F3EEE6]"></div>


  <!-- TABS -->

  <nav
    id="profileSidebarNav"

    class="
      space-y-1

      p-3
    "
  >

    ${NAV_ITEMS.map(
      (item) => `
      <a
        href="#"
        data-tab="${item.tab}"
        class="profile-nav-link ${navLinkClasses(item.tab === activeTab)}"
      >
        ${icon(item.icon, "h-[17px] w-[17px]")}
        <span>${item.label}</span>
      </a>
    `
    ).join("")}

  </nav>


  <div class="mx-5 h-px bg-[#F3EEE6]"></div>


  <!-- SITE LINKS -->

  <div class="space-y-1 p-3">

    <a
      href="/pages/wishlist.html"
      class="${externalLinkClasses()}"
    >
      ${icon("heart", "h-[17px] w-[17px]")}
      <span>Wishlist</span>
    </a>

    <a
      href="/pages/cart.html"
      class="${externalLinkClasses()}"
    >
      ${icon("shopping-bag", "h-[17px] w-[17px]")}
      <span>Shopping Cart</span>
    </a>

  </div>


  <div class="mx-5 h-px bg-[#F3EEE6]"></div>


  <!-- LOGOUT -->

  <div class="p-5">

    <button
      id="profileLogoutButton"
      type="button"

      class="
        group
        flex
        w-full
        items-center
        justify-center
        gap-2
        rounded-full
        border
        border-[#E8E1D8]
        py-2.5
        text-[13px]
        font-medium
        text-[#6D6861]
        transition-all
        duration-300
        hover:border-ink
        hover:bg-ink
        hover:text-white
      "
    >
      ${icon("log-out", "h-[15px] w-[15px]")}
      Sign Out
    </button>

  </div>

</div>

`;
}
