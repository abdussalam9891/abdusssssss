export function createBreadcrumb(product) {

  return `

<nav

  aria-label="Breadcrumb"

  class="
    flex
    flex-wrap

    items-center

    gap-2

    mt-28

    text-[13px]

    text-[#8A8A8A]
  "

>

  <a

    href="/index.html"

    class="
      transition-colors
      duration-300

      hover:text-[#A07936]
    "
  >

    Home

  </a>

  <span>/</span>

  <a

    href="/pages/products.html"

    class="
      transition-colors
      duration-300

      hover:text-[#A07936]
    "
  >

    Collections

  </a>

  <span>/</span>

  <span
    class="
      text-[#181818]
    "
  >

    ${product.name}

  </span>

</nav>

`;

}
