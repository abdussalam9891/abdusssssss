import { productService } from "../../services/productService.js";

import { productState } from "./state.js";

import { createShowcaseCard } from "../../features/showcase/showcaseCard.js";

import { isActiveProduct } from "../../utils/productStatus.js";

import {
  createProductCarouselSkeleton,
  setSkeletonBusy,
} from "../../components/skeleton/skeleton.js";


const RELATED_LIMIT = 8;


function getSection(container) {

  return container.closest("section");
}


/*
 * Related products come from the dedicated similar-products
 * endpoint (GET /product/similar/slug/:slug), keyed off the
 * current product's slug. The cards consume the raw backend
 * product shape, so no normalization is needed here.
 *
 * If the current product has no slug yet, or the similar-products
 * request fails, this falls back to the same public store listing
 * the products page uses, filtered by sub-category — so the
 * section still degrades to something useful rather than
 * disappearing outright.
 */

async function fetchFallbackProducts(current) {

  const category =
    current.subCategory?.[0] ||
    current.childCategory?.[0] ||
    "";

  const response =
    await productService.getPublicProducts({

      page: 1,

      // One extra, in case the current product comes back.
      limit: RELATED_LIMIT + 1,

      categories:
        category
          ? [category]
          : [],

    });

  return response?.data?.products || [];
}


export async function initRelatedProducts() {

  const container =
    document.getElementById("relatedProducts");

  if (!container) return;


  const current =
    productState.product;

  if (!current) return;


  setSkeletonBusy(container, true);

  container.innerHTML =
    createProductCarouselSkeleton({ count: 4 });


  let products = [];

  try {

    products =
      current.slug
        ? await productService.getSimilarProductsBySlug(
            current.slug
          )
        : [];

  } catch (error) {

    console.error(
      "[Product Details] Failed to load similar products:",
      error
    );

  }


  if (!products.length) {

    try {

      products =
        await fetchFallbackProducts(current);

    } catch (error) {

      console.error(
        "[Product Details] Fallback related products request " +
        "also failed:",
        error
      );

      getSection(container)?.remove();

      return;
    }

  }


  products =
    products
      .filter(
        (product) =>
          product?._id &&
          product._id !== current.id &&
          isActiveProduct(product)
      )
      .slice(0, RELATED_LIMIT);


  if (!products.length) {

    getSection(container)?.remove();

    return;
  }


  setSkeletonBusy(container, false);

  container.innerHTML =
    products
      .map(
        (product) =>
          createShowcaseCard(product, true)
      )
      .join("");


  window.lucide?.createIcons();

}
