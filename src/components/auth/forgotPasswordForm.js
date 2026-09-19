export function createForgotPasswordForm() {
  return `
    <form
      id="forgotPasswordForm"
      class="space-y-8"
    >

      <!-- EMAIL STEP -->

      <div id="emailStep">

        <label
          for="email"
          class="
            mb-3
            block
            text-sm
            font-medium
            text-ink
          "
        >
          Email Address
        </label>

        <div class="relative">

          <span class="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-primary">
            <i data-lucide="mail" class="h-4 w-4"></i>
          </span>

          <input
            id="email"
            name="email"
            type="email"
            placeholder="Abc@example.com"
            autocomplete="email"
            required
            class="
              w-full
              rounded-2xl
              border
              border-[#E7E7E7]
              bg-[#FCFBF9]
              py-4
              pl-12
              pr-5
              text-[15px]
              outline-none
              transition-all
              duration-300
              focus:border-primary
              focus:bg-white
              focus:ring-4
              focus:ring-primary/10
            "
          >

        </div>

      </div>


      <!-- OTP + PASSWORD STEP -->

      <div
        id="otpStep"
        class="
          hidden
          space-y-5
        "
      >

        <!-- OTP -->

        <div>

          <label
            for="otp"
            class="
              mb-3
              block
              text-sm
              font-medium
              text-ink
            "
          >
            Verification Code
          </label>

          <input
            id="otp"
            name="otp"
            type="text"
            inputmode="numeric"
            autocomplete="one-time-code"
            maxlength="6"
            placeholder="Enter 6-digit OTP"
            class="
              w-full
              rounded-2xl
              border
              border-[#E7E7E7]
              bg-[#FCFBF9]
              px-5
              py-4
              text-center
              text-[15px]
              tracking-[0.3em]
              outline-none
              transition-all
              duration-300
              focus:border-primary
              focus:bg-white
              focus:ring-4
              focus:ring-primary/10
            "
          >

          <p
            class="
              mt-2
              text-xs
              text-[#888]
            "
          >
            We've sent a verification code to your email.
          </p>

        </div>


        <!-- NEW PASSWORD -->

        <div>

          <label
            for="newPassword"
            class="
              mb-3
              block
              text-sm
              font-medium
              text-ink
            "
          >
            New Password
          </label>

          <div class="relative">

            <span class="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-primary">
              <i data-lucide="lock" class="h-4 w-4"></i>
            </span>

            <input
              id="newPassword"
              name="newPassword"
              type="password"
              autocomplete="new-password"
              placeholder="Enter new password"
              class="
                w-full
                rounded-2xl
                border
                border-[#E7E7E7]
                bg-[#FCFBF9]
                py-4
                pl-12
                pr-5
                text-[15px]
                outline-none
                transition-all
                duration-300
                focus:border-primary
                focus:bg-white
                focus:ring-4
                focus:ring-primary/10
              "
            >

          </div>

        </div>


        <!-- CONFIRM PASSWORD -->

        <div>

          <label
            for="confirmPassword"
            class="
              mb-3
              block
              text-sm
              font-medium
              text-ink
            "
          >
            Confirm New Password
          </label>

          <div class="relative">

            <span class="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-primary">
              <i data-lucide="lock" class="h-4 w-4"></i>
            </span>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autocomplete="new-password"
              placeholder="Confirm new password"
              class="
                w-full
                rounded-2xl
                border
                border-[#E7E7E7]
                bg-[#FCFBF9]
                py-4
                pl-12
                pr-5
                text-[15px]
                outline-none
                transition-all
                duration-300
                focus:border-primary
                focus:bg-white
                focus:ring-4
                focus:ring-primary/10
              "
            >

          </div>

        </div>

      </div>


      <!-- SUBMIT -->

      <button
        id="forgotPasswordSubmitBtn"
        type="submit"
        class="
          group
          relative
          flex
          w-full
          items-center
          justify-center
          overflow-hidden
          rounded-2xl
          bg-ink
          py-4
          text-sm
          font-medium
          uppercase
          tracking-[0.28em]
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
            bg-primary
            transition-transform
            duration-500
            group-hover:scale-x-100
          "
        ></span>

        <span
          id="forgotPasswordSubmitText"
          class="relative z-10"
        >
          Send OTP
        </span>

      </button>


      <!-- BACK TO LOGIN -->

      <div
        class="
          text-center
          text-[15px]
          text-[#666]
        "
      >

        Remember your password?

        <a
          href="/pages/login.html"
          class="
            font-medium
            text-primary
            hover:underline
          "
        >
          Back to Sign In
        </a>

      </div>

    </form>
  `;
}
