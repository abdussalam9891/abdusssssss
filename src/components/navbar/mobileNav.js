import { NAVIGATION } from "../../constants/navigation.js";
import {
  getCurrentUser
} from "../../features/auth/authState.js";
import { icon } from "../../utils/icon.js";


// ========================================
// Create Navigation Links
// ========================================

function createNavigationLinks() {
  return NAVIGATION.map(
    (item) => `
      <li>

        <a
          href="${item.href}"
          data-nav="${item.slug}"

          class="
            group

            flex
            items-center
            justify-between

            rounded-2xl

            px-5
            py-4

            text-sm
            font-medium
            uppercase
            tracking-[0.15em]

            text-white

            transition-all
            duration-300

            hover:bg-white/5
            hover:text-[#A07936]
          "
        >

          <span>
            ${item.label}
          </span>

          <span
            class="
              transition-transform
              duration-300

              group-hover:translate-x-1
            "
          >
            ${icon("chevron-right")}
          </span>

        </a>

      </li>
    `
  ).join("");
}


// ========================================
// Create Guest Account Section
// ========================================

function createGuestAccount() {
  return `
    <div
  data-mobile-account
  class="border-b border-white/10 px-4 py-5"
>

      <a
        href="/pages/login.html"

        class="
          group

          flex
          items-center

          gap-4

          rounded-2xl

          px-5
          py-4

          text-white

          transition-all
          duration-300

          hover:bg-white/5
          hover:text-[#A07936]
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

            bg-white/5

            transition-all
            duration-300

            group-hover:bg-[#A07936]/10
          "
        >

          ${icon("user", "h-5 w-5")}

        </div>

        <div class="min-w-0">

          <p
            class="
              text-sm
              font-medium
            "
          >
            My Account
          </p>

          <p
            class="
              mt-1

              text-xs

              text-white/50

              transition-colors
              duration-300

              group-hover:text-white/70
            "
          >
            Sign In / Register
          </p>

        </div>

        <span
          class="
            ml-auto

            text-white/30

            transition-all
            duration-300

            group-hover:translate-x-1
            group-hover:text-[#A07936]
          "
        >
          ${icon("chevron-right", "h-4 w-4")}
        </span>

      </a>

    </div>
  `;
}


// ========================================
// Create Logged-In Account Section
// ========================================

function createUserAccount(user) {

  const fullName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    user?.fullName ||
    user?.name ||
    "My Account";

  const initial =
    fullName.charAt(0).toUpperCase();

  return `
   <div
  data-mobile-account
  class="border-b border-white/10 px-4 py-5"
>

      <!-- USER HEADER -->

      <div
        class="
          flex
          items-center
          gap-4

          rounded-2xl

          bg-white/5

          px-5
          py-4
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

            bg-[#A07936]

            text-sm
            font-semibold

            text-white
          "
        >
          ${initial}
        </div>

        <div class="min-w-0">

          <p
            class="
              text-[10px]

              uppercase
              tracking-[0.3em]

              text-[#A07936]
            "
          >
            Welcome Back
          </p>

          <p
            class="
              mt-1

              truncate

              text-sm
              font-medium

              text-white
            "
          >
            ${fullName}
          </p>

        </div>

      </div>


      <!-- PROFILE -->

      <a
        href="/pages/profile.html"

        class="
          group

          mt-3

          flex
          items-center
          gap-3

          rounded-2xl

          px-5
          py-3

          text-sm

          text-white/70

          transition-all
          duration-300

          hover:bg-white/5
          hover:text-[#A07936]
        "
      >

        ${icon(
          "user-round",
          "h-[17px] w-[17px] text-white/40 group-hover:text-[#A07936]"
        )}

        <span>
          My Profile
        </span>

        <span
          class="
            ml-auto

            text-white/20

            transition-all
            duration-300

            group-hover:translate-x-1
            group-hover:text-[#A07936]
          "
        >
          ${icon("chevron-right", "h-4 w-4")}
        </span>

      </a>


      <!-- ORDERS -->

      <a
        href="/pages/orders.html"

        class="
          group

          flex
          items-center
          gap-3

          rounded-2xl

          px-5
          py-3

          text-sm

          text-white/70

          transition-all
          duration-300

          hover:bg-white/5
          hover:text-[#A07936]
        "
      >

        ${icon(
          "package",
          "h-[17px] w-[17px] text-white/40 group-hover:text-[#A07936]"
        )}

        <span>
          Orders
        </span>

        <span
          class="
            ml-auto

            text-white/20

            transition-all
            duration-300

            group-hover:translate-x-1
            group-hover:text-[#A07936]
          "
        >
          ${icon("chevron-right", "h-4 w-4")}
        </span>

      </a>


      <!-- LOGOUT -->

      <button
        id="mobileLogoutBtn"

        type="button"

        class="
          group

          mt-3

          flex
          w-full

          items-center
          justify-center

          gap-2

          rounded-full

          border
          border-white/10

          py-3

          text-sm
          font-medium

          text-white/70

          transition-all
          duration-300

          hover:border-[#A07936]
          hover:bg-[#A07936]
          hover:text-white

          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >

        ${icon(
          "log-out",
          "h-[15px] w-[15px]"
        )}

        <span>
          Sign Out
        </span>

      </button>

    </div>
  `;
}


