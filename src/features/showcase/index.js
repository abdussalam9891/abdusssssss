import { createShowcaseSection }
  from "../../components/showcase/showcaseSection.js";

import {
  loadShowcaseProducts,
  renderShowcase,
} from "./renderShowcase.js";

import { initShowcaseTabs } from "./tabs.js";
import { initShowcaseCarousel } from "./carousel.js";

export async function initShowcase() {

  const container =
    document.getElementById("showcase");

  if (!container) return;

  container.innerHTML =
    createShowcaseSection();

  // Fetch API products
  await loadShowcaseProducts();

  // Render first tab
  renderShowcase("trending");

  // Initialize interactions
  initShowcaseTabs();

  initShowcaseCarousel();
}
