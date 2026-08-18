import { NAVIGATION } from "../../constants/navigation.js";



export function createSocialIcons(socialLinks = {}) {
  return `
    <!-- Instagram -->

   <a
  href="${socialLinks.instagram || "#"}"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Instagram"
  class="
    flex
    h-11
    w-11
    items-center
    justify-center
    rounded-full
    border
    border-white/10
    text-white/70
    transition-all
    duration-300
    hover:border-[#A07936]
    hover:text-[#A07936]
  "
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    class="h-5 w-5"
  >
    <path d="M7.75 2C4.57 2 2 4.57 2 7.75v8.5C2 19.43 4.57 22 7.75 22h8.5C19.43 22 22 19.43 22 16.25v-8.5C22 4.57 19.43 2 16.25 2h-8.5Zm0 2h8.5A3.75 3.75 0 0 1 20 7.75v8.5A3.75 3.75 0 0 1 16.25 20h-8.5A3.75 3.75 0 0 1 4 16.25v-8.5A3.75 3.75 0 0 1 4 7.75 3.75 3.75 0 0 1 7.75 4Zm8.75 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z"/>
  </svg>
</a>




 <!-- facebook -->

<a
  href="${socialLinks.facebook || "#"}"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Facebook"
  class="
    flex
    h-11
    w-11
    items-center
    justify-center
    rounded-full
    border
    border-white/10
    text-white/70
    transition-all
    duration-300
    hover:border-[#A07936]
    hover:text-[#A07936]
  "
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    class="h-5 w-5"
  >
    <path
      d="M13.5 22v-8h2.75l.5-3h-3.25V9.05c0-.87.24-1.55 1.58-1.55h1.67V4.82c-.29-.04-1.29-.13-2.45-.13-2.43 0-4.09 1.48-4.09 4.2V11H7.5v3h2.71v8h3.29Z"
    />
  </svg>
</a>







    <!-- WhatsApp -->

    <a
       href="${socialLinks.whatsapp || "#"}"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="WhatsApp"
      class="
        flex
        h-11
        w-11
        items-center
        justify-center
        rounded-full
        border
        border-white/10
        text-white/70
        transition-all
        duration-300
        hover:border-[#A07936]
        hover:text-[#A07936]
      "
    >

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill="currentColor"
        class="h-5 w-5"
      >
        <path d="M16 3C8.83 3 3 8.72 3 15.78c0 2.54.74 4.99 2.14 7.11L3.5 29l6.32-1.61A13.1 13.1 0 0 0 16 28.56c7.17 0 13-5.72 13-12.78S23.17 3 16 3Zm0 23.12a10.9 10.9 0 0 1-5.57-1.53l-.4-.24-3.75.95 1-3.63-.26-.42a10.53 10.53 0 0 1-1.63-5.47C5.39 10.1 10.06 5.5 16 5.5s10.61 4.6 10.61 10.28S21.94 26.12 16 26.12Zm5.88-7.74c-.32-.16-1.9-.93-2.2-1.04-.29-.1-.5-.16-.71.16s-.82 1.03-1 1.24c-.19.21-.37.24-.69.08-.32-.16-1.34-.49-2.55-1.56-.94-.83-1.57-1.86-1.76-2.18-.18-.31-.02-.48.14-.64.14-.14.32-.37.48-.56.16-.18.21-.31.32-.52.1-.21.05-.39-.03-.55-.08-.16-.71-1.69-.97-2.32-.26-.61-.53-.53-.71-.54h-.61c-.21 0-.55.08-.84.39-.29.31-1.11 1.08-1.11 2.63s1.13 3.05 1.29 3.26c.16.21 2.22 3.35 5.38 4.69.75.32 1.34.51 1.8.66.76.24 1.45.21 2 .13.61-.09 1.9-.78 2.17-1.54.27-.76.27-1.41.19-1.54-.08-.13-.29-.21-.61-.37Z"/>
      </svg>

    </a>
  `;
}

