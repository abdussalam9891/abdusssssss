import { createGuestMenu } from "./guestMenu.js";
import { createUserMenu } from "./userMenu.js";
 

export function createAccountDropdown(user = getCurrentUser()) {

  const content = user
    ? createUserMenu(user)
    : createGuestMenu();

  return `
    <div
      id="accountDropdown"
      class="
        absolute
        right-0
        top-[calc(100%+18px)]
        z-[120]
        w-[320px]
        overflow-hidden
        rounded-[28px]
        border
        border-[#ECECEC]
        bg-white
        p-7
        shadow-[0_35px_80px_rgba(0,0,0,.15)]
        opacity-0
        invisible
        translate-y-3
        transition-all
        duration-300
        ease-out
      "
    >

      <!-- Arrow -->

      <div
        class="
          absolute
          -top-2
          right-7
          h-4
          w-4
          rotate-45
          border-l
          border-t
          border-[#ECECEC]
          bg-white
        "
      ></div>

      <div class="relative z-10">
        ${content}
      </div>

    </div>
  `;
}
