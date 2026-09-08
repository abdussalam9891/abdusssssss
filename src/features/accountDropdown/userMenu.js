

export function createUserMenu(user) {
  const fullName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    user?.fullName ||
    user?.name ||
    "My Account";

  const initial = fullName.charAt(0).toUpperCase();

  return `
    <div
      class="
        overflow-hidden
        rounded-[22px]
        border
        border-[#F3EEE6]
        bg-white
        shadow-[0_20px_50px_rgba(0,0,0,.08)]
      "
    >

      <!-- USER HEADER -->

      <div class="px-5 pb-4 pt-4">

        <div class="flex items-center gap-4">

          <div
            class="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#FAF7F1]
              text-[16px]
              font-medium
              text-[#A07936]
            "
          >
            ${initial}
          </div>

          <div class="min-w-0">

            <p
              class="
                text-[11px]
                uppercase
                tracking-[0.2em]
                text-[#A07936]
              "
            >
              Welcome Back
            </p>

            <h3
              class="
                mt-1
                truncate
                text-[17px]
                font-medium
                text-[#181818]
              "
            >
              ${fullName}
            </h3>

          </div>

        </div>

      </div>


      <!-- DIVIDER -->

      <div class="mx-5 h-px bg-[#F3EEE6]"></div>


      <!-- ACCOUNT LINKS -->

      <div class="space-y-1 px-2.5 py-1.5">

        <a
          href="/pages/profile.html"
          class="
            group
            flex
            items-center
            gap-3
            rounded-2xl
            px-3
            py-2.5
            text-[14px]
            font-medium
            text-[#55514B]
            transition-all
            duration-300
            hover:bg-[#A07936]
            hover:text-white
            hover:shadow-[0_10px_24px_rgba(160,121,54,0.28)]
          "
        >
          <span
            class="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#FAF7F1]
              text-[#A07936]
              transition-all
              duration-300
              group-hover:bg-white/20
              group-hover:text-white
            "
          >
            <i data-lucide="user-round" class="h-[16px] w-[16px]"></i>
          </span>

          <span>My Profile</span>

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
              group-hover:text-white
            "
          ></i>
        </a>


        <a
          href="/pages/orders.html"
          class="
            group
            flex
            items-center
            gap-3
            rounded-2xl
            px-3
            py-2.5
            text-[14px]
            font-medium
            text-[#55514B]
            transition-all
            duration-300
            hover:bg-[#A07936]
            hover:text-white
            hover:shadow-[0_10px_24px_rgba(160,121,54,0.28)]
          "
        >
          <span
            class="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#FAF7F1]
              text-[#A07936]
              transition-all
              duration-300
              group-hover:bg-white/20
              group-hover:text-white
            "
          >
            <i data-lucide="package" class="h-[16px] w-[16px]"></i>
          </span>

          <span>Orders</span>

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
              group-hover:text-white
            "
          ></i>
        </a>


        <a
          href="/pages/wishlist.html"
          class="
            group
            flex
            items-center
            gap-3
            rounded-2xl
            px-3
            py-2.5
            text-[14px]
            font-medium
            text-[#55514B]
            transition-all
            duration-300
            hover:bg-[#A07936]
            hover:text-white
            hover:shadow-[0_10px_24px_rgba(160,121,54,0.28)]
          "
        >
          <span
            class="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#FAF7F1]
              text-[#A07936]
              transition-all
              duration-300
              group-hover:bg-white/20
              group-hover:text-white
            "
          >
            <i data-lucide="heart" class="h-[16px] w-[16px]"></i>
          </span>

          <span>Wishlist</span>

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
              group-hover:text-white
            "
          ></i>
        </a>


        <a
          href="/index.html#customize-jewellery"
          class="
            js-open-customize-modal
            group
            flex
            items-center
            gap-3
            rounded-2xl
            px-3
            py-2.5
            text-[14px]
            font-medium
            text-[#55514B]
            transition-all
            duration-300
            hover:bg-[#A07936]
            hover:text-white
            hover:shadow-[0_10px_24px_rgba(160,121,54,0.28)]
          "
        >
          <span
            class="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#FAF7F1]
              text-[#A07936]
              transition-all
              duration-300
              group-hover:bg-white/20
              group-hover:text-white
            "
          >
            <i data-lucide="sparkles" class="h-[16px] w-[16px]"></i>
          </span>

          <span>Custom Jewellery</span>

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
              group-hover:text-white
            "
          ></i>
        </a>

      </div>


      <!-- LOGOUT -->

      <div class="px-5 pb-4 pt-2">

        <button
          id="logoutBtn"
          type="button"
          class="
            group
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-full
            border
            border-[#181818]
            bg-[#181818]
            py-2.5
            text-[13px]
            font-medium
            text-white
            transition-all
            duration-300
            hover:border-[#A07936]
            hover:bg-[#A07936]
          "
        >
          <i
            data-lucide="log-out"
            class="h-[15px] w-[15px]"
          ></i>

          Sign Out
        </button>

      </div>

    </div>
  `;
}