// ========================================
// Create Account Section
// ========================================

function createAccountSection() {

  const user = getCurrentUser();

  if (user) {
    return createUserAccount(user);
  }

  return createGuestAccount();
}


// ========================================
// Create Mobile Navigation
// ========================================

export function createMobileNav() {

  const navigation =
    createNavigationLinks();

  const accountSection =
    createAccountSection();


  return `
    <div
      id="mobileDrawer"

      class="
        fixed
        inset-0

        z-[999]

        hidden
      "
    >

      <!-- BACKDROP -->

      <div
        id="mobileBackdrop"

        class="
          absolute
          inset-0

          bg-black/60
          backdrop-blur-sm

          opacity-0

          transition-opacity
          duration-300
        "
      ></div>


      <!-- PANEL -->

      <div
        id="mobilePanel"

        class="
          fixed

          inset-y-0
          left-0

          z-10

          flex
          h-full
          w-[85vw]
          max-w-[360px]

          -translate-x-full

          flex-col

          border-r
          border-white/10

          bg-[#181818]

          shadow-[25px_0_60px_rgba(0,0,0,.45)]

          transition-transform
          duration-300
          ease-out
        "
      >


        <!-- HEADER -->

       <div
  class="
    flex
    shrink-0
    items-center
    justify-between
    border-b
    border-white/10
    px-5
    py-4
  "
>
  <!-- LOGO -->
  <a
    href="/index.html"
    class="inline-flex items-center"
    aria-label="Banshiwale Home"
  >
    <img
      src="/src/assets/logo.png"
      alt="Banshiwale"
      class="h-16 w-16 object-contain"
    />
  </a>

  <!-- CLOSE -->
  <button
    id="closeDrawerBtn"
    type="button"
    aria-label="Close Menu"
    class="
      flex
      h-10
      w-10
      items-center
      justify-center
      rounded-full
      text-white/80
      transition-all
      duration-300
      hover:bg-white/5
      hover:text-[#A07936]
    "
  >
    ${icon("x", "h-6 w-6")}
  </button>
</div>

        <!-- SCROLLABLE BODY -->

        <div
          class="
            min-h-0
            flex-1
            overflow-y-auto
            no-scrollbar
          "
        >

        <!-- ACCOUNT -->

        ${accountSection}


        <!-- NAVIGATION -->

        <nav
          class="
            px-4
            py-5
          "
        >

          <ul
            class="
              space-y-1.5
            "
          >

            ${navigation}


            <!-- WISHLIST -->

            <li>

              <a
                href="/pages/wishlist.html"

                class="
                  group

                  flex
                  items-center
                  justify-between

                  rounded-2xl

                  px-5
                  py-3.5

                  text-sm
                  font-medium

                  text-white

                  transition-all
                  duration-300

                  hover:bg-white/5
                  hover:text-[#A07936]
                "
              >

                <div
                  class="
                    flex
                    items-center
                    gap-3
                  "
                >

                  ${icon("heart")}

                  <span>
                    Wishlist
                  </span>

                </div>

                <span
                  class="
                    transition-transform
                    duration-300

                    group-hover:translate-x-1
                  "
                >
                  ${icon("chevron-right")}
                </span>

              </a>

            </li>


            <!-- CART -->

            <li>

              <a
                href="/pages/cart.html"

                class="
                  group

                  flex
                  items-center
                  justify-between

                  rounded-2xl

                  px-5
                  py-3.5

                  text-sm
                  font-medium

                  text-white

                  transition-all
                  duration-300

                  hover:bg-white/5
                  hover:text-[#A07936]
                "
              >

                <div
                  class="
                    flex
                    items-center
                    gap-3
                  "
                >

                  ${icon("shopping-bag")}

                  <span>
                    Cart
                  </span>

                </div>

                <span
                  class="
                    transition-transform
                    duration-300

                    group-hover:translate-x-1
                  "
                >
                  ${icon("chevron-right")}
                </span>

              </a>

            </li>


            <!-- CUSTOM JEWELLERY -->

            <li>

              <a
                href="/index.html#customize-jewellery"

                class="
                  js-open-customize-modal

                  group

                  flex
                  items-center
                  justify-between

                  rounded-2xl

                  px-5
                  py-3.5

                  text-sm
                  font-medium

                  text-white

                  transition-all
                  duration-300

                  hover:bg-white/5
                  hover:text-[#A07936]
                "
              >

                <div
                  class="
                    flex
                    items-center
                    gap-3
                  "
                >

                  ${icon("sparkles")}

                  <span>
                    Custom Jewellery
                  </span>

                </div>

                <span
                  class="
                    transition-transform
                    duration-300

                    group-hover:translate-x-1
                  "
                >
                  ${icon("chevron-right")}
                </span>

              </a>

            </li>


            <!-- ABOUT -->

            <li>

              <a
                href="/pages/about.html"

                class="
                  group

                  flex
                  items-center
                  justify-between

                  rounded-2xl

                  px-5
                  py-3.5

                  text-sm
                  font-medium

                  text-white

                  transition-all
                  duration-300

                  hover:bg-white/5
                  hover:text-[#A07936]
                "
              >

                <div
                  class="
                    flex
                    items-center
                    gap-3
                  "
                >

                  ${icon("info")}

                  <span>
                    About Us
                  </span>

                </div>

                <span
                  class="
                    transition-transform
                    duration-300

                    group-hover:translate-x-1
                  "
                >
                  ${icon("chevron-right")}
                </span>

              </a>

            </li>


            <!-- CONTACT -->

            <li>

              <a
                href="/pages/contact.html"

                class="
                  group

                  flex
                  items-center
                  justify-between

                  rounded-2xl

                  px-5
                  py-3.5

                  text-sm
                  font-medium

                  text-white

                  transition-all
                  duration-300

                  hover:bg-white/5
                  hover:text-[#A07936]
                "
              >

                <div
                  class="
                    flex
                    items-center
                    gap-3
                  "
                >

                  ${icon("mail")}

                  <span>
                    Contact
                  </span>

                </div>

                <span
                  class="
                    transition-transform
                    duration-300

                    group-hover:translate-x-1
                  "
                >
                  ${icon("chevron-right")}
                </span>

              </a>

            </li>

          </ul>

        </nav>

        </div>

        <!-- FOOTER -->

        <div
          class="
            shrink-0

            border-t
            border-white/10

            px-6
            pb-5
            pt-4

            text-center
          "
        >

          <p
            class="
              text-xs

              tracking-[0.2em]

              text-white/40
            "
          >
            © 2026 banshiwale
          </p>

          <p
            class="
              mt-2

              text-[11px]

              tracking-[0.08em]

              text-white/25
            "
          >
            Premium Sterling Silver Jewellery for Men
          </p>

        </div>

      </div>

    </div>
  `;
}


