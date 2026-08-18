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

  // =========================================
  // GLOBAL
  // =========================================

  // Navbar must render immediately.
  // It must NOT wait for API requests.
  initNavbar();


  // Toast is completely independent.
  initToast();


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


    // Customize Jewellery is independent.
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
        initContact,
      } = await import(
        "./features/contact/contact.js"
      );


      await initContact();


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


  // =========================================
  // FOOTER
  // =========================================

  const footer =
    document.getElementById("footer");


  if (footer) {

    try {

      footer.innerHTML =
        await createFooter();


      initFooterAccordion();


    } catch (error) {

      console.error(
        "[Footer] Failed to initialize:",
        error
      );

    }

  }

});
