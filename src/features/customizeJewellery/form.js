export function createCustomizeJewelleryForm() {
  return `
<form
  id="customJewelleryForm"
  class="space-y-7"
>

  <!-- PRODUCT ID -->
  <input
    type="hidden"
    id="productId"
    name="productId"
    value=""
  >


  <!-- ==========================================
       BASIC INFORMATION
  =========================================== -->

  <section>

    <div class="mb-5">
      <h3
        class="
          font-serif
          text-2xl
          font-medium
          tracking-[-0.02em]
          text-[#181818]
        "
      >
        Your Details
      </h3>

      <div
        class="
          mt-2
          h-px
          w-10
          bg-[#A07936]
        "
      ></div>
    </div>


    <div
      class="
        grid
        gap-4
        md:grid-cols-2
      "
    >

      <!-- FULL NAME -->

      <div>

        <label
          for="customerName"
          class="
            mb-2
            block
            text-[13px]
            font-medium
            tracking-wide
            text-[#3A3632]
          "
        >
          Full Name
          <span class="text-[#A07936]">*</span>
        </label>

        <input
          id="customerName"
          name="fullName"
          type="text"
          autocomplete="name"
          placeholder="Enter your name"
          required
          class="
            h-12
            w-full
            rounded-lg
            border
            border-[#DED8D0]
            bg-white
            px-4
            text-sm
            text-[#181818]
            outline-none
            transition-all
            duration-300

            placeholder:text-[#A7A19A]

            hover:border-[#C8B99F]

            focus:border-[#A07936]
            focus:ring-2
            focus:ring-[#A07936]/10
          "
        >

      </div>


      <!-- PHONE -->

      <div>

        <label
          for="customerPhone"
          class="
            mb-2
            block
            text-[13px]
            font-medium
            tracking-wide
            text-[#3A3632]
          "
        >
          Phone Number
          <span class="text-[#A07936]">*</span>
        </label>

        <input
          id="customerPhone"
          name="phone"
          type="tel"
          autocomplete="tel"
          inputmode="numeric"
          placeholder="10-digit mobile number"
          required
          class="
            h-12
            w-full
            rounded-lg
            border
            border-[#DED8D0]
            bg-white
            px-4
            text-sm
            text-[#181818]
            outline-none
            transition-all
            duration-300

            placeholder:text-[#A7A19A]

            hover:border-[#C8B99F]

            focus:border-[#A07936]
            focus:ring-2
            focus:ring-[#A07936]/10
          "
        >

      </div>


      <!-- EMAIL -->

      <div>

        <label
          for="customerEmail"
          class="
            mb-2
            block
            text-[13px]
            font-medium
            tracking-wide
            text-[#3A3632]
          "
        >
          Email Address
          <span class="text-[#A07936]">*</span>
        </label>

        <input
          id="customerEmail"
          name="email"
          type="email"
          autocomplete="email"
          placeholder="you@example.com"
          required
          class="
            h-12
            w-full
            rounded-lg
            border
            border-[#DED8D0]
            bg-white
            px-4
            text-sm
            text-[#181818]
            outline-none
            transition-all
            duration-300

            placeholder:text-[#A7A19A]

            hover:border-[#C8B99F]

            focus:border-[#A07936]
            focus:ring-2
            focus:ring-[#A07936]/10
          "
        >

      </div>


      <!-- JEWELLERY TYPE -->

      <div>

        <label
          for="jewelleryType"
          class="
            mb-2
            block
            text-[13px]
            font-medium
            tracking-wide
            text-[#3A3632]
          "
        >
          Jewellery Type
          <span class="text-[#A07936]">*</span>
        </label>

        <select
          id="jewelleryType"
          name="category"
          required
          class="
            h-12
            w-full
            cursor-pointer
            appearance-none
            rounded-lg
            border
            border-[#DED8D0]
            bg-white
            px-4
            text-sm
            text-[#181818]
            outline-none
            transition-all
            duration-300

            hover:border-[#C8B99F]

            focus:border-[#A07936]
            focus:ring-2
            focus:ring-[#A07936]/10
          "
        >

          <option value="">
            Select jewellery type
          </option>

          <option value="Ring">
            Ring
          </option>

          <option value="Chain">
            Chain
          </option>

          <option value="Bracelet">
            Bracelet
          </option>

          <option value="Pendant">
            Pendant
          </option>

          <option value="Earrings">
            Earrings
          </option>

        </select>

      </div>

       </div>


    <!-- ==========================================
         PRODUCT SELECTION
    =========================================== -->

    <div
      id="customizeProductSection"
      class="
        mt-6
        hidden
      "
    >

      <div
        class="
          mb-3
          flex
          items-end
          justify-between
        "
      >

        <div>

          <h4
            class="
              text-[13px]
              font-medium
              tracking-wide
              text-[#3A3632]
            "
          >
            Select Product
            <span class="text-[#A07936]">*</span>
          </h4>

          <p
            class="
              mt-1
              text-[11px]
              text-[#96908A]
            "
          >
            Choose the piece you would like to customize.
          </p>

        </div>


        <span
          id="customizeProductCount"
          class="
            text-[11px]
            text-[#96908A]
          "
        ></span>

      </div>


      <!-- ========================================
           HORIZONTAL PRODUCT SCROLLER
      ========================================= -->

      <div
        id="customizeProductList"
        class="
          flex
          gap-4
          overflow-x-auto
          pb-4
          snap-x
          snap-mandatory
          scroll-smooth

          [&::-webkit-scrollbar]:h-1.5
          [&::-webkit-scrollbar-track]:bg-[#F1ECE5]
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-[#A07936]
        "
      ></div>


      <!-- Loading -->

      <div
        id="customizeProductLoading"
        class="
          hidden
          py-8
          text-center
        "
      >

        <span
          class="
            text-xs
            text-[#8A847D]
          "
        >
          Loading products...
        </span>

      </div>


      <!-- Empty State -->

      <div
        id="customizeProductEmpty"
        class="
          hidden
          rounded-lg
          border
          border-[#E8DED0]
          bg-[#FBF9F6]
          px-5
          py-7
          text-center
        "
      >

        <p
          class="
            text-sm
            text-[#6F6962]
          "
        >
          No products are available in this category.
        </p>

      </div>

    </div>

  </section>



  <!-- ==========================================
       DESIGN DETAILS
  =========================================== -->

  <section>

    <div class="mb-5">

      <h3
        class="
          font-serif
          text-2xl
          font-medium
          tracking-[-0.02em]
          text-[#181818]
        "
      >
        Design Details
      </h3>

      <div
        class="
          mt-2
          h-px
          w-10
          bg-[#A07936]
        "
      ></div>

    </div>


    <!-- DESCRIPTION -->

    <div>

      <label
        for="designDescription"
        class="
          mb-2
          block
          text-[13px]
          font-medium
          tracking-wide
          text-[#3A3632]
        "
      >
        Tell Us About Your Vision
      </label>

      <textarea
        id="designDescription"
        name="description"
        rows="4"
        maxlength="2000"
        placeholder="Describe your preferred style, gemstone, engraving, finish, size, or anything you'd like our craftsmen to know."
        class="
          w-full
          resize-none
          rounded-lg
          border
          border-[#DED8D0]
          bg-white
          px-4
          py-3.5
          text-sm
          leading-6
          text-[#181818]
          outline-none
          transition-all
          duration-300

          placeholder:text-[#A7A19A]

          hover:border-[#C8B99F]

          focus:border-[#A07936]
          focus:ring-2
          focus:ring-[#A07936]/10
        "
      ></textarea>

    </div>


    <!-- IMAGE UPLOAD -->

   <div class="mt-5">

  <div
    class="
      mb-2
      flex
      items-center
      justify-between
    "
  >

    <label
      class="
        text-[13px]
        font-medium
        tracking-wide
        text-[#3A3632]
      "
    >
      Inspiration Images
    </label>

    <span
      class="
        text-[11px]
        text-[#96908A]
      "
    >
      Optional
    </span>

  </div>


  <label
    for="referenceImage"
    class="
      flex
      min-h-[92px]
      cursor-pointer
      items-center
      justify-center
      gap-4
      rounded-lg
      border
      border-dashed
      border-[#D4CCC1]
      bg-[#FBF9F6]
      px-5
      py-5
      text-center
      transition-all
      duration-300
      hover:border-[#A07936]
      hover:bg-[#FCF8F1]
    "
  >

    <div
      class="
        flex
        h-10
        w-10
        shrink-0
        items-center
        justify-center
        rounded-full
        bg-[#F1E8DA]
        text-[#A07936]
      "
    >
      <i
        data-lucide="upload-cloud"
        class="h-5 w-5"
      ></i>
    </div>


    <div class="text-left">

      <p
        class="
          text-sm
          font-medium
          text-[#181818]
        "
      >
        Upload inspiration photos
      </p>

      <p
        class="
          mt-1
          text-xs
          text-[#8A847D]
        "
      >
        JPG, PNG or WEBP
      </p>

    </div>


    <input
      id="referenceImage"
      name="referenceImage"
      type="file"
      accept="image/jpeg,image/png,image/webp"

      class="hidden"
    >

  </label>


  <!-- SELECTED IMAGE PREVIEWS -->

  <div
    id="referenceImagesPreview"
    class="
  mt-3
  hidden
  grid
  grid-cols-3
  gap-2
  sm:grid-cols-5
"
  ></div>


</div>

  </section>



  <!-- ==========================================
       CTA
  =========================================== -->

  <div class="pt-1">

    <button
      type="submit"
      class="
        group
        relative
        flex
        h-12
        w-full
        items-center
        justify-center
        overflow-hidden
        rounded-lg
        bg-[#181818]
        px-8
        text-[12px]
        font-medium
        uppercase
        tracking-[0.22em]
        text-white
        shadow-sm
        transition-all
        duration-300

       hover:bg-[#A07936]
        hover:shadow-md
      "
    >

      <span
        class="
          absolute
          inset-0
          origin-left
          scale-x-0
          bg-[#A07936]
          transition-transform
          duration-500
          ease-[cubic-bezier(0.22,1,0.36,1)]

          group-hover:scale-x-100
        "
      ></span>


      <span
        class="
          relative
          z-10
          flex
          items-center
          gap-2
        "
      >

        Request Consultation

        <i
          data-lucide="arrow-right"
          class="
            h-4
            w-4
            transition-transform
            duration-300
            group-hover:translate-x-1
          "
        ></i>

      </span>

    </button>

  </div>

</form>
`;
}
