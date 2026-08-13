import { initHomeFaq } from "../features/homeFaq/accordion.js";

import { initCollections } from "../features/collections/index.js";
import { initCraftsmanship } from "../features/craftsmanship/index.js";
import { initHero } from "../features/hero/index.js";
import { initMarquee } from "../features/marquee/index.js";
import { initNewsletterSection } from "../features/newsletter/index.js";
import { initShowcase } from "../features/showcase/index.js";
import { initTestimonials } from "../features/testimonials/index.js";
import { renderWhyChooseUs } from "../features/whyChooseUs/index.js";

import { createAnnouncementBar } from "../components/announcement/announcementBar.js";

import {
  createCustomizeJewelleryButton,
  createCustomizeJewelleryModal,
} from "../components/customizeJewellery/index.js";


export async function initHomePage() {

  const container =
    document.getElementById("homeFaq");

  if (!container) return;


  // =========================================
  // CRITICAL / ABOVE THE FOLD
  // =========================================

  initHero();


  // =========================================
  // ANNOUNCEMENT
  // =========================================

  const announcement =
    document.getElementById("homeAnnouncement");

  if (announcement) {

    announcement.innerHTML =
      createAnnouncementBar();

  }


  // =========================================
  // CUSTOMIZE JEWELLERY
  // =========================================

  const buttonContainer =
    document.getElementById("customizeJewellery");

  if (buttonContainer) {

    buttonContainer.innerHTML =
      createCustomizeJewelleryButton();

  }


  const drawerContainer =
    document.getElementById(
      "customizeJewelleryDrawer"
    );

  if (drawerContainer) {

    drawerContainer.innerHTML =
      createCustomizeJewelleryModal();

  }


  // =========================================
  // HOME FAQ — BACKEND
  // =========================================
  // IMPORTANT:
  // Do NOT await this.
  // FAQ failure must NOT stop homepage.

  initHomeFaq().catch((error) => {

    console.error(
      "[Home FAQ] Failed to initialize:",
      error
    );

  });


  // =========================================
  // BELOW THE FOLD
  // =========================================

  const modules = [

    ["initCollections", initCollections],

    ["initShowcase", initShowcase],

    ["initMarquee", initMarquee],

    ["renderWhyChooseUs", renderWhyChooseUs],

    ["initCraftsmanship", initCraftsmanship],

    ["initTestimonials", initTestimonials],

    ["initNewsletterSection", initNewsletterSection],

  ];


const runDeferred = async () => {



  for (const [name, fn] of modules) {



    try {

      await fn();

      

    } catch (err) {

      console.error(
        `[HOME] ${name} FAILED:`,
        err
      );

    }

  }

  console.log("[HOME] All deferred modules finished");
};

runDeferred();


  // Start independently
  runDeferred();

}
