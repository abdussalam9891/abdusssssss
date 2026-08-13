import { PRODUCTS } from "../../constants/products.js";

import { productState } from "./state.js";

import { createShowcaseCard } from "../../components/showcase/showcaseCard.js";

const STORAGE_KEY =
  "banshiwale_recent_products";

export function saveRecentlyViewed() {

  const currentId =
    productState.product.id;

  let ids =
    JSON.parse(
      localStorage.getItem(STORAGE_KEY)
    ) || [];

  ids =
    ids.filter(
      (id) => id !== currentId
    );

  ids.unshift(currentId);

  ids =
    ids.slice(0, 8);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(ids)
  );

}

export function initRecentlyViewed() {

  const container =
    document.getElementById(
      "recentlyViewedProducts"
    );

  if (!container) return;

  const ids =
    JSON.parse(
      localStorage.getItem(STORAGE_KEY)
    ) || [];

  const products =
    ids
      .filter(
        (id) => id !== productState.product.id
      )
      .map((id) =>
        PRODUCTS.find(
          (product) => product.id === id
        )
      )
      .filter(Boolean);

  if (!products.length) {

    container.parentElement.parentElement.remove();

    return;

  }

  container.innerHTML =
    products
      .map((product) =>
        createShowcaseCard(product, true)
      )
      .join("");

}
