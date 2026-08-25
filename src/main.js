import { initNavbar } from "./features/navbar/index.js";
import { initRevealAnimations } from "./features/animations/reveal.js";

import {
  createFooter,
  initFooterAccordion,
} from "./components/footer/index.js";

import { hydrateFooterSocialLinks } from "./features/footer/hydrateSocialLinks.js";

import { initFooterNewsletter } from "./features/footer/newsletter.js";

import { hydrateContactInfo } from "./features/contact/hydrateContactInfo.js";

import { initToast } from "./features/toast/index.js";

import { initFloatingWhatsAppButton } from "./features/whatsapp/index.js";

import { initScrollToTopButton } from "./features/scrollToTop/index.js";

import { initCartBadgeSync } from "./features/cart/cartBadge.js";

import { initCartSync } from "./features/cart/cartState.js";

import { initWishlistBadgeSync } from "./features/wishlist/wishlistBadge.js";

import { initWishlistButtons } from "./features/wishlist/wishlistButtons.js";

import { initWishlistSync } from "./features/wishlist/wishlistState.js";

import { initQuickAdd } from "./features/quickAdd/index.js";

import { initQuickView } from "./features/quickView/index.js";

import {
  initAuthModal,
  initGuestEngagement,
} from "./features/auth/index.js";

import { hydrateAuth } from "./features/auth/authState.js";


