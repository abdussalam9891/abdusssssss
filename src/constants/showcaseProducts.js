export const SHOWCASE_TABS = [
  {
    id: "trending",

    label: "Trending",

    filter: (product) =>
      product.status?.toLowerCase() === "active",
  },

  {
    id: "recommended",

    label: "Recommended",

    filter: (product) =>
      product.status?.toLowerCase() === "active",
  },

  {
    id: "new",

    label: "New Arrivals",

    filter: (product) => {
      if (!product.createdAt) return false;

      const createdAt =
        new Date(product.createdAt);

      const now = new Date();

      const daysSinceCreation =
        (now - createdAt) /
        (1000 * 60 * 60 * 24);

      return daysSinceCreation <= 30;
    },
  },

  {
    id: "bestseller",

    label: "Best Sellers",

    filter: (product) =>
      product.isBestSeller === true,
  },
];