// ========================================
// Re-render Account Section After Auth
// ========================================

export function refreshMobileAccount() {

  const drawer =
    document.getElementById("mobileDrawer");

  if (!drawer) return;

  const panel =
    document.getElementById("mobilePanel");

  if (!panel) return;


  /*
   * We only replace the account section.
   * The navigation and drawer state remain untouched.
   */

  const oldAccount =
    panel.querySelector("[data-mobile-account]");

  if (!oldAccount) return;

  const wrapper =
    document.createElement("div");

  wrapper.setAttribute(
    "data-mobile-account",
    ""
  );

  wrapper.innerHTML =
    createAccountSection();

  oldAccount.replaceWith(
    wrapper.firstElementChild
  );



}





// ========================================
// Auth State Listener
// ========================================

function initMobileAuthListener() {

  window.addEventListener(
    "authChanged",
    () => {

      refreshMobileAccount();

    }
  );
}


// ========================================
// Drawer Controller
// ========================================

const PANEL_OPEN = [
  "opacity-100",
  "scale-100",
  "-translate-x-1/2",
  "-translate-y-1/2",
];

const PANEL_CLOSE = [
  "opacity-0",
  "scale-95",
  "-translate-x-1/2",
  "-translate-y-1/2",
];

const BACKDROP_VISIBLE =
  "opacity-100";

