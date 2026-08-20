 

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

      <div class="px-5 py-5">

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

      <div class="py-2">

        <a
          href="/pages/profile.html"
          class="
            group
            flex
            items-center
            gap-3
            px-5
            py-3
            text-[14px]
            text-[#55514B]
            transition-colors
            duration-200
            hover:bg-[#FCFAF7]
            hover:text-[#A07936]
          "
        >
          <i
            data-lucide="user-round"
            class="
              h-[17px]
              w-[17px]
              text-[#99938B]
              transition-colors
              group-hover:text-[#A07936]
            "
          ></i>

          <span>My Profile</span>

          <i
            data-lucide="chevron-right"
            class="
              ml-auto
              h-4
              w-4
              text-[#C8C1B7]
              transition-transform
              duration-200
              group-hover:translate-x-1
              group-hover:text-[#A07936]
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
            px-5
            py-3
            text-[14px]
            text-[#55514B]
            transition-colors
            duration-200
            hover:bg-[#FCFAF7]
            hover:text-[#A07936]
          "
        >
          <i
            data-lucide="package"
            class="
              h-[17px]
              w-[17px]
              text-[#99938B]
              transition-colors
              group-hover:text-[#A07936]
            "
          ></i>

          <span>Orders</span>

          <i
            data-lucide="chevron-right"
            class="
              ml-auto
              h-4
              w-4
              text-[#C8C1B7]
              transition-transform
              duration-200
              group-hover:translate-x-1
              group-hover:text-[#A07936]
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
            px-5
            py-3
            text-[14px]
            text-[#55514B]
            transition-colors
            duration-200
            hover:bg-[#FCFAF7]
            hover:text-[#A07936]
          "
        >
          <i
            data-lucide="heart"
            class="
              h-[17px]
              w-[17px]
              text-[#99938B]
              transition-colors
              group-hover:text-[#A07936]
            "
          ></i>

          <span>Wishlist</span>

          <i
            data-lucide="chevron-right"
            class="
              ml-auto
              h-4
              w-4
              text-[#C8C1B7]
              transition-transform
              duration-200
              group-hover:translate-x-1
              group-hover:text-[#A07936]
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
            px-5
            py-3
            text-[14px]
            text-[#55514B]
            transition-colors
            duration-200
            hover:bg-[#FCFAF7]
            hover:text-[#A07936]
          "
        >
          <i
            data-lucide="sparkles"
            class="
              h-[17px]
              w-[17px]
              text-[#99938B]
              transition-colors
              group-hover:text-[#A07936]
            "
          ></i>

          <span>Custom Jewellery</span>

          <i
            data-lucide="chevron-right"
            class="
              ml-auto
              h-4
              w-4
              text-[#C8C1B7]
              transition-transform
              duration-200
              group-hover:translate-x-1
              group-hover:text-[#A07936]
            "
          ></i>
        </a>

      </div>


      <!-- LOGOUT -->

      <div class="px-5 pb-5 pt-2">

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
            border-[#E8E1D8]
            py-2.5
            text-[13px]
            font-medium
            text-[#6D6861]
            transition-all
            duration-300
            hover:border-[#181818]
            hover:bg-[#181818]
            hover:text-white
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
