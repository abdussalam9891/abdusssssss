export function createCopyright() {
  const year = new Date().getFullYear();

  return `
<section
  class="
    border-t
    border-white/10
    bg-[#151515]
  "
>

  <div
    class="
      mx-auto
      flex
      max-w-7xl
      flex-col
      items-center
      justify-between
      gap-6
      px-6
      py-6
      text-center

      lg:flex-row
      lg:px-8
      lg:text-left
    "
  >

   <p class="text-sm text-white/50">
  © ${year} Banshiwale • Powered By
  <a
    href="https://www.fuelitonline.com/"
    target="_blank"
    rel="noopener noreferrer"
    class="transition-colors duration-300 hover:text-[#C8963E]"
  >
    Fuel IT Online
  </a>
</p>
    <!-- Legal Links -->

    <nav>

      <ul
        class="
          flex
          flex-wrap
          items-center
          justify-center
          gap-6
          text-sm
        "
      >

        <li>
          <a
            href="/pages/privacy-policy.html"
            class="
              text-white/50
              transition-colors
              duration-300
              hover:text-[#A07936]
            "
          >
            Privacy Policy
          </a>
        </li>

        <li>
          <a
            href="/pages/terms-and-conditions.html"
            class="
              text-white/50
              transition-colors
              duration-300
              hover:text-[#A07936]
            "
          >
            Terms & Conditions
          </a>
        </li>

        <li>
          <a
            href="/pages/shipping-policy.html"
            class="
              text-white/50
              transition-colors
              duration-300
              hover:text-[#A07936]
            "
          >
            Shipping Policy
          </a>
        </li>

      </ul>

    </nav>

  </div>

</section>
`;
}
