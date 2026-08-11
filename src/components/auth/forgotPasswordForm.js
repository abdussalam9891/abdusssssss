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
            text-[#181818]
          "
        >
          Email Address
        </label>

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
            px-5
            py-4
            text-[15px]
            outline-none
            transition-all
            duration-300
            focus:border-[#A07936]
            focus:ring-4
            focus:ring-[#A07936]/10
          "
        >

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
              text-[#181818]
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
              px-5
              py-4
              text-[15px]
              tracking-[0.3em]
              outline-none
              transition-all
              duration-300
              focus:border-[#A07936]
              focus:ring-4
              focus:ring-[#A07936]/10
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
              text-[#181818]
            "
          >
            New Password
          </label>

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
              px-5
              py-4
              text-[15px]
              outline-none
              transition-all
              duration-300
              focus:border-[#A07936]
              focus:ring-4
              focus:ring-[#A07936]/10
            "
          >

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
              text-[#181818]
            "
          >
            Confirm New Password
          </label>

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
              px-5
              py-4
              text-[15px]
              outline-none
              transition-all
              duration-300
              focus:border-[#A07936]
              focus:ring-4
              focus:ring-[#A07936]/10
            "
          >

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
          bg-[#181818]
          py-4
          text-sm
          font-medium
          uppercase
          tracking-[0.28em]
          text-white
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
            text-[#A07936]
            hover:underline
          "
        >
          Back to Sign In
        </a>

      </div>

    </form>
  `;
}
