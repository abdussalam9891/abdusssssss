import { websiteService } from "../../services/websiteService.js";
import { createCollectionCard } from "../../components/collections/collectionCard.js";

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
function buildLocalCollections() {
  return Object.entries(CATEGORY_IMAGES).map(([name, image]) => ({
    id: name,
    title: name,
    subtitle: "Explore Collection",
    image,
    url: `/pages/products.html?category=${encodeURIComponent(name)}`,
  }));
}

export async function renderCollections() {

  const container =
    document.getElementById("collectionGrid");

  if (!container) return;

  try {

    const categories =
      await websiteService.getCategories();

    if (
      !Array.isArray(categories) ||
      !categories.length
    ) {
      console.warn(
        "[Collections] No categories found. Using local fallback."
      );

      container.innerHTML =
        buildLocalCollections()
          .map(createCollectionCard)
          .join("");

      if (window.lucide) {
        window.lucide.createIcons();
      }

      return;
    }

    const collections =
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

    if (!collections.length) {
      console.warn(
        "[Collections] No backend categories matched local images. Using local fallback."
      );

      container.innerHTML =
        buildLocalCollections()
          .map(createCollectionCard)
          .join("");

      if (window.lucide) {
        window.lucide.createIcons();
      }

      return;
    }

    container.innerHTML =
      collections
        .map(createCollectionCard)
        .join("");

    // If you're using Lucide
    if (window.lucide) {
      window.lucide.createIcons();
    }

  } catch (error) {

    console.error(
      "[Collections] Failed to load categories. Using local fallback.",
      error
    );

    container.innerHTML =
      buildLocalCollections()
        .map(createCollectionCard)
        .join("");

    if (window.lucide) {
      window.lucide.createIcons();
    }

  }
}
