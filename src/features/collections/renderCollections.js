import { websiteService } from "../../services/websiteService.js";
import { createCollectionCard } from "../../components/collections/collectionCard.js";

const CATEGORY_IMAGES = {
  "Silver Rings": "./src/assets/ring.png",
  "Silver Chains": "./src/assets/chain.png",
  "Silver Bracelet": "./src/assets/bracelet.png",
  "Silver Kada": "./src/assets/kada.png",
  "Silver Pendant": "./src/assets/pendant.png",
};

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

    console.log(
      "[Collections] Backend categories:",
      categories
    );

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
        // Only categories we have local art for — skip the rest
        // rather than showing a broken/incorrect image for them.
        .filter((category) => CATEGORY_IMAGES[category.name])
        .map((category) => ({

          id: category._id,

          title: category.name,

          subtitle: "Explore Collection",

          image: CATEGORY_IMAGES[category.name],

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
