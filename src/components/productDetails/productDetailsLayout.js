import { createRelatedProductsSection } from "./relatedProductsSection.js";
import { createStickyActionBar } from "./stickyActionBar.js";
import { createProductLightbox } from "./productLightbox.js";
import { createRecentlyViewedSection } from "./recentlyViewedSection.js";
import { createReviewsSection } from "./reviewsSection.js";
import { createReviewModal } from "./reviewModal.js";


export function createProductDetailsLayout(product) {
  return `

<section
  class="
    pt-28
    pb-24

    sm:pt-32

    lg:pt-40
  "
>

  <div
    class="
      mx-auto

      max-w-[1600px]

      px-4
      sm:px-6
      lg:px-8
      xl:px-10
    "
  >

    <!-- Main Product Section -->

    <div
      class="
        grid

        grid-cols-1

        gap-8

        sm:gap-10

        lg:grid-cols-[1.05fr_0.95fr]
        lg:gap-20

        xl:gap-24
      "
    >

      <!-- ====================================== -->
      <!-- LEFT: STICKY PRODUCT GALLERY            -->
      <!-- ====================================== -->

      <div
        id="productGallery"

        class="
          lg:sticky
          lg:top-32

          lg:self-start
        "
      ></div>


      <!-- ====================================== -->
      <!-- RIGHT: PURCHASE INFORMATION             -->
      <!-- ====================================== -->

      <div id="productInfo"></div>

    </div>

  </div>

</section>


<!-- Reviews -->

${createReviewsSection(product)}

${createReviewModal()}


<!-- Related Products -->

${createRelatedProductsSection()}


<!-- Recently Viewed -->

${createRecentlyViewedSection()}


<!-- Sticky Action Bar (mobile) -->

${createStickyActionBar(product)}


<!-- Product Lightbox -->

${createProductLightbox(product)}

`;
}
