import { initNavbar } from "./features/navbar/index.js";
import { initRevealAnimations } from "./features/animations/reveal.js";

import {
  createFooter,
  initFooterAccordion,
} from "./components/footer/index.js";

import { initToast } from "./features/toast/index.js";
import {
  initAuthModal,
  initGuestEngagement,
} from "./features/auth/index.js";

import { hydrateAuth } from "./features/auth/authState.js";

document.addEventListener("DOMContentLoaded", async () => {
  /* =========================================
     Global
  ========================================= */


     // Resolve who's actually logged in BEFORE anything
  // that reads auth state gets rendered.
  await hydrateAuth();
  initNavbar();
  initToast();



  initAuthModal();
  initGuestEngagement();







  // If login/logout happens later (another tab submits a
  // form, a token expires), re-render the navbar so the
  // dropdown reflects it without a full page reload.
  window.addEventListener("authChanged", () => {
    initNavbar();
  });

  /* =========================================
     Home
  ========================================= */

  if (document.getElementById("homeFaq")) {
    const { initHomePage } = await import(
      "./pages/homePage.js"
    );

    initHomePage();

    const { initCustomizeJewellery } = await import(
      "./features/customizeJewellery/index.js"
    );

    initCustomizeJewellery();
  }

  /* =========================================
     Products
  ========================================= */

  if (document.getElementById("productsHero")) {
    const { loadProductsPage } = await import(
      "./pages/productsPage.js"
    );

    loadProductsPage();
  }

  /* =========================================
     Product Details
  ========================================= */

  if (document.getElementById("productDetails")) {
    const { loadProductDetailsPage } = await import(
      "./pages/productDetailsPage.js"
    );

    loadProductDetailsPage();
  }

  /* =========================================
     FAQ
  ========================================= */

  if (document.getElementById("faqContainer")) {
    const { loadFAQPage } = await import(
      "./pages/faqPage.js"
    );

    loadFAQPage();
  }

  /* =========================================
     Login
  ========================================= */

  if (document.getElementById("loginContainer")) {
    const { loadLoginPage } = await import(
      "./pages/loginPage.js"
    );

    loadLoginPage();
  }

  /* =========================================
     Register
  ========================================= */

  if (document.getElementById("registerContainer")) {
    const { loadRegisterPage } = await import(
      "./pages/registerPage.js"
    );

    loadRegisterPage();
  }

  /* =========================================
     Forgot Password
  ========================================= */

  if (document.getElementById("forgotPasswordContainer")) {
    const { loadForgotPasswordPage } = await import(
      "./pages/forgotPasswordPage.js"
    );

    loadForgotPasswordPage();
  }

  /* =========================================
     Global UI
  ========================================= */

  initRevealAnimations();

  /* =========================================
     Footer
  ========================================= */

  const footer =
    document.getElementById("footer");

  if (footer) {
    footer.innerHTML = createFooter();

    initFooterAccordion();
  }
});



















