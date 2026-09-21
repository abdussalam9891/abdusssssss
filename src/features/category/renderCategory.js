import { websiteService } from "../../services/websiteService.js";
import { createCategoryCard } from "./categoryCard.js";

const CATEGORY_IMAGES = {
  "Rings": "./src/assets/silverring.jpg",
  "Chains": "./src/assets/silverchain.jpeg",
  "Bracelet": "./src/assets/silverbracelet.jpeg",
  "Kada": "./src/assets/silverkada.jpg",
  "Pendant": "./src/assets/silverpendant.jpg",
  "Bansuri": "./src/assets/silverbansuri.jpg",
  "Bangles": "./src/assets/silverkids.jpg",
};

// Used for any backend category without a dedicated image above,
// so new categories still show up instead of being silently dropped.
const FALLBACK_CATEGORY_IMAGE = "./src/assets/banshiwala-gold.png";

// Local fallback built from the same images the live backend
// categories render with, so a failed/empty categories request
// still shows the real shop-by-category art instead of stand-ins.
function buildLocalCategories() {
  return Object.entries(CATEGORY_IMAGES).map(([name, image]) => ({
    id: name,
    title: name,
    subtitle: "Explore Collection",
    image,
    url: `/pages/products.html?category=${encodeURIComponent(name)}`,
  }));
}

function renderCategoryCards(container, categories) {

  container.innerHTML =
    categories
      .map(createCategoryCard)
      .join("");

  if (window.lucide) {
    window.lucide.createIcons();
  }

}

export async function initCategory() {

  const container =
    document.getElementById("categoryGrid");

  if (!container) return;

  // The card art is entirely local (CATEGORY_IMAGES) and these
  // names are the site's real, current categories — not a
  // placeholder — so there's no reason to block the section on a
  // network round trip. Render them immediately, then only touch
  // the DOM again if the backend actually disagrees (e.g. a
  // category was added/renamed), which is rare enough that the
  // quiet background swap is preferable to a skeleton on every load.
  const localCategories =
    buildLocalCategories();

  renderCategoryCards(
    container,
    localCategories
  );

  try {

    const categories =
      await websiteService.getCategories();

    if (
      !Array.isArray(categories) ||
      !categories.length
    ) {
      return;
    }

    const categoryCards =
      categories
        .map((category) => ({

          id: category._id,

          title: category.name,

          subtitle: "Explore Collection",

          // Categories without dedicated art (e.g. newly added ones)
          // still render, using the brand fallback instead of being
          // silently skipped.
          image:
            CATEGORY_IMAGES[category.name] ||
            FALLBACK_CATEGORY_IMAGE,

          // Use category name for product filtering
          url:
            `/pages/products.html?category=${encodeURIComponent(
              category.name
            )}`,

        }));

    if (!categoryCards.length) {
      return;
    }

    const matchesLocal =
      JSON.stringify(categoryCards.map((c) => c.title)) ===
      JSON.stringify(localCategories.map((c) => c.title));

    if (matchesLocal) {
      return;
    }

    renderCategoryCards(
      container,
      categoryCards
    );

  } catch (error) {

    console.error(
      "[Category] Failed to load categories from backend. Local categories already shown.",
      error
    );

  }
}
