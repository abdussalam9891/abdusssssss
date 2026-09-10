import { getProductsQuery } from "./query.js";
import { productsState } from "./state.js";


const HERO_CONTENT = {

  ring: {
    label: "banshiwale Collection",
    title: "Sterling Silver Rings",
    description:
      "Discover handcrafted sterling silver rings designed for timeless elegance and everyday confidence.",
  },

  chain: {
    label: "banshiwale Collection",
    title: "Sterling Silver Chains",
    description:
      "Premium silver chains crafted with precision for modern men who appreciate understated luxury.",
  },

  bracelet: {
    label: "banshiwale Collection",
    title: "Sterling Silver Bracelets",
    description:
      "Bold, refined and handcrafted bracelets that complete every look with effortless sophistication.",
  },

  pendant: {
    label: "banshiwale Collection",
    title: "Sterling Silver Pendants",
    description:
      "Meaningful pendants inspired by craftsmanship, heritage and modern elegance.",
  },

  earring: {
    label: "banshiwale Collection",
    title: "Sterling Silver Earrings",
    description:
      "Minimal sterling silver earrings designed to elevate your everyday style.",
  },

  new: {
    label: "Latest Collection",
    title: "New Arrivals",
    description:
      "Explore the newest handcrafted jewellery pieces added to the banshiwale collection.",
  },

  bestseller: {
    label: "Customer Favorites",
    title: "Best Sellers",
    description:
      "Discover our most loved sterling silver jewellery chosen by our customers.",
  },

  limited: {
    label: "Limited Collection",
    title: "Limited Pieces",
    description:
      "Explore limited sterling silver pieces crafted in carefully selected quantities.",
  },

  collection: {
    label: "banshiwale",
    title: "Our Collection",
    description:
      "Explore handcrafted sterling silver jewellery created with timeless craftsmanship and contemporary design.",
  },

};


/*
 * The frontend category filter is plural ("rings"), while the
 * HERO_CONTENT keys are singular ("ring") — same as the backend
 * subCategory values. Look both up so a category link shows its
 * own hero copy instead of falling back to the generic one.
 */

function findHeroContent(value) {

  const key =
    String(value)
      .toLowerCase()
      .trim();


  return (
    HERO_CONTENT[key] ||
    HERO_CONTENT[key.replace(/s$/, "")] ||
    null
  );
}


function getHeroData() {

  const query =
    getProductsQuery();


  // ==========================================
  // CATEGORY
  // ==========================================

  if (query.category.length) {

    return (
      findHeroContent(
        query.category[0]
      ) ||
      HERO_CONTENT.collection
    );

  }


  // ==========================================
  // BADGE / COLLECTION
  // ==========================================

  if (query.badge.length) {

    return (
      findHeroContent(
        query.badge[0]
      ) ||
      HERO_CONTENT.collection
    );

  }


  return HERO_CONTENT.collection;
}


export function createProductsHero() {

  const hero =
    getHeroData();


  return `
<section
  class="
    relative
    overflow-hidden

    border-b
    border-[#ECE6DF]

    bg-[#FCFAF7]
  "
>

  <div
    class="
      relative

      mx-auto
      max-w-[1600px]

      px-4
      sm:px-6
      lg:px-8
      xl:px-10

      pt-32
      pb-10

      lg:pt-36
      lg:pb-12
    "
  >

    <!-- Hero Content -->

    <div class="max-w-2xl">

      <p
        class="
          mb-4

          text-[11px]

          font-semibold

          uppercase

          tracking-[0.28em]

          text-[#A07936]
        "
      >
        ${hero.label}
      </p>


      <h1
        class="
          font-serif

          text-3xl
          sm:text-4xl
          lg:text-5xl

          leading-tight

          tracking-[-0.02em]

          text-[#181818]
        "
      >
        ${hero.title}
      </h1>


      <p
        class="
          mt-4

          max-w-xl

          text-[15px]

          leading-7

          text-[#666666]
        "
      >
        ${hero.description}
      </p>

    </div>

  </div>

</section>
`;
}


export function renderProductsHero() {

  const container =
    document.getElementById(
      "productsHero"
    );

  if (!container) return;

  container.innerHTML =
    createProductsHero();
}


export function updateHeroCount() {

  const count =
    document.getElementById(
      "productsCount"
    );

  if (!count) return;


  // Backend total, not current page length
  count.textContent =
    productsState.total;
}
