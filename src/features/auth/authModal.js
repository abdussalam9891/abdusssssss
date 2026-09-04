export function createAuthModal() {
  return `
<div
  id="authModal"
  class="
    fixed
    inset-0
    z-[9999]
    hidden
  "
>

  <!-- Overlay -->

  <div
    id="authOverlay"
    class="
      absolute
      inset-0

      bg-black/50

      backdrop-blur-sm

      opacity-0

      transition-all
      duration-300
    "
  ></div>

  <!-- Dialog -->

  <div
    id="authDialog"

    role="dialog"
    aria-modal="true"
    aria-labelledby="authModalTitle"

    class="
      absolute

      left-1/2
      top-1/2

      w-[92%]
      max-w-[410px]

      -translate-x-1/2
      -translate-y-1/2

      rounded-[28px]

      border
      border-[#ECECEC]

      bg-white

      opacity-0
      scale-95

      shadow-[0_35px_90px_rgba(0,0,0,.18)]

      transition-all
      duration-300
      ease-out
    "
  >

    <button
      id="closeAuthModal"

      class="
        absolute

        right-4
        top-4

        flex
        h-9
        w-9

        items-center
        justify-center

        rounded-full

        text-[#999]

        transition

        hover:bg-[#F7F4EF]
        hover:text-[#181818]
      "
    >

      <i
        data-lucide="x"
        class="h-4 w-4"
      ></i>

    </button>

    <div
      class="
        px-8
        py-8
      "
    >

      <!-- Icon -->

      <div
        class="
          mx-auto

          flex
          h-16
          w-16

          items-center
          justify-center

          overflow-hidden

          rounded-full

          bg-[#FAF4E9]
        "
      >

        <i
          id="authModalIcon"

          data-lucide="heart"

          class="
            h-7
            w-7

            text-[#A07936]
          "
        ></i>

        <img
          id="authModalIconImg"
          src=""
          alt="Banshiwale"
          class="
            hidden

            h-full
            w-full

            object-cover
          "
        />

      </div>

      <!-- Title -->

      <h2
        id="authModalTitle"

        class="
          mt-5

          text-center

          font-serif

          text-[30px]

          text-[#181818]
        "
      >
      </h2>

      <!-- Subtitle -->

      <p
        id="authModalSubtitle"

        class="
          mx-auto

          mt-3

          max-w-[290px]

          text-center

          text-[14px]

          leading-7

          text-[#666]
        "
      >
      </p>

            <!-- Primary CTA -->

      <a
        id="authPrimaryButton"

        href="/pages/login.html"

        class="
          mt-7

          flex
          h-12
          w-full

          items-center
          justify-center

          rounded-full

          bg-[#181818]

          text-[13px]
          font-semibold

          uppercase

          tracking-[0.22em]

          text-white

          transition-all
          duration-300

          hover:-translate-y-0.5
          hover:bg-[#A07936]
          hover:shadow-[0_12px_30px_rgba(160,121,54,.18)]
        "
      >
        Sign In
      </a>

      <!-- Secondary -->

      <a
        id="authSecondaryButton"

        href="/pages/register.html"

        class="
          mt-4

          block

          text-center

          text-[14px]
          font-medium

          text-[#181818]

          transition-colors
          duration-300

          hover:text-[#A07936]
        "
      >
        Create Account
      </a>

      <!-- Maybe Later -->

      <button
        id="dismissAuthModal"

        class="
          mx-auto

          mt-5

          flex
          items-center

          gap-2

          text-[13px]

          text-[#8B8B8B]

          transition-colors
          duration-300

          hover:text-[#A07936]
        "
      >

        <span>
          Maybe Later
        </span>

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

      </button>

    </div>

  </div>

</div>
`;
}
