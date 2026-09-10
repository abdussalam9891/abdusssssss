import { initCarousel } from "../../utils/carousel.js";

export function initShowcaseCarousel() {
  initCarousel({
    containerId: "showcaseProducts",
    prevId: "showcasePrev",
    nextId: "showcaseNext",
  });
}
