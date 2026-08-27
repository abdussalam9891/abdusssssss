export function createAuthLayout({
  title,
  description,
  eyebrow = "banshiwale",
  form,
}) {
  return `

<section
class="
relative

flex
items-center
justify-center

h-screen

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

  <!-- Decorative Ring -->

  <div
    class="
      pointer-events-none

      absolute

      left-1/2
      -top-40

      h-[420px]
      w-[420px]

      -translate-x-1/2

      rounded-full

      border

      border-[#E8DAC4]

      opacity-40
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

      <div
        class="
          pointer-events-none

          absolute

          right-[-120px]
          bottom-[-120px]

          h-[310px]
          w-[320px]

          rounded-full

          bg-[#E8D2A5]/25

          blur-[120px]
        "
      ></div>

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
        src="/src/assets/images/auth1.jpg"

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

            text-white

            lg:text-[52px]
          "
        >
          Crafted for Every Celebration
        </h2>

        <p
        id="authDescription"
          class="
            mt-6

            max-w-md

            text-[16px]

            leading-8

            text-white/90
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

  p-4

  lg:w-[55%]

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
            py-1

            sm:px-8
          "
        >

          <!-- Back Button -->

          <a

            href="/index.html"

            class="
              mb-2

              inline-flex

              items-center

              gap-2

              rounded-full

              border

              border-[#E8E8E8]

              px-4
              py-2

              text-[13px]

              font-medium

              text-[#666]

              transition-all
              duration-300

              hover:border-[#A07936]

              hover:text-[#A07936]
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

            <div
              class="
                flex

                h-10
                w-10

                items-center
                justify-center

                rounded-full

                border
                border-[#E8D2A5]

                bg-[#FCFBF9]

                shadow-[0_8px_20px_rgba(160,121,54,.18)]
              "
            >

              <img
                src="/src/assets/logo.png"

                alt="banshiwale"

                class="
                  h-6
                  w-6

                  object-contain
                "
              >

            </div>

          </div>

          <!-- Eyebrow -->

          <p
            class="
              mt-2

              text-center

              text-[11px]

              font-semibold

              uppercase

              tracking-[0.35em]

              text-[#A07936]
            "
          >
            ${eyebrow}
          </p>

          <!-- Heading -->

          <h1
            class="
              mt-1

              text-center

              font-serif

              text-[26px]

              tracking-tight

              text-[#181818]
            "
          >

            ${title}

          </h1>

          <!-- Divider -->

          <div
            class="
              mx-auto

              mt-2
              mb-1

              h-[2px]
              w-10

              bg-gradient-to-r
              from-transparent
              via-[#A07936]
              to-transparent
            "
          ></div>

          <p
  class="
    mt-1

    text-center

    text-[13px]

    leading-5

    text-[#7A7A7A]
  "
>
  ${description}
</p>


          <!-- Form -->

          <div class="mt-4">

            ${form}

          </div>

        </div>

      </div>

    </div>

  </div>

</section>

`;
}
