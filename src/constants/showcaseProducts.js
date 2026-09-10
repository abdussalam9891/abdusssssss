// Published-status filtering is applied once, upstream, to every
// tab's product set (see features/showcase/renderShowcase.js) —
// these filters only distinguish one tab from another.
export const SHOWCASE_TABS = [
  {
    id: "trending",

    label: "Trending",

    filter: () => true,
  },

  {
    id: "recommended",

    label: "Recommended",

    filter: () => true,
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
];
