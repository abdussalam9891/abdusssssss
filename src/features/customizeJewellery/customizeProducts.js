import {

  createCustomizeProductCard,
} from "./renderCustomizeProducts.js";

import {
  customizeProductService,
} from "../../services/customizeProductService.js";





export function initCustomizeProducts() {

  // ==========================================
  // ELEMENTS
  // ==========================================

  const categorySelect =
    document.getElementById("jewelleryType");

  const productSection =
    document.getElementById("customizeProductSection");

  const productList =
    document.getElementById("customizeProductList");

  const productLoading =
    document.getElementById("customizeProductLoading");

  const productEmpty =
    document.getElementById("customizeProductEmpty");

  const productCount =
    document.getElementById("customizeProductCount");

  const productIdInput =
    document.getElementById("productId");


  if (
    !categorySelect ||
    !productSection ||
    !productList ||
    !productIdInput
  ) {
    return;
  }


  // ==========================================
  // CURRENT SELECTION
  // ==========================================

  let selectedProductId = null;


  // ==========================================
  // CATEGORY CHANGE
  // ==========================================

  categorySelect.addEventListener(
    "change",
    async () => {

      const category =
        categorySelect.value.trim();


      // ========================================
      // RESET PREVIOUS PRODUCT
      // ========================================

      selectedProductId = null;

      productIdInput.value = "";

      productList.innerHTML = "";

      productCount.textContent = "";

      productEmpty.classList.add("hidden");


      // ========================================
      // NO CATEGORY SELECTED
      // ========================================

      if (!category) {

        productSection.classList.add("hidden");

        return;

      }


      // ========================================
      // SHOW PRODUCT SECTION
      // ========================================

      productSection.classList.remove("hidden");

      productLoading?.classList.remove("hidden");


      try {

        // ======================================
        // GET PRODUCTS
        // ======================================

       const products =
  await customizeProductService.getProducts(category);


        productLoading?.classList.add("hidden");


        // ======================================
        // EMPTY
        // ======================================

        if (
          !Array.isArray(products) ||
          products.length === 0
        ) {

          productEmpty?.classList.remove(
            "hidden"
          );

          productCount.textContent =
            "0 pieces";

          return;

        }


        productEmpty?.classList.add(
          "hidden"
        );


        // ======================================
        // PRODUCT COUNT
        // ======================================

        productCount.textContent =
          `${products.length} ${
            products.length === 1
              ? "piece"
              : "pieces"
          }`;


        // ======================================
        // RENDER PRODUCTS
        // ======================================

        productList.innerHTML =
          products
            .map(
              (product) =>
                createCustomizeProductCard(
                  product,
                  false
                )
            )
            .join("");


        // ======================================
        // LUCIDE ICONS
        // ======================================

        if (window.lucide) {

          window.lucide.createIcons();

        }


        // ======================================
        // PRODUCT CARD CLICK
        // ======================================

        const productCards =
          productList.querySelectorAll(
            ".customize-product-card"
          );


        productCards.forEach(
          (card) => {

            card.addEventListener(
              "click",
              () => {

                const productId =
                  card.dataset.productId;


                if (!productId) {
                  return;
                }


                // ==================================
                // REMOVE PREVIOUS SELECTION
                // ==================================

                productCards.forEach(
                  (item) => {

                    item.classList.remove(
                      "border-primary",
                      "ring-2",
                      "ring-primary/20"
                    );

                    item.classList.add(
                      "border-[#E4DDD4]"
                    );


                    const indicator =
                      item.querySelector(
                        ".customize-product-selected"
                      );


                    indicator?.classList.remove(
                      "opacity-100",
                      "scale-100"
                    );

                    indicator?.classList.add(
                      "opacity-0",
                      "scale-75"
                    );

                  }
                );


                // ==================================
                // SELECT CURRENT CARD
                // ==================================

                selectedProductId =
                  productId;


                card.classList.remove(
                  "border-[#E4DDD4]"
                );

                card.classList.add(
                  "border-primary",
                  "ring-2",
                  "ring-primary/20"
                );


                const indicator =
                  card.querySelector(
                    ".customize-product-selected"
                  );


                indicator?.classList.remove(
                  "opacity-0",
                  "scale-75"
                );

                indicator?.classList.add(
                  "opacity-100",
                  "scale-100"
                );


                // ==================================
                // SAVE PRODUCT ID
                // ==================================

                productIdInput.value =
                  selectedProductId;

              }
            );

          }
        );

      } catch (error) {

        console.error(
          "[Customize Products] Failed to load products:",
          error
        );


        productLoading?.classList.add(
          "hidden"
        );


        productList.innerHTML = "";


        productCount.textContent = "";


        productEmpty?.classList.remove(
          "hidden"
        );


        const emptyMessage =
          productEmpty?.querySelector("p");


        if (emptyMessage) {

          emptyMessage.textContent =
            "Unable to load products. Please try again.";

        }

      }

    }
  );

}
