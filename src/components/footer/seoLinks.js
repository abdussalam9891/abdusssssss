function createSeoRow(label, links) {
  const linksHtml = links
    .map(
      (link, index) => `
        <a
          href="${link.href}"
          class="text-white/40 transition-colors duration-300 hover:text-[#A07936]"
        >
          ${link.label}
        </a>
        ${index < links.length - 1 ? `<span class="text-white/20">|</span>` : ""}
      `
    )
    .join("");

  return `
<div
  class="
    flex
    flex-col
    gap-2
    py-3

    sm:flex-row
    sm:gap-4
  "
>

  <span
    class="
      shrink-0
      text-xs
      font-semibold
      uppercase
      tracking-[0.14em]
      text-white/60
      sm:w-40
    "
  >
    ${label}
  </span>

  <div
    class="
      flex
      flex-wrap
      items-center
      gap-x-3
      gap-y-2
      text-sm
    "
  >

    ${linksHtml}

  </div>

</div>
`;
}

export function createSeoLinks() {
  // Same backend category names the homepage's "Shop by Category"
  // grid renders (see CATEGORY_IMAGES in features/collections/
  // renderCollections.js) — kept in sync so these links resolve to
  // the same product listings.
  const categoryLink = (categoryName) =>
    `/pages/products.html?category=${encodeURIComponent(categoryName)}`;

  const newArrivalsLink = "/pages/products.html?tag=new";

  const rows = [
    {
      label: "Shop by Category",
      links: [
        { label: "Silver Rings", href: categoryLink("Silver Rings") },
        { label: "Silver Chains", href: categoryLink("Silver Chains") },
        { label: "Silver Bracelet", href: categoryLink("Silver Bracelet") },
        { label: "Silver Kada", href: categoryLink("Silver Kada") },
        { label: "Silver Pendant", href: categoryLink("Silver Pendant") },
        { label: "Kids Bangles", href: categoryLink("Kids Bangles") },
        { label: "New Arrivals", href: newArrivalsLink },
      ],
    },
    {
      label: "Popular Searches",
      links: [
        { label: "Men's Silver Rings", href: categoryLink("Silver Rings") },
        { label: "Men's Silver Chains", href: categoryLink("Silver Chains") },
        { label: "Men's Silver Bracelet", href: categoryLink("Silver Bracelet") },
        { label: "Silver Kada For Men", href: categoryLink("Silver Kada") },
        { label: "Men's Silver Pendant", href: categoryLink("Silver Pendant") },
        { label: "Kids Silver Bangles", href: categoryLink("Kids Bangles") },
        { label: "925 Sterling Silver Jewellery", href: "/pages/products.html" },
        { label: "Silver Jewellery For Men", href: "/pages/products.html" },
        { label: "New Silver Jewellery", href: newArrivalsLink },
        { label: "Customize Your Jewellery", href: "/pages/products.html" },
      ],
    },
    {
      label: "Shop by Occasion",
      links: [
        { label: "Birthday Gifts", href: "/pages/products.html" },
        { label: "Anniversary Gifts", href: "/pages/products.html" },
        { label: "Wedding Gifts", href: "/pages/products.html" },
        { label: "Gifts For Him", href: "/pages/products.html" },
        { label: "Gifts For Boyfriend", href: "/pages/products.html" },
        { label: "Gifts For Husband", href: "/pages/products.html" },
        { label: "Rakhi Gifts For Brother", href: "/pages/products.html" },
      ],
    },
  ];

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
      pt-6
      pb-10

      lg:px-8
      lg:pb-14
    "
  >

    ${rows.map((row) => createSeoRow(row.label, row.links)).join("")}

  </div>

</section>
`;
}
