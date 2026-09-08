import { INSTAGRAM_GALLERY } from "../../constants/instagramGallery.js";
import { createInstagramGalleryTile } from "../../components/instagramGallery/instagramGalleryTile.js";

export function renderInstagramGallery() {
  const grid = document.getElementById("instagramGalleryGrid");

  if (!grid) return;

  grid.innerHTML = INSTAGRAM_GALLERY
    .map(createInstagramGalleryTile)
    .join("");
}
