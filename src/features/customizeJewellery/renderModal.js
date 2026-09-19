import { createCustomizeJewelleryForm } from "./form.js";

export function createCustomizeJewelleryModal() {
  return `
<div
  id="customizeModal"

  class="
    fixed
    inset-0
    z-[200]

    hidden

    items-center
    justify-center

    p-0
    sm:p-4
    lg:p-6
  "
>

  <!-- ==========================================
       OVERLAY
  =========================================== -->

  <div
    id="customizeOverlay"

    class="
      absolute
      inset-0

      bg-black/70
      backdrop-blur-[6px]

      opacity-0

      transition-opacity
      duration-500
    "
  ></div>



  <!-- ==========================================
       MODAL
  =========================================== -->

  <div
    id="customizePanel"

    class="
      relative
      z-10

      flex
      h-full
      w-full
      max-w-4xl
      flex-col

      overflow-hidden

      rounded-none
      sm:h-auto
      sm:rounded-2xl

      border-0
      sm:border
      border-[#E8DED0]

      bg-[#FDFBF8]

      shadow-[0_30px_100px_rgba(0,0,0,0.30)]

      opacity-0
      scale-100
      sm:scale-[0.96]

      transition-all
      duration-500

      max-h-[100dvh]
      sm:max-h-[92vh]
    "
  >


    <!-- ========================================
         CLOSE BUTTON
    ========================================= -->

    <button
      id="closeCustomizeModal"
      type="button"
      aria-label="Close customization form"

      class="
        absolute
        right-4
        top-4
        z-30

        flex
        h-9
        w-9
        items-center
        justify-center

        rounded-full

        border
        border-white/20

        bg-black/10

        text-white

        backdrop-blur-sm

        transition-all
        duration-300

        hover:bg-white
        hover:text-[#6B1A2A]
      "
    >

      <i
        data-lucide="x"
        class="h-4 w-4"
      ></i>

    </button>



    <!-- ========================================
         HEADER
    ========================================= -->

   <div
  class="
    relative
    shrink-0
    overflow-hidden
    bg-ink
    px-6
    py-7
    sm:px-10
    sm:py-8
    lg:px-14
    lg:py-9
  "
>

      <!-- Subtle decorative glow -->

      <div
        class="
          pointer-events-none
          absolute
          -right-20
          -top-24
          h-48
          w-48
          rounded-full
          bg-primary/10
          blur-3xl
        "
      ></div>


      <div
        class="
          pointer-events-none
          absolute
          -bottom-20
          -left-20
          h-40
          w-40
          rounded-full
          bg-black/10
          blur-3xl
        "
      ></div>


      <!-- Heading -->

      <div
        class="
          relative
          z-10
          pr-8
          text-center
        "
      >




        <h2
  class="
    font-serif
    text-2xl
    font-medium
    leading-tight
    tracking-[-0.02em]
    text-white
    sm:text-3xl
  "
>
  Design Your Piece
</h2>


        <p
          class="
            mx-auto
            mt-2
            max-w-lg
            text-xs
            leading-5
            text-white/70
          "
        >
          Share your vision and our craftsmen will create
          something made exclusively for you.
        </p>

      </div>


      <!-- Gold divider -->

      <div
  class="
    absolute
    bottom-0
    left-0
    right-0
    h-[2px]
    bg-primary
  "
></div>

    </div>



    <!-- ========================================
         FORM AREA
    ========================================= -->

    <div
      class="
        min-h-0
        flex-1
        overflow-y-auto

        bg-[#FCFAF7]

        px-5
        py-6

        sm:px-8
        sm:py-7

        lg:px-12
        lg:py-8
      "
    >

      ${createCustomizeJewelleryForm()}

    </div>

  </div>

</div>
`;
}
