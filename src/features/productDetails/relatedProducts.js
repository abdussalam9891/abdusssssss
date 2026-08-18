import { productService } from "../../services/productService.js";

import { productState } from "./state.js";

import { createShowcaseCard } from "../../components/showcase/showcaseCard.js";


const RELATED_LIMIT = 8;


function getSection(container) {

  return container.closest("section");
}


/*
 * Related products come from the same public store endpoint the
 * listing page uses, filtered by the current product's
 * sub-category. The cards consume the raw backend product shape,
 * so no normalization is needed here.
 */

export async function initRelatedProducts() {

  const container =
    document.getElementById("relatedProducts");

  if (!container) return;


  const current =
    productState.product;

  if (!current) return;


  const category =
    current.subCategory?.[0] ||
    current.childCategory?.[0] ||
    "";


  try {

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


    const products =
      (response?.data?.products || [])
        .filter(
          (product) =>
            product?._id &&
            product._id !== current.id
        )
        .slice(0, RELATED_LIMIT);


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


  } catch (error) {

    console.error(
      "[Product Details] Failed to load related products:",
      error
    );


    container.innerHTML = `
      <p class="w-full py-10 text-center text-red-600">
        Unable to load related products.
        Please try again later.
      </p>
    `;

  }

}
