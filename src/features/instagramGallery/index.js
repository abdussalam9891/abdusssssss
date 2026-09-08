import { createInstagramGallerySection } from "../../components/instagramGallery/instagramGallerySection.js";
import { renderInstagramGallery } from "./renderInstagramGallery.js";
import { websiteService } from "../../services/websiteService.js";

export async function initInstagramGallery() {
  const container =
    document.getElementById("instagramGallery-container");

  if (!container) return;

  container.innerHTML =
    createInstagramGallerySection();

  renderInstagramGallery();

  const followLink =
    document.getElementById("instagramFollowLink");

  try {

    const { instagram } =
      await websiteService.getSocialLinks();

    if (followLink && instagram) {
      followLink.href = instagram;
    }

  } catch (error) {

    console.error(
      "[Instagram Gallery] Failed to load social link:",
      error
    );

    // Keep the existing fallback ("#") link already rendered.

  }
}
