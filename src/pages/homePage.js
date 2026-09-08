import { initHomeFaq }
  from "../features/homeFaq/accordion.js";

import { initCategory }
  from "../features/category/renderCategory.js";

import { initCraftsmanship }
  from "../features/craftsmanship/craftsmanshipInit.js";

import { initHero }
  from "../features/hero/heroInit.js";

import { initShowcase }
  from "../features/showcase/showcaseInit.js";

import { initInstagramGallery }
  from "../features/instagramGallery/instagramGalleryInit.js";

import { renderWhyChooseUs }
  from "../features/whyChooseUs/renderFeatures.js";

import { initAnnouncementBar }
  from "../features/announcement/announcementInit.js";

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
      "initCategory",
      initCategory,
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
      "initInstagramGallery",
      initInstagramGallery,
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

  }

}