export function createFooterLinks(socialLinks = {}) {
  const shopLinks = NAVIGATION.map(
    (item) => `
      <li>
        <a
          href="${item.href}"
          class="
            text-white/60
            transition-colors
            duration-300
            hover:text-[#A07936]
          "
        >
          ${item.label}
        </a>
      </li>
    `
  ).join("");

  return `
<section class="bg-[#181818]">



  <div
    class="
      mx-auto
      grid
      max-w-7xl
      gap-12
      px-6
      py-16

      md:grid-cols-2

      lg:grid-cols-[1.5fr_1fr_1fr_1fr]
      lg:gap-16
      lg:px-8
      lg:py-20

    "
  >

   <!-- Brand -->

<!-- Brand -->

<div>

<div>
  <a href="/index.html" class="inline-block">
    <img
      src="/src/assets/logo.png"
      alt="banshiwale"
      class="h-24 w-24 object-contain"
    />
  </a>

  <p class="max-w-xs text-sm leading-7 text-white/60">
    Timeless sterling silver jewellery crafted for modern men.
  </p>
</div>




  <div
    id="footerSocialLinks"
    class="
      mt-8
      flex
      items-center
      gap-3
    "
  >

    ${createSocialIcons(socialLinks)}

  </div>

</div>









    <!-- Shop -->

<div class="footer-section">

  <button
    class="
      footer-toggle
      flex
      w-full
      items-center
      justify-between
      py-2
      lg:cursor-default
    "
  >

    <span
      class="
        text-sm
        font-semibold
        uppercase
        tracking-[0.18em]
        text-white
      "
    >
      Shop
    </span>

    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      class="
        footer-chevron
        h-5
        w-5
        text-white/60
        transition-transform
        duration-300
        lg:hidden
      "
    >
      <path d="m6 9 6 6 6-6"/>
    </svg>

  </button>

  <ul
    class="
      footer-content
      hidden
      space-y-4
      pt-5
      text-sm
      lg:block
    "
  >

      ${shopLinks}

  </ul>

</div>

    <!-- Customer Care -->



<div class="footer-section">

  <button
    class="
      footer-toggle
      flex
      w-full
      items-center
      justify-between
      py-2
      lg:cursor-default
    "
  >

    <span
      class="
        text-sm
        font-semibold
        uppercase
        tracking-[0.18em]
        text-white
      "
    >
      Customer
    </span>

    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      class="
        footer-chevron
        h-5
        w-5
        text-white/60
        transition-transform
        duration-300
        lg:hidden
      "
    >
      <path d="m6 9 6 6 6-6"/>
    </svg>

  </button>

  <ul
    class="
      footer-content
      hidden
      space-y-4
      pt-5
      text-sm
      lg:block
    "
  >

    <li>
      <a
        href="/pages/contact.html"
        class="text-white/60 transition hover:text-[#A07936]"
      >
        Contact Us
      </a>
    </li>

    <li>
      <a
        href="/pages/shipping-policy.html"
        class="text-white/60 transition hover:text-[#A07936]"
      >
        Shipping Policy
      </a>
    </li>

    <li>
      <a
        href="/pages/refund-policy.html"
        class="text-white/60 transition hover:text-[#A07936]"
      >
        Returns & Refunds
      </a>
    </li>

    <li>
      <a
        href="/pages/faq.html"
        class="text-white/60 transition hover:text-[#A07936]"
      >
        FAQs
      </a>
    </li>

  </ul>

</div>




  <!-- Company -->

<div class="footer-section">

  <button
    class="
      footer-toggle
      flex
      w-full
      items-center
      justify-between
      py-2
      lg:cursor-default
    "
  >

    <span
      class="
        text-sm
        font-semibold
        uppercase
        tracking-[0.18em]
        text-white
      "
    >
      Company
    </span>

    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      class="
        footer-chevron
        h-5
        w-5
        text-white/60
        transition-transform
        duration-300
        lg:hidden
      "
    >
      <path d="m6 9 6 6 6-6"/>
    </svg>

  </button>

  <ul
    class="
      footer-content
      hidden
      space-y-4
      pt-5
      text-sm
      lg:block
    "
  >

    <li>
      <a
        href="/pages/about.html"
        class="text-white/60 transition hover:text-[#A07936]"
      >
        About Us
      </a>
    </li>

    <li>
      <a
        href="/pages/privacy-policy.html"
        class="text-white/60 transition hover:text-[#A07936]"
      >
        Privacy Policy
      </a>
    </li>

    <li>
      <a
        href="/pages/terms-and-conditions.html"
        class="text-white/60 transition hover:text-[#A07936]"
      >
        Terms & Conditions
      </a>
    </li>

  </ul>

</div>



<div>







</div>

  </div>

</section>
`;
}
