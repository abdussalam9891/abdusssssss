import { productService } from "../../services/productService.js";

import { productState } from "./state.js";

import { createShowcaseCard } from "../../components/showcase/showcaseCard.js";

import { STORE_DOMAIN } from "../../config.js";

import { isActiveProduct } from "../../utils/productStatus.js";


/*
 * Only backend product ids are stored locally; the products
 * themselves are always re-fetched from the backend, so nothing
 * stale or invented is ever rendered.
 *
 * Scoped per store domain: localStorage is shared across every
 * site served from the same origin (e.g. local dev), so without
 * the domain suffix, ids viewed on one store would leak into
 * another store's "Recently Viewed".
 */

const STORAGE_KEY =
  `banshiwale_recent_products_${STORE_DOMAIN}`;

const MAX_ITEMS = 8;


function readIds() {

  try {

    const stored =
      JSON.parse(
        localStorage.getItem(STORAGE_KEY)
      );


    return Array.isArray(stored)
      ? stored.filter(
          (id) => typeof id === "string" && id
        )
      : [];

  } catch (error) {

    console.warn(
      "[Recently Viewed] Stored ids could not be read:",
      error
    );

    return [];
  }

}


function getSection(container) {

  return container.closest("section");
}


export function saveRecentlyViewed() {

  const currentId =
    productState.product?.id;

  if (!currentId) return;


  const ids = [
    currentId,

    ...readIds().filter(
      (id) => id !== currentId
    ),
  ].slice(0, MAX_ITEMS);


  try {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(ids)
    );

  } catch (error) {

    console.warn(
      "[Recently Viewed] Could not persist history:",
      error
    );

  }

}


export async function initRecentlyViewed() {

  const container =
    document.getElementById(
      "recentlyViewedProducts"
    );

  if (!container) return;


  const currentId =
    productState.product?.id;


  const ids =
    readIds()
      .filter(
        (id) => id !== currentId
      )
      .slice(0, MAX_ITEMS);


  if (!ids.length) {

    getSection(container)?.remove();

    return;
  }


  const results =
    await Promise.allSettled(
      ids.map(
        (id) =>
          productService.getPublicProductById(id)
      )
    );


  const products =
    results
      .filter(
        (result) =>
          result.status === "fulfilled" &&
          result.value &&
          isActiveProduct(result.value)
      )
      .map(
        (result) => result.value
      );


  const failed =
    results.filter(
      (result) =>
        result.status === "rejected"
    );


  if (failed.length) {

    console.error(
      "[Recently Viewed] Some products could not be loaded:",
      failed.map(
        (result) => result.reason
      )
    );

  }


  if (!products.length) {

    getSection(container)?.remove();

    return;
  }


  container.innerHTML =
    products
      .map(
        (product) =>
          createShowcaseCard(product, true)
      )
      .join("");


  window.lucide?.createIcons();

}
