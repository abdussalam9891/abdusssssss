export function createAuthLayout({
  title,
  description,
  form,
}) {
  return `

<section
class="
relative

flex
items-center
justify-center

h-[100dvh]

overflow-hidden

bg-[#FCFBF9]

p-2

lg:p-4
"
>

  <!-- Background Glow -->

  <div
    class="
      pointer-events-none

      absolute
      inset-0

      bg-[radial-gradient(circle_at_top,#F8F2E8_0%,transparent_55%)]
    "
  ></div>





  <!-- Main Wrapper -->

  <div
    class="
      relative
      z-10

      animate-authFade

      mx-auto

      flex

      h-full
      max-h-full

      w-full
      max-w-7xl

      overflow-hidden

      rounded-[32px]

      border
      border-[#ECECEC]

      bg-white

      shadow-[0_30px_90px_rgba(24,24,24,.12)]
    "
  >

    <!-- Gold Hairline Accent -->

    <div
      class="
        pointer-events-none

        absolute
        inset-x-0
        top-0
        z-20

        h-[2px]

        bg-gradient-to-r
        from-transparent
        via-[#C6A153]
        to-transparent
      "
    ></div>

    <!-- LEFT SHOWCASE -->

    <div
      class="
        relative

        hidden

        lg:flex

        w-[45%]

        flex-col
        justify-end

        overflow-hidden
      "
    >

      <!-- Ambient Glow -->



      <!-- Brand Monogram -->

      <div
        class="
          pointer-events-none

          absolute

          top-0
          right-[-30px]

          font-serif

          text-[220px]

          font-bold

          leading-none

          text-white/5

          select-none
        "
      >
        B
      </div>

      <!-- Background Image -->

      <img
        src="/src/assets/images/sterlingsilver.jpeg"

        alt="Luxury Jewellery"

        loading="lazy"

        class="
          absolute
          inset-0

          h-full
          w-full

          object-cover

          scale-110

          animate-authZoom
        "
      >

      <!-- Glass Texture -->

      <div
        class="
          absolute
          inset-0

          bg-[linear-gradient(135deg,rgba(255,255,255,.10),transparent_45%,rgba(255,255,255,.05))]
        "
      ></div>

      <!-- Dark Overlay -->

      <div
        class="
          absolute
          inset-0

          bg-gradient-to-t

          from-black/80

          via-black/30

          to-transparent
        "
      ></div>

      <!-- Bottom Gradient -->

      <div
        class="
          absolute

          bottom-0
          left-0

          h-[55%]
          w-full

          bg-gradient-to-t

          from-black/70

          to-transparent
        "
      ></div>

      <!-- Content -->

      <div
        class="
          relative

          z-10

          px-14
          pb-12
          pt-16
        "
      >



        <h2
        id="authHeading"
          class="
            max-w-sm

            font-serif

            text-[50px]

            tracking-[-0.03em]

            leading-tight

            text-[#F9F4E9]

            drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)]

            lg:text-[52px]
          "
        >
          Crafted for Every Celebration
        </h2>

        <div
          class="
            mt-5

            h-[2px]
            w-14

            bg-gradient-to-r
            from-[#D8B677]
            to-transparent
          "
        ></div>

        <p
        id="authDescription"
          class="
            mt-5

            max-w-md

            text-[16px]

            font-light

            leading-8

            tracking-wide

            text-[#EDE4D2]/85
          "
        >
          Join banshiwale to save your wishlist, track your orders,
          manage your account, and enjoy a seamless shopping experience.
        </p>





      </div>

    </div>



        <!-- ========================================= -->

    <!-- RIGHT SIDE -->

    <!-- ========================================= -->

    <div
      class="
  flex

  h-full
  max-h-full
  w-full

  items-center
  justify-center

  overflow-y-auto

  bg-[#FCFBF9]

  p-2

  lg:w-[55%]

  lg:p-4

  border-l
  border-[#ECE4D8]
"
    >

      <!-- Login Card -->

      <div
        class="
          w-full
          max-w-[500px]"
      >

        <div
          class="
            px-6
            pt-0
            pb-1

            sm:px-8
          "
        >

          <!-- Back Button -->

          <a

            href="/index.html"

            class="
              mb-0

              inline-flex

              items-center

              gap-2

              rounded-full

              border

              border-[#E8E8E8]

              px-3
              py-1.5

              text-[13px]

              lg:px-4
              lg:py-2

              font-medium

              text-[#666]

              transition-all
              duration-300

              hover:border-primary

              hover:text-primary
            "
          >

            <svg
              xmlns="http://www.w3.org/2000/svg"

              fill="none"

              viewBox="0 0 24 24"

              stroke="currentColor"

              class="h-4 w-4"
            >

              <path

                stroke-linecap="round"

                stroke-linejoin="round"

                stroke-width="2"

                d="M15 19l-7-7 7-7"

              />

            </svg>

            Back to Home

          </a>

          <!-- Brand Mark -->

          <div
            class="
              flex

              items-center
              justify-center
            "
          >

            <picture>
              <source srcset="/src/assets/logo.webp" type="image/webp">
              <img
                src="/src/assets/logo.png"

                alt="banshiwale"

                class="
                 h-28
    w-28

    sm:h-28
    sm:w-28

    lg:h-28
    lg:w-28

      object-contain
                "
              >
            </picture>

          </div>

          <!-- Heading -->

          <h1
            class="
              mt-1

              text-center

              font-serif

              text-[26px]

              tracking-tight

              text-ink
            "
          >

            ${title}

          </h1>

          ${
            description
              ? `<p
  class="
    mt-3

    text-center

    text-[13px]

    leading-5

    text-[#7A7A7A]
  "
>
  ${description}
</p>`
              : ""
          }


          <!-- Form -->

          <div class="mt-1">

            ${form}

          </div>

        </div>

      </div>

    </div>

  </div>

</section>

`;
}
