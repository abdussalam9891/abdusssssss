

export function createLoginForm() {
  return `
<form
  id="loginForm"

  class="
    space-y-3
  "
>

  <!-- Email -->

  <div class="relative">

    <span
      class="
        pointer-events-none

        absolute
        left-4
        top-1/2

        -translate-y-1/2

        text-[#A07936]
      "
    >

      <i
        data-lucide="mail"
        class="h-4 w-4"
      ></i>

    </span>

    <input
      id="email"
      name="email"

      type="email"

      placeholder="Email Address *"

      autocomplete="email"

      class="
        h-10
        w-full

        rounded-2xl

        border
        border-[#E7E7E7]

        bg-[#FCFBF9]

        pl-11
        pr-4

        text-[14px]

        placeholder:text-[#999]

        outline-none

        transition-all
        duration-300

        focus:border-[#A07936]
        focus:bg-white
        focus:ring-4
        focus:ring-[#A07936]/10
      "
    >

  </div>

  <!-- Password -->

  <div>

    <div
      class="
        mb-1

        flex
        items-center
        justify-end
      "
    >

      <a
        href="/pages/forgotPassword.html"

        class="
          text-[13px]

          text-[#A07936]

          transition

          hover:underline
        "
      >
        Forgot Password?
      </a>

    </div>

    <div class="relative">

      <span
        class="
          pointer-events-none

          absolute
          left-4
          top-1/2

          -translate-y-1/2

          text-[#A07936]
        "
      >

        <i
          data-lucide="lock"
          class="h-4 w-4"
        ></i>

      </span>

      <input


        name="password"

        type="password"

        placeholder="Password *"

        autocomplete="current-password"

        class="
        password-input
          h-10
          w-full

          rounded-2xl

          border
          border-[#E7E7E7]

          bg-[#FCFBF9]

          pl-11
          pr-11

          text-[14px]

          placeholder:text-[#999]

          outline-none

          transition-all
          duration-300

          focus:border-[#A07936]
          focus:bg-white
          focus:ring-4
          focus:ring-[#A07936]/10
        "
      >

      <button



        type="button"

        class="
        password-toggle
          absolute
          right-3
          top-1/2

          -translate-y-1/2

          text-[#888]

          transition

          hover:text-[#A07936]
        "
      >

        <i
          data-lucide="eye"
          class="h-4 w-4"
        ></i>

      </button>

    </div>

  </div>

    <!-- Remember -->

  <label
    class="
      flex
      items-center
      gap-2

      text-[13px]

      text-[#666]
    "
  >

    <input
      type="checkbox"

      class="
        h-4
        w-4

        accent-[#A07936]
      "
    >

    Remember Me

  </label>

  <!-- Button -->

  <button

    type="submit"

    class="
      group

      relative

      flex

      h-10
      w-full

      items-center
      justify-center

      overflow-hidden

      rounded-2xl

      bg-[#181818]

      text-[13px]
      font-medium

      uppercase

      tracking-[0.18em]

      text-white

      shadow-[0_10px_26px_rgba(24,24,24,.22)]

      transition-shadow
      duration-300

      hover:shadow-[0_14px_32px_rgba(160,121,54,.28)]
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

        group-hover:scale-x-100
      "
    ></span>

    <span
      class="
        relative
        z-10
      "
    >
      Sign In
    </span>

  </button>

  <!-- Divider -->

  <div
    class="
      mt-5

      flex
      items-center

      gap-3
    "
  >

    <span class="h-px flex-1 bg-[#ECECEC]"></span>

    <span
      class="
        text-[11px]

        uppercase

        tracking-[0.2em]

        text-[#999]
      "
    >
      Or continue with
    </span>

    <span class="h-px flex-1 bg-[#ECECEC]"></span>

  </div>

<!-- Google -->

<button
  id="googleLoginBtn"
  type="button"
  class="
    group

    flex
    h-10
    w-full

    items-center
    justify-center

    gap-3

    rounded-2xl

    border
    border-[#E8E8E8]

    bg-white

    transition-all
    duration-300

    hover:border-[#A07936]
    hover:-translate-y-0.5
    hover:shadow-lg
  "
>

  <svg
    class="h-4 w-4"
    viewBox="0 0 48 48"
  >

    <path
      fill="#FFC107"
      d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"
    />

    <path
      fill="#FF3D00"
      d="M6.3 14.7l6.6 4.8C14.7 15 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
    />

    <path
      fill="#4CAF50"
      d="M24 44c5.2 0 10-2 13.6-5.3l-6.3-5.3C29.3 35.4 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8H6.2C9.5 39.5 16.1 44 24 44z"
    />

    <path
      fill="#1976D2"
      d="M43.6 20.5H42V20H24v8h11.3c-1.1 3-3.2 5.4-6 6.9l6.3 5.3C39.2 37.2 44 31.2 44 24c0-1.3-.1-2.3-.4-3.5z"
    />

  </svg>

  <span
    class="
      text-[14px]
      font-medium

      text-[#181818]

      transition-colors
      duration-300

      group-hover:text-[#A07936]
    "
  >
    Continue with Google
  </span>

</button>

  <!-- Register -->

  <p
    class="
      text-center

      text-[13px]

      text-[#666]
    "
  >

      Don't have an account?

    <a

      href="/pages/register.html"

      class="
        font-medium

        text-[#A07936]

        transition

        hover:underline
      "
    >
      Create an Account
    </a>

  </p>

</form>
`;
}
