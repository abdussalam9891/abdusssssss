import { websiteService } from "../../services/websiteService.js";
import { createCollectionCard } from "../../components/collections/collectionCard.js";

const CATEGORY_IMAGES = {
  "Silver Rings": "./src/assets/ring.png",
  "Silver Chains": "./src/assets/chain.png",
  "Silver Bracelet": "./src/assets/bracelet.png",
  "Silver Kada": "./src/assets/kada.png",
  "Silver Pendant": "./src/assets/pendant.png",
};

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
        "[Collections] No categories found."
      );

      container.innerHTML = `
        <p class="w-full text-center text-[#777777]">
          No collections available right now.
        </p>
      `;
      return;
    }

    const collections =
      categories.map((category) => {

        const image =
          CATEGORY_IMAGES[category.name] ||
          "./src/assets/images/placeholder.webp";

        return {

          id: category._id,

          title: category.name,

          subtitle: "Explore Collection",

          image,

          // Use category name for product filtering
          url:
            `/pages/products.html?category=${encodeURIComponent(
              category.name
            )}`,

        };

      });

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
      "[Collections] Failed to load categories:",
      error
    );

    container.innerHTML = `
      <p class="w-full text-center text-red-600">
        Unable to load collections. Please try again later.
      </p>
    `;

  }
}
