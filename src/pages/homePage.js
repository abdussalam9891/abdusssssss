import { initHomeFaq }
  from "../features/homeFaq/accordion.js";

import { initCollections }
  from "../features/collections/index.js";

import { initCraftsmanship }
  from "../features/craftsmanship/index.js";

import { initHero }
  from "../features/hero/index.js";

import { initShowcase }
  from "../features/showcase/index.js";

import { initTestimonials }
  from "../features/testimonials/index.js";

import { renderWhyChooseUs }
  from "../features/whyChooseUs/index.js";

import { initAnnouncementBar }
  from "../features/announcement/index.js";

export async function initHomePage() {

  const container =
    document.getElementById("homeFaq");


  if (!container) return;


  // =========================================
  // HERO
  // =========================================

  // Hero is important, but backend failure
  // must NOT kill the homepage.
  initHero().catch((error) => {

    console.error(
      "[Hero] Failed to initialize:",
      error
    );

  });


  // =========================================
  // ANNOUNCEMENT
  // =========================================

  const announcement =
    document.getElementById(
      "homeAnnouncement"
    );


  if (announcement) {

    // Fire-and-forget.
    // Homepage does NOT wait for the API.
    initAnnouncementBar(
      announcement
    ).catch((error) => {

      console.error(
        "[Announcement] Failed to initialize:",
        error
      );

    });

  }


  // =========================================
  // HOME FAQ
  // =========================================

  // Do not await.
  // FAQ failure must never stop homepage.
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

    [
      "initCollections",
      initCollections,
    ],

    [
      "initShowcase",
      initShowcase,
    ],

    [
      "renderWhyChooseUs",
      renderWhyChooseUs,
    ],

    [
      "initCraftsmanship",
      initCraftsmanship,
    ],

    [
      "initTestimonials",
      initTestimonials,
    ],

  ];


  // =========================================
  // RUN IN PARALLEL
  // =========================================

  const results =
    await Promise.allSettled(

      modules.map(
        async ([name, fn]) => {

          try {

            await fn();


          } catch (error) {

            console.error(
              `[HOME] ${name} FAILED:`,
              error
            );

            // Re-throw so Promise.allSettled()
            // records this module as rejected.
            throw error;

          }

        }
      )

    );


  // =========================================
  // SUMMARY
  // =========================================

  const failedModules =
    results.filter(
      (result) =>
        result.status === "rejected"
    );


  if (failedModules.length > 0) {

    console.warn(
      `[HOME] ${failedModules.length} module(s) failed.`
    );

  } else {

    console.log(
      "[HOME] All modules initialized successfully."
    );

  }

}
