import { escapeHtml } from "../../utils/format.js";
import { icon } from "../../utils/icon.js";


/*
 * Only stats/actions backed by real, already-fetched data are
 * shown here (wishlist + cart counts) — no invented "Total
 * Orders" card, since there is no orders API to back it.
 */

function createStatCard({ label, count, iconName }) {

  return `
<div
  class="
    flex
    items-center
    justify-between

    rounded-[24px]

    border
    border-[#F3EEE6]

    bg-white

    p-6
  "
>

  <div>

    <p
      class="
        text-[13px]

        text-[#8A8A8A]
      "
    >
      ${escapeHtml(label)}
    </p>

    <p
      class="
        mt-2

        font-serif

        text-[32px]

        text-[#181818]
      "
    >
      ${count}
    </p>

  </div>

  <div
    class="
      flex
      h-12
      w-12
      shrink-0
      items-center
      justify-center

      rounded-full

      bg-[#FAF7F1]

      text-[#A07936]
    "
  >
    ${icon(iconName, "h-5 w-5")}
  </div>

</div>
`;
}


function createQuickAction({ label, description, iconName, href, tab }) {

  const attrs =
    tab
      ? `href="#" data-tab="${tab}" class="profile-nav-link"`
      : `href="${href}"`;

  return `
<a
  ${attrs}

  class="
    group

    flex
    items-center

    gap-4

    rounded-[22px]

    border
    border-[#F3EEE6]

    bg-white

    p-5

    transition-colors
    duration-300

    hover:border-[#A07936]
  "
>

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

      text-[#A07936]

      transition-colors
      duration-300

      group-hover:bg-[#181818]
      group-hover:text-white
    "
  >
    ${icon(iconName, "h-[18px] w-[18px]")}
  </div>

  <div class="min-w-0">

    <p
      class="
        text-[14px]
        font-medium

        text-[#181818]
      "
    >
      ${escapeHtml(label)}
    </p>

    <p
      class="
        mt-0.5

        text-[12px]

        text-[#99938B]
      "
    >
      ${escapeHtml(description)}
    </p>

  </div>

</a>
`;
}


export function createProfileOverview({
  fullName = "",
  wishlistCount = 0,
  cartCount = 0,
} = {}) {

  return `

<div>

  <h2
    class="
      font-serif
      italic

      text-[24px]
      sm:text-[28px]

      text-[#181818]
    "
  >
    ${fullName ? `Welcome, ${escapeHtml(fullName)}` : "Overview"}
  </h2>

  <p class="mt-2 text-[14px] text-[#8A8A8A]">
    A quick look at your account.
  </p>


  <!-- STATS -->

  <div
    class="
      mt-8

      grid

      grid-cols-1
      gap-4

      sm:grid-cols-2
    "
  >

    ${createStatCard({
      label: "Wishlist Items",
      count: wishlistCount,
      iconName: "heart",
    })}

    ${createStatCard({
      label: "Cart Items",
      count: cartCount,
      iconName: "shopping-bag",
    })}

  </div>


  <!-- QUICK ACTIONS -->

  <h3
    class="
      mt-12

      text-[13px]
      font-medium
      uppercase
      tracking-[0.18em]

      text-[#8A8A8A]
    "
  >
    Quick Actions
  </h3>

  <div
    class="
      mt-4

      grid

      grid-cols-1
      gap-4

      sm:grid-cols-2
    "
  >

    ${createQuickAction({
      label: "My Profile",
      description: "Edit your personal information",
      iconName: "user-round",
      tab: "info",
    })}

    ${createQuickAction({
      label: "Addresses",
      description: "Manage your delivery addresses",
      iconName: "map-pin",
      tab: "addresses",
    })}

    ${createQuickAction({
      label: "Wishlist",
      description: "View your saved pieces",
      iconName: "heart",
      href: "/pages/wishlist.html",
    })}

    ${createQuickAction({
      label: "Shopping Cart",
      description: "Review items in your cart",
      iconName: "shopping-bag",
      href: "/pages/cart.html",
    })}

  </div>

</div>

`;
}