const BACKDROP_HIDDEN =
  "opacity-0";

let isOpen = false;


// ========================================
// Initialize Drawer
// ========================================

export function initMobileDrawer() {

  const drawer =
    document.getElementById("mobileDrawer");

  const panel =
    document.getElementById("mobilePanel");

  const backdrop =
    document.getElementById("mobileBackdrop");

  const openBtn =
    document.getElementById("menuBtn");

  const closeBtn =
    document.getElementById("closeDrawerBtn");


  if (
    !drawer ||
    !panel ||
    !backdrop ||
    !openBtn ||
    !closeBtn
  ) {
    return;
  }


  // ======================================
  // Open
  // ======================================

  function openDrawer() {

    if (isOpen) return;

    isOpen = true;

    /*
     * Make sure the latest auth state is
     * represented before opening.
     */

    refreshMobileAccount();

    drawer.classList.remove("hidden");

    document.body.classList.add(
      "overflow-hidden"
    );


    requestAnimationFrame(() => {

      backdrop.classList.remove(
        BACKDROP_HIDDEN
      );

      backdrop.classList.add(
        BACKDROP_VISIBLE
      );


      panel.classList.remove(
        ...PANEL_CLOSE
      );

      panel.classList.add(
        ...PANEL_OPEN
      );

    });
  }


  // ======================================
  // Close
  // ======================================

  function closeDrawer() {

    if (!isOpen) return;

    isOpen = false;


    backdrop.classList.remove(
      BACKDROP_VISIBLE
    );

    backdrop.classList.add(
      BACKDROP_HIDDEN
    );


    panel.classList.remove(
      ...PANEL_OPEN
    );

    panel.classList.add(
      ...PANEL_CLOSE
    );


    document.body.classList.remove(
      "overflow-hidden"
    );


    panel.addEventListener(
      "transitionend",
      () => {

        if (!isOpen) {

          drawer.classList.add(
            "hidden"
          );

        }

      },
      {
        once: true,
      }
    );

  }


  // ======================================
  // Buttons
  // ======================================

  openBtn.addEventListener(
    "click",
    openDrawer
  );

  closeBtn.addEventListener(
    "click",
    closeDrawer
  );


  backdrop.addEventListener(
    "click",
    closeDrawer
  );


  // ======================================
  // Escape
  // ======================================

  document.addEventListener(
    "keydown",
    (event) => {

      if (event.key === "Escape") {

        closeDrawer();

      }

    }
  );


  // ======================================
  // Desktop Resize
  // ======================================

  window.addEventListener(
    "resize",
    () => {

      if (
        window.innerWidth >= 1024 &&
        isOpen
      ) {

        closeDrawer();

      }

    }
  );





  // ======================================
  // Auth Listener
  // ======================================

  initMobileAuthListener();

}
