export function createGuestMenu() {
  return `
<div
  class="
    w-[340px]

    overflow-hidden

    rounded-[22px]

    border
    border-[#F3EEE6]

    bg-white

    shadow-[0_20px_50px_rgba(0,0,0,.08)]
  "
>

  <!-- Login -->

  <a

  id="loginBtn"
    href="/pages/login.html"

    class="
      group

      flex

      items-center

      gap-4

      px-6
      py-5

      transition-all
      duration-300

      hover:translate-x-1
    "
  >

    <div
      class="
        flex

        h-11
        w-11

        items-center
        justify-center

        rounded-full

        border
        border-[#ECE6DA]

        text-[#6D6D6D]

        transition-all
        duration-300

        group-hover:border-[#D8BE84]
        group-hover:text-[#A07936]
      "
    >

      <i
        data-lucide="user-round"

        class="
          h-[18px]
          w-[18px]
        "
      ></i>

    </div>

    <div>

      <p
        class="
          text-[17px]

          font-medium

          text-[#181818]
        "
      >
        Log In / Sign Up
      </p>

      <p
        class="
          mt-1

          text-[14px]

          text-[#8A8A8A]
        "
      >
        Access your account
      </p>

    </div>

  </a>

  <!-- Divider -->

  <div
    class="
      mx-6

      h-px

      bg-[#F3EEE6]
    "
  ></div>

  <!-- Contact -->

  <a
    href="/pages/contact.html"

    class="
      group

      flex

      items-center

      gap-4

      px-6
      py-5

      transition-all
      duration-300

      hover:translate-x-1
    "
  >

    <div
      class="
        flex

        h-11
        w-11

        items-center
        justify-center

        rounded-full

        border
        border-[#ECE6DA]

        text-[#6D6D6D]

        transition-all
        duration-300

        group-hover:border-[#D8BE84]
        group-hover:text-[#A07936]
      "
    >

      <i
        data-lucide="headset"

        class="
          h-[18px]
          w-[18px]
        "
      ></i>

    </div>

    <div>

      <p
        class="
          text-[17px]

          font-medium

          text-[#181818]
        "
      >
        Contact Us
      </p>

      <p
        class="
          mt-1

          text-[14px]

          text-[#8A8A8A]
        "
      >
        Need help with an order?
      </p>

    </div>

  </a>

</div>
`;
}
