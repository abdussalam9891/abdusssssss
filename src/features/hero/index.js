import { createHero } from "../../components/hero/index.js";
import { initHeroSlider } from "./slider.js";
import { websiteService } from "../../services/websiteService.js";
import { HERO_SLIDES } from "../../constants/heroSlides.js";

// Local, trustworthy fallback so the hero is never blank while the
// backend is unreachable. Maps the static constant shape to what
// createHero()/createHeroSlides() expect.
function getFallbackHeroSlides() {

  return HERO_SLIDES.map((slide) => ({
    image: {
      url: slide.image,
    },
    heading: slide.title,
  }));

}

export async function initHero() {

  const container =
    document.getElementById("heroContainer");

  if (!container) {
    console.warn("[Hero] #heroContainer not found.");
    return;
  }

  // Render the local fallback immediately so the hero
  // is always visually usable, even before the backend
  // request resolves.
  container.innerHTML =
    createHero(getFallbackHeroSlides());

  let slides = null;

  try {

    const backendSlides =
      await websiteService.getHeroSlides();

    if (
      Array.isArray(backendSlides) &&
      backendSlides.length
    ) {
      slides = backendSlides;
    }

  } catch (error) {

    console.error(
      "[Hero] Failed to load backend hero slides. Using local fallback.",
      error
    );

  }

  // Only re-render when the backend actually provided slides.
  // Otherwise keep the local fallback already on screen.
  if (slides) {
    container.innerHTML =
      createHero(slides);
  }

  initHeroSlider();
}
