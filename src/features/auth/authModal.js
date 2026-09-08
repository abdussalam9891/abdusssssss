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

  <style>
    @keyframes authMedallionGlow {
      0%, 100% { box-shadow: 0 0 0 0 rgba(160,121,54,.45); }
      50% { box-shadow: 0 0 0 9px rgba(160,121,54,0); }
    }

    @keyframes authShimmerSweep {
      from { transform: translateX(-120%) skewX(-20deg); }
      to   { transform: translateX(220%) skewX(-20deg); }
    }

    #authModal .auth-medallion {
      animation: authMedallionGlow 2.6s ease-in-out infinite;
    }

    #authModal .auth-shimmer-btn {
      position: relative;
      overflow: hidden;
    }

    #authModal .auth-shimmer-btn::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 30%;
      height: 100%;
      background: linear-gradient(
        120deg,
        transparent,
        rgba(255,255,255,.55),
        transparent
      );
      transform: translateX(-120%) skewX(-20deg);
    }

    #authModal .auth-shimmer-btn:hover::before {
      animation: authShimmerSweep 1.1s ease forwards;
    }
  </style>

  <!-- Overlay -->

  <div
    id="authOverlay"
    class="
      absolute
      inset-0

      bg-black/60

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

      overflow-hidden

      rounded-[28px]

      border
      border-[#E7DCC5]

      bg-white

      opacity-0
      scale-95

      shadow-[0_35px_90px_rgba(0,0,0,.25)]

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

        z-20

        flex
        h-9
        w-9

        items-center
        justify-center

        rounded-full

        bg-black/30

        text-white

        backdrop-blur-sm

        transition

        hover:bg-black/50
      "
    >

      <i
        data-lucide="x"
        class="h-4 w-4"
      ></i>

    </button>

    <!-- Banner -->

    <div
      class="
        relative

        h-[152px]
        w-full

        overflow-hidden
      "
    >

      <img
        src="/src/assets/images/hero1.jpg"
        alt=""
        class="
          h-full
          w-full

          object-cover
          object-[center_35%]
        "
      />

      <div
        class="
          absolute
          inset-0

          bg-gradient-to-t
          from-white
          via-black/10
          to-black/50
        "
      ></div>

    </div>

    <!-- Medallion -->

    <div
      class="
        relative

        -mt-14

        flex

        justify-center
      "
    >

      <div
        class="
          auth-medallion

          flex
          h-[104px]
          w-[104px]

          items-center
          justify-center

          rounded-full
        "
      >

        <i
          id="authModalIcon"

          data-lucide="heart"

          class="
            h-10
            w-10

            text-[#A07936]

            drop-shadow-[0_2px_6px_rgba(0,0,0,.25)]
          "
        ></i>

        <img
          id="authModalIconImg"
          src=""
          alt="Banshiwale"
          class="
            hidden

            h-[92px]
            w-[92px]

            object-contain

            drop-shadow-[0_2px_10px_rgba(0,0,0,.3)]
          "
        />

      </div>

    </div>

    <div
      class="
        px-8
        pb-8
        pt-4
      "
    >

      <!-- Title -->

      <h2
        id="authModalTitle"

        class="
          text-center

          font-serif

          text-[30px]
          leading-tight

          text-[#181818]
        "
      >
      </h2>

      <!-- Ornament divider -->

      <div
        class="
          mt-3

          flex

          items-center
          justify-center

          gap-2
        "
      >

        <span
          class="
            h-px
            w-7

            bg-[#A07936]/50
          "
        ></span>

        <i
          data-lucide="gem"

          class="
            h-3
            w-3

            text-[#A07936]
          "
        ></i>

        <span
          class="
            h-px
            w-7

            bg-[#A07936]/50
          "
        ></span>

      </div>

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
          auth-shimmer-btn

          mt-7

          flex
          h-12
          w-full

          items-center
          justify-center

          rounded-full

          bg-gradient-to-r
          from-[#181818]
          via-[#242424]
          to-[#181818]

          text-[13px]
          font-semibold

          uppercase

          tracking-[0.22em]

          text-white

          transition-all
          duration-300

          hover:-translate-y-0.5
          hover:from-[#A07936]
          hover:via-[#B78D46]
          hover:to-[#8C6A2C]
          hover:shadow-[0_14px_34px_rgba(160,121,54,.45)]
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
