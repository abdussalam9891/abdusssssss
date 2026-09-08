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
  // grid renders (see CATEGORY_IMAGES in features/category/
  // renderCategory.js) — kept in sync so these links resolve to
  // the same product listings.
  const categoryLink = (categoryName) =>
    `/pages/products.html?category=${encodeURIComponent(categoryName)}`;

  const newArrivalsLink = "/pages/products.html?tag=new";

  // Occasion/recipient are opaque backend tags on the product, same
  // as category — these labels assume the admin panel tags products
  // with these exact words (matching is case/plural-insensitive, see
  // normalizeForComparison, but not a fuzzy search). A label with no
  // real match just lands on an empty grid rather than the wrong one.
  const occasionLink = (occasion) =>
    `/pages/products.html?occasion=${encodeURIComponent(occasion)}`;

  const recipientLink = (recipient) =>
    `/pages/products.html?recipient=${encodeURIComponent(recipient)}`;

  const occasionRecipientLink = (occasion, recipient) =>
    `/pages/products.html?occasion=${encodeURIComponent(
      occasion
    )}&recipient=${encodeURIComponent(recipient)}`;

  const rows = [
    {
      label: "Shop by Category",
      links: [
        { label: "Rings", href: categoryLink("Rings") },
        { label: "Chains", href: categoryLink("Chains") },
        { label: "Bracelet", href: categoryLink("Bracelet") },
        { label: "Kada", href: categoryLink("Kada") },
        { label: "Pendant", href: categoryLink("Pendant") },
        { label: "Bangles", href: categoryLink("Bangles") },
        { label: "Bansuri", href:categoryLink("Bansuri")},
        { label: "New Arrivals", href: newArrivalsLink },
      ],
    },
    {
      label: "Popular Searches",
      links: [
        { label: "Men's Silver Rings", href: categoryLink("Rings") },
        { label: "Men's Silver Chains", href: categoryLink("Chains") },
        { label: "Men's Silver Bracelet", href: categoryLink("Bracelet") },
        { label: "Silver Kada For Men", href: categoryLink("Kada") },
        { label: "Men's Silver Pendant", href: categoryLink("Pendant") },
        { label: "Kids Silver Bangles", href: categoryLink("Bangles") },
        { label: "925 Sterling Silver Jewellery", href: "/pages/products.html" },
        { label: "Silver Jewellery For Men", href: "/pages/products.html" },
        { label: "New Silver Jewellery", href: newArrivalsLink },
        { label: "Customize Your Jewellery", href: "/pages/products.html" },
      ],
    },
    {
      label: "Shop by Occasion",
      links: [
        { label: "Birthday Gifts", href: occasionLink("Birthday") },
        { label: "Anniversary Gifts", href: occasionLink("Anniversary") },
        { label: "Wedding Gifts", href: occasionLink("Wedding") },
        { label: "Gifts For Him", href: recipientLink("Him") },
        { label: "Gifts For Boyfriend", href: recipientLink("Boyfriend") },
        { label: "Gifts For Husband", href: recipientLink("Husband") },
        {
          label: "Rakhi Gifts For Brother",
          href: occasionRecipientLink("Rakhi", "Brother"),
        },
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
