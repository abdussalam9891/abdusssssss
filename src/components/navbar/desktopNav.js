import { NAVIGATION } from "../../constants/navigation.js";
import { icon } from "../../utils/icon.js";
import { createAccountDropdown } from "../accountDropdown/index.js";





export function createDesktopNav(
  theme = "light",
  user = null
) {



    const textColor =
    theme === "dark"
      ? "text-[#181818]"
      : "text-white";

  const navTextColor =
    theme === "dark"
      ? "text-[#181818]/90"
      : "text-white/90";

  // const hoverBg =
  //   theme === "dark"
  //     ? "hover:bg-black/5"
  //     : "hover:bg-white/5";




  const navLinks = NAVIGATION.map(
    (item) => `
      <li>
        <a
          href="${item.href}"
          data-nav="${item.slug}"
         class="
  relative
  py-2
  text-[13px]
  font-medium
  uppercase
  tracking-[0.18em]
  navbar-text
  ${navTextColor}
  transition-colors
  duration-300
  hover:text-[#A07936]

  after:absolute
  after:left-0
  after:bottom-0
  after:h-[2px]
  after:w-0
  after:bg-[#A07936]
  after:transition-all
  after:duration-300

  hover:after:w-full
"
        >
          ${item.label}
        </a>
      </li>
    `
  ).join("");

  return `
<nav
  id="navbar"
  class="
    h-20
    lg:h-24
    bg-transparent
    border-b
    border-transparent
    transition-all
    duration-500
  "
>
  <div
    class="
      mx-auto
      flex
      h-full
      max-w-7xl
      items-center
      justify-between
      px-5
      lg:px-8
    "
  >

    <!-- Mobile Menu Button -->

    <button
      id="menuBtn"
      type="button"
      aria-label="Open navigation menu"
      class="
        flex
        items-center
        justify-center
        navbar-text
        ${textColor}
        transition
        hover:text-[#A07936]
        lg:hidden
      "
    >
    <svg
      class="h-7 w-7"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="18" x2="12" y2="18"></line>
    </svg>
    </button>

    <!-- Logo -->

  <a
  href="/index.html"
  class="
    flex
    items-center
    shrink-0
    select-none
    navbar-text
    transition-opacity
    duration-300
    hover:opacity-80
  "
>
  <span
    id="navbarLogoWrap"
    class="
      block
      h-20
      w-20
      lg:h-32
      lg:w-32
      shrink-0
    "
  >
    <img
      id="navbarLogo"
      src="/src/assets/logo.png"
      alt="Banshiwale"
      class="
        h-full
        w-full
        object-contain
      "
    >
  </span>
</a>

    <!-- Desktop Navigation -->

    <ul
      class="
        hidden
        items-center
        gap-10
        lg:flex
      "
    >
      ${navLinks}
    </ul>

    <!-- Right Actions -->

    <div
      id="navbarActions"
      class="
        flex
        items-center
        gap-2
        lg:gap-3
      "
    >

          <!-- Search -->

      <button
        id="searchBtn"
        type="button"
        aria-label="Search"
        class="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-full
          navbar-text
          ${textColor}

          transition-all
          duration-300

          hover:text-[#A07936]
        "
      >
        ${icon("search")}
      </button>

      <!-- Wishlist -->

      <a
        href="/pages/wishlist.html"
        aria-label="Wishlist"
        class="
          relative
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-full
          navbar-text
          ${textColor}

          transition-all
          duration-300

          hover:text-[#A07936]
        "
      >
       ${icon("heart")}

        <span
          id="wishlistCount"
          class="
            hidden
            absolute
            -right-1
            -top-1
            flex
            h-5
            w-5
            items-center
            justify-center
            rounded-full
            bg-[#A07936]
            text-[10px]
            font-semibold
            text-black
          "
        >
          0
        </span>
      </a>

      <!-- Cart -->

      <a
        href="/pages/cart.html"
        aria-label="Shopping Cart"
        class="
          relative
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-full
          navbar-text
          ${textColor}

          transition-all
          duration-300

          hover:text-[#A07936]
        "
      >
        ${icon("shopping-bag")}

        <span
          id="cartCount"
          class="
            hidden
            absolute
            -right-1
            -top-1
            flex
            h-5
            w-5
            items-center
            justify-center
            rounded-full
            bg-[#A07936]
            text-[10px]
            font-semibold
            text-black
          "
        >
          0
        </span>

      </a>


     <!-- user -->

     <div
  id="accountWrapper"
  class="
    relative
    hidden
    lg:block
  "
>

  <button
    id="accountBtn"
    type="button"

    class="
      flex
      h-11
      w-11

      items-center
      justify-center

      rounded-full

      navbar-text
      ${textColor}


      transition-all
      duration-300

      hover:text-[#A07936]
    "
  >

    ${icon("user")}

  </button>

  ${createAccountDropdown(user)}

</div>

    </div>

  </div>

</nav>
`;
}
