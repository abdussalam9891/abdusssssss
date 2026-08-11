import { getProductImages } from "../../utils/getProductImages.js";


export function createCustomizeProductCard(product) {

  const images =
    getProductImages(product);

  const productId =
    product._id || product.id;

  const price =
    product.price != null
      ? `₹${Number(product.price).toLocaleString("en-IN")}`
      : "";


  return `

    <button
      type="button"
      class="
        customize-product-card
        group
        relative
        block
        w-[220px]
        shrink-0
        snap-start
        overflow-hidden
        rounded-2xl
        border
        border-[#E8E0D5]
        bg-white
        text-left
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[#C9A45C]
        hover:shadow-[0_12px_35px_rgba(0,0,0,.08)]
      "
      data-product-id="${productId}"
    >

      <!-- =====================================
           IMAGE
      ====================================== -->

      <div
        class="
          relative
          aspect-square
          overflow-hidden
          bg-[#F7F4EF]
        "
      >

        <!-- Front Image -->

        <img
          src="${images.front}"
          alt="${product.name}"
          loading="lazy"
          class="
            absolute
            inset-0
            h-full
            w-full
            object-contain
            p-5
            transition-all
            duration-500
            group-hover:scale-105
          "
        >


        <!-- Selection Indicator -->

        <span
          class="
            customize-product-check
            absolute
            right-3
            top-3
            hidden
            h-7
            w-7
            items-center
            justify-center
            rounded-full
            bg-[#A07936]
            text-white
            shadow-md
          "
        >

          <i
            data-lucide="check"
            class="h-4 w-4"
          ></i>

        </span>


        <!-- Bottom subtle gradient -->

        <div
          class="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            h-20
            bg-gradient-to-t
            from-white/70
            to-transparent
          "
        ></div>

      </div>


      <!-- =====================================
           PRODUCT INFO
      ====================================== -->

      <div class="p-4">

        <p
          class="
            text-[10px]
            font-medium
            uppercase
            tracking-[0.22em]
            text-[#A07936]
          "
        >
          ${(product.category || "Jewellery").toUpperCase()}
        </p>


        <h3
          class="
            mt-2
            line-clamp-2
            min-h-[42px]
            font-serif
            text-[17px]
            leading-tight
            tracking-[-0.02em]
            text-[#181818]
            transition-colors
            duration-300
            group-hover:text-[#A07936]
          "
        >
          ${product.name}
        </h3>


        ${
          price
            ? `
              <p
                class="
                  mt-3
                  text-[15px]
                  font-semibold
                  tracking-tight
                  text-[#181818]
                "
              >
                ${price}
              </p>
            `
            : ""
        }


        <!-- Select indicator -->

        <div
          class="
            mt-4
            flex
            items-center
            justify-between
            border-t
            border-[#EFE8DE]
            pt-3
          "
        >

          <span
            class="
              text-[10px]
              font-medium
              uppercase
              tracking-[0.16em]
              text-[#888888]
            "
          >
            Select
          </span>


          <span
            class="
              flex
              h-5
              w-5
              items-center
              justify-center
              rounded-full
              border
              border-[#D8CFC2]
              transition-all
              duration-300
              group-hover:border-[#A07936]
            "
          >

            <span
              class="
                customize-product-radio
                hidden
                h-2.5
                w-2.5
                rounded-full
                bg-[#A07936]
              "
            ></span>

          </span>

        </div>

      </div>

    </button>

  `;
}
