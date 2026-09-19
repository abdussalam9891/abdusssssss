export function createGuestMenu() {
  return `
    <div class="
      overflow-hidden
      rounded-[22px]
      border border-[#F3EEE6]
      bg-white
      shadow-[0_20px_50px_rgba(0,0,0,.08)]
    ">

      <!-- LOGIN -->
      <a
        id="loginBtn"
        href="/pages/login.html"
        class="
          group
          flex
          items-center
          gap-4
          px-5
          py-4
          transition-all
          duration-300
          hover:bg-[#FCFAF7]
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
            bg-[#FAF7F1]
            text-primary
            transition-all
            duration-300
            group-hover:bg-[#F3EBDD]
          "
        >
          <i
            data-lucide="user-round"
            class="h-[17px] w-[17px]"
          ></i>
        </div>

        <div class="min-w-0">
          <p
            class="
              text-[15px]
              font-medium
              leading-none
              text-ink
            "
          >
            Log In / Sign Up
          </p>

          <p
            class="
              mt-1.5
              text-[12px]
              leading-none
              text-[#99938B]
            "
          >
            Access your account
          </p>
        </div>

        <i
          data-lucide="chevron-right"
          class="
            ml-auto
            h-4
            w-4
            text-[#C8C1B7]
            transition-transform
            duration-300
            group-hover:translate-x-1
            group-hover:text-primary
          "
        ></i>
      </a>

      <!-- DIVIDER -->
      <div class="mx-5 h-px bg-[#F3EEE6]"></div>

      <!-- CONTACT -->
      <a
        href="/pages/contact.html"
        class="
          group
          flex
          items-center
          gap-4
          px-5
          py-4
          transition-all
          duration-300
          hover:bg-[#FCFAF7]
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
            bg-[#FAF7F1]
            text-primary
            transition-all
            duration-300
            group-hover:bg-[#F3EBDD]
          "
        >
          <i
            data-lucide="headset"
            class="h-[17px] w-[17px]"
          ></i>
        </div>

        <div class="min-w-0">
          <p
            class="
              text-[15px]
              font-medium
              leading-none
              text-ink
            "
          >
            Contact Us
          </p>

          <p
            class="
              mt-1.5
              text-[12px]
              leading-none
              text-[#99938B]
            "
          >
            Need help with an order?
          </p>
        </div>

        <i
          data-lucide="chevron-right"
          class="
            ml-auto
            h-4
            w-4
            text-[#C8C1B7]
            transition-transform
            duration-300
            group-hover:translate-x-1
            group-hover:text-primary
          "
        ></i>
      </a>

    </div>
  `;
}
