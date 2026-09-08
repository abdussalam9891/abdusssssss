export function createCopyright() {
  const year = new Date().getFullYear();

  return `
<section class="bg-[#181818]">

  <div
    class="
      mx-auto
      h-px
      max-w-7xl
      bg-gradient-to-r
      from-transparent
      via-white/10
      to-transparent
    "
  ></div>

  <div
    class="
      mx-auto
      max-w-7xl
      px-6
      py-6
      text-center

      lg:px-8
    "
  >

    <p class="text-sm tracking-wide text-white/50">
      © ${year} Banshiwale • Powered By
      <a
        href="https://www.fuelitonline.com/"
        target="_blank"
        rel="noopener noreferrer"
        class="text-white/60 transition-colors duration-300 hover:text-[#C8963E]"
      >
        Fuel IT Online
      </a>
    </p>

  </div>

</section>
`;
}
