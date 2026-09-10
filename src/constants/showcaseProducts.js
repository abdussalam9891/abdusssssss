// How many products each tab shows at most — mirrors Best Sellers'
// own cap (see MAX_PRODUCTS in features/bestSellers/renderBestSellers.js)
// so no single tab turns into an unbounded horizontal scroll.
const MAX_TAB_PRODUCTS = 10;


// Most-talked-about first: highest review volume is the most honest
// "what's trending right now" signal the catalog actually has (no
// backend-tracked view/click counts to draw on). Ties broken by
// rating so two equally-reviewed products still order sensibly.
function byReviewsThenRating(a, b) {
  const reviewDelta =
    (Number(b?.totalReviews) || 0) -
    (Number(a?.totalReviews) || 0);

  if (reviewDelta !== 0) return reviewDelta;

  return (
    (Number(b?.averageRating) || 0) -
    (Number(a?.averageRating) || 0)
  );
}

// Quality-first: highest rated, same tie-break Best Sellers uses
// (byRatingThenReviews there) — deliberately the opposite ordering
// priority from Trending above so the two tabs read as genuinely
// different curations instead of the same list twice.
function byRatingThenReviews(a, b) {
  const ratingDelta =
    (Number(b?.averageRating) || 0) -
    (Number(a?.averageRating) || 0);

  if (ratingDelta !== 0) return ratingDelta;

  return (
    (Number(b?.totalReviews) || 0) -
    (Number(a?.totalReviews) || 0)
  );
}

function isNewArrival(product) {
  if (!product.createdAt) return false;

  const createdAt =
    new Date(product.createdAt);

  const now = new Date();

  const daysSinceCreation =
    (now - createdAt) /
    (1000 * 60 * 60 * 24);

  return daysSinceCreation <= 30;
}


// Published-status filtering is applied once, upstream, to every
// tab's product set (see features/showcase/renderShowcase.js) —
// `select` below only has to pick/order which of those go into each
// tab, not re-check publish state.
export const SHOWCASE_TABS = [
  {
    id: "trending",

    label: "Trending",

    select: (products) =>
      [...products]
        .sort(byReviewsThenRating)
        .slice(0, MAX_TAB_PRODUCTS),
  },

  {
    id: "recommended",

    label: "Recommended",

    select: (products) =>
      [...products]
        .sort(byRatingThenReviews)
        .slice(0, MAX_TAB_PRODUCTS),
  },

  {
    id: "new",

    label: "New Arrivals",

    select: (products) =>
      products
        .filter(isNewArrival)
        .slice(0, MAX_TAB_PRODUCTS),
  },
];
