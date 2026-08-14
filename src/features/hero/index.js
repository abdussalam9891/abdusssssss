import { createHero } from "../../components/hero/index.js";
import { initHeroSlider } from "./slider.js";
import { websiteService } from "../../services/websiteService.js";

export async function initHero() {

  const container =
    document.getElementById("heroContainer");

  if (!container) {
    console.warn("[Hero] #heroContainer not found.");
    return;
  }

  try {

     

    const slides =
      await websiteService.getHeroSlides();



    if (!Array.isArray(slides) || !slides.length) {

      return;
    }

    container.innerHTML =
      createHero(slides);



    initHeroSlider();

  } catch (error) {

    console.error(
      "[Hero] Failed to initialize:",
      error
    );

  }
}