document.addEventListener("DOMContentLoaded", async () => {

  // =========================================
  // GLOBAL
  // =========================================

  // Navbar must render immediately.
  // It must NOT wait for API requests.
  initNavbar();


  // Toast is completely independent.
  initToast();


  // The cart badge just reads whatever cartState.js's cache
  // currently holds — it needs the navbar's #cartCount element to
  // exist, which initNavbar() above already guarantees.
  initCartBadgeSync();

  // The cart is guest-usable (localStorage) but backend-backed once
  // signed in, and reloads on every login/logout via authChanged,
  // same as the wishlist below.
  initCartSync();


  // The wishlist is backend-backed and requires login  
  // the current user is known and reloads on every login/logout,
  // via authChanged. #wishlistCount and every wishlist heart icon
  // sitewide both read from the resulting in-memory cache.
  initWishlistSync();

  initWishlistBadgeSync();


  // Wires every showcase card's heart icon sitewide (homepage,
  // products listing, related/recently-viewed, wishlist page) to
  // actually save/remove against the backend — previously
  // decorative everywhere except the dedicated product-details
  // wishlist button.
  initWishlistButtons();


  // Shared "pick a size, then add to cart" modal for every showcase
  // card's Add to Cart button and the wishlist page's Move to Cart
  // button (see features/quickAdd/index.js).
  initQuickAdd();


  // Product preview modal opened from every showcase card's eye
  // icon (see features/quickView/index.js) — shows photos, price
  // and sizes without leaving the listing.
  initQuickView();


  // WhatsApp button is completely independent.
  // Backend failure must not block anything else.
  initFloatingWhatsAppButton().catch((error) => {

    console.error(
      "[WhatsApp] Failed to initialize:",
      error
    );

  });


  // Scroll-to-top button is local-only and independent of the backend.
  try {
    initScrollToTopButton();
  } catch (error) {
    console.error(
      "[ScrollToTop] Failed to initialize:",
      error
    );
  }


  // Resolve authentication in background.
  // Navbar already renders using current local auth state
  // and listens for authChanged.
  hydrateAuth()
    .then(() => {

      initAuthModal();

      initGuestEngagement();

    })
    .catch((error) => {

      console.error(
        "[Auth] Failed to hydrate authentication:",
        error
      );

    });


  // =========================================
  // AUTH STATE CHANGES
  // =========================================

  // Re-render navbar when login/logout happens.
  window.addEventListener(
    "authChanged",
    () => {

      initNavbar();

    }
  );


  // =========================================
  // FOOTER
  // =========================================

  // Footer must render immediately, just like the navbar.
  // It must NOT wait for page-specific backend requests
  // (home page, products, policies, etc.) below.
  const footer =
    document.getElementById("footer");


  if (footer) {

    try {

      footer.innerHTML =
        createFooter();


      initFooterAccordion();

      initFooterNewsletter();


      // Social links and contact details are backend-provided;
      // hydrate them separately so a failed request never blocks
      // the static footer from rendering.
      hydrateFooterSocialLinks();

      hydrateContactInfo();


    } catch (error) {

      console.error(
        "[Footer] Failed to initialize:",
        error
      );

    }

  }


  // =========================================
  // HOME
  // =========================================

  if (
    document.getElementById("homeFaq")
  ) {

    try {

      const {
        initHomePage,
      } = await import(
        "./pages/homePage.js"
      );


      await initHomePage();


    } catch (error) {

      console.error(
        "[Home] Failed to initialize homepage:",
        error
      );

    }


  }


  // =========================================
  // CUSTOMIZE JEWELLERY
  // =========================================

  // Independent of any specific page: the floating button + modal
  // appear on the home, products, and product details pages, each
  // of which renders the #customizeJewellery / #customizeJewelleryDrawer
  // containers. Backend failure elsewhere must not block this.

  if (
    document.getElementById("customizeJewellery")
  ) {

    try {

      const {
        initCustomizeJewellery,
      } = await import(
        "./features/customizeJewellery/index.js"
      );


      initCustomizeJewellery();


    } catch (error) {

      console.error(
        "[Customize Jewellery] Failed to initialize:",
        error
      );

    }

  }


  // =========================================
  // PRODUCTS
  // =========================================

  if (
    document.getElementById("productsHero")
  ) {

    try {

      const {
        loadProductsPage,
      } = await import(
        "./pages/productsPage.js"
      );


      loadProductsPage();


    } catch (error) {

      console.error(
        "[Products] Failed to initialize:",
        error
      );

    }

  }


  // =========================================
  // PRODUCT DETAILS
  // =========================================

  if (
    document.getElementById("productDetails")
  ) {

    try {

      const {
        loadProductDetailsPage,
      } = await import(
        "./pages/productDetailsPage.js"
      );


      loadProductDetailsPage();


    } catch (error) {

      console.error(
        "[Product Details] Failed to initialize:",
        error
      );

    }

  }


  // =========================================
  // CART
  // =========================================

  if (
    document.getElementById("cartPage")
  ) {

    try {

      const {
        loadCartPage,
      } = await import(
        "./pages/cartPage.js"
      );


      loadCartPage();


    } catch (error) {

      console.error(
        "[Cart] Failed to initialize:",
        error
      );

    }

  }


  // =========================================
  // CHECKOUT
  // =========================================

  if (
    document.getElementById("checkoutPage")
  ) {

    try {

      const {
        loadCheckoutPage,
      } = await import(
        "./pages/checkoutPage.js"
      );


      loadCheckoutPage();


    } catch (error) {

      console.error(
        "[Checkout] Failed to initialize:",
        error
      );

    }

  }


  // =========================================
  // WISHLIST
  // =========================================

  if (
    document.getElementById("wishlistPage")
  ) {

    try {

      const {
        loadWishlistPage,
      } = await import(
        "./pages/wishlistPage.js"
      );


      loadWishlistPage();


    } catch (error) {

      console.error(
        "[Wishlist] Failed to initialize:",
        error
      );

    }

  }


  // =========================================
  // PROFILE
  // =========================================

  if (
    document.getElementById("profilePage")
  ) {

    try {

      const {
        loadProfilePage,
      } = await import(
        "./pages/profilePage.js"
      );


      loadProfilePage();


    } catch (error) {

      console.error(
        "[Profile] Failed to initialize:",
        error
      );

    }

  }


  // =========================================
  // FAQ
  // =========================================

  if (
    document.getElementById("faqContainer")
  ) {

    try {

      const {
        loadFAQPage,
      } = await import(
        "./pages/faqPage.js"
      );


      loadFAQPage();


    } catch (error) {

      console.error(
        "[FAQ] Failed to initialize:",
        error
      );

    }

  }


  // =========================================
  // CONTACT
  // =========================================

  if (
    document.getElementById("contact-form")
  ) {

    try {

      const {
        initContactPage,
      } = await import(
        "./pages/contactPage.js"
      );


      // Renders synchronously; backend contact details hydrate
      // in the background.
      initContactPage();


    } catch (error) {

      console.error(
        "[Contact] Failed to initialize:",
        error
      );

    }

  }


  // =========================================
  // LOGIN
  // =========================================

  if (
    document.getElementById("loginContainer")
  ) {

    try {

      const {
        loadLoginPage,
      } = await import(
        "./pages/loginPage.js"
      );


      loadLoginPage();


    } catch (error) {

      console.error(
        "[Login] Failed to initialize:",
        error
      );

    }

  }


  // =========================================
  // REGISTER
  // =========================================

  if (
    document.getElementById("registerContainer")
  ) {

    try {

      const {
        loadRegisterPage,
      } = await import(
        "./pages/registerPage.js"
      );


      loadRegisterPage();


    } catch (error) {

      console.error(
        "[Register] Failed to initialize:",
        error
      );

    }

  }


  // =========================================
  // FORGOT PASSWORD
  // =========================================

  if (
    document.getElementById(
      "forgotPasswordContainer"
    )
  ) {

    try {

      const {
        loadForgotPasswordPage,
      } = await import(
        "./pages/forgotPasswordPage.js"
      );


      loadForgotPasswordPage();


    } catch (error) {

      console.error(
        "[Forgot Password] Failed to initialize:",
        error
      );

    }

  }


  // =========================================
  // POLICIES
  // =========================================

  if (
    document.getElementById("policyContent")
  ) {

    try {

      const {
        initPolicyPage,
      } = await import(
        "./pages/policies/initPolicyPage.js"
      );


      const policyType =
        document.body.dataset.policy;


      if (policyType) {

        await initPolicyPage(
          policyType
        );

      }


    } catch (error) {

      console.error(
        "[Policies] Failed to initialize:",
        error
      );

    }

  }


  // =========================================
  // GLOBAL UI
  // =========================================

  initRevealAnimations();

});
