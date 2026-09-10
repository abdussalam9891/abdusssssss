import { productsState } from "./state.js";
import {
  normalizeForComparison,
  toStringList,
} from "../../utils/categoryMatch.js";


/*
 * The backend's public store endpoint honours `subCategory` and
 * `search` only. `sort`, `minPrice`/`maxPrice` and `badge` are
 * accepted but ignored — verified against the live API: every
 * `sort` value returns the same order, and a narrowed price range
 * returns the full catalog. Products also carry no `badge` field
 * at all.
 *
 * So those three, plus pagination (which has to happen after them
 * to stay correct), are applied here over the full server-filtered
 * set held in productsState.fetchedProducts.
 *
 * If the backend ever gains real support for them, delete the
 * matching step below and pass the parameter through api.js again.
 */


// A product added within this many days counts as a new arrival.
// Derived from `createdAt` because the catalog has no badge/tag
// field to read — see NEW_ARRIVAL_BADGE in filters.js.
const NEW_ARRIVAL_DAYS = 30;


// Display and sorting both use the discounted price when the
// backend provides one, matching what the card actually shows
// (getProductPrice in features/showcase/showcaseCard.js). Also used
// by the price filter's slider bounds (see filters.js) so the top
// of the range always matches what the "high" end actually sorts to.
export function getEffectivePrice(product) {

  const finalPrice =
    Number(product?.finalPrice);


  if (
    Number.isFinite(finalPrice) &&
    finalPrice > 0
  ) {
    return finalPrice;
  }


  return Number(product?.price) || 0;
}


function getCreatedTime(product) {

  const time =
    Date.parse(product?.createdAt);


  return Number.isFinite(time)
    ? time
    : 0;
}


export function isNewArrival(product) {

  const created =
    getCreatedTime(product);


  if (!created) return false;


  const maxAgeMs =
    NEW_ARRIVAL_DAYS * 24 * 60 * 60 * 1000;


  return (
    Date.now() - created <= maxAgeMs
  );
}


function applyPriceFilter(products) {

  const price =
    productsState.filters.price;


  if (!price) return products;


  const min =
    Number.isFinite(price.min)
      ? price.min
      : 0;

  const max =
    Number.isFinite(price.max)
      ? price.max
      : Infinity;


  return products.filter(
    (product) => {

      const value =
        getEffectivePrice(product);


      return (
        value >= min &&
        value <= max
      );

    }
  );
}


// Neither `occasion` nor `recipient` is a server-side filter (see the
// note at the top of this file), so — like price/badge — this runs
// over the already-fetched set. Values are opaque backend strings, so
// matching goes through normalizeForComparison the same way category
// facets do, rather than requiring an exact string match.
function productHasAnyValue(product, field, selected) {

  if (!selected.length) return true;


  const productValues =
    toStringList(product?.[field]).map(
      normalizeForComparison
    );


  return selected.some(
    (value) =>
      productValues.includes(
        normalizeForComparison(value)
      )
  );
}


function applyOccasionFilter(products) {

  const occasions =
    productsState.filters.occasions;


  if (!occasions.length) return products;


  return products.filter(
    (product) =>
      productHasAnyValue(product, "occasion", occasions)
  );
}


function applyRecipientFilter(products) {

  const recipients =
    productsState.filters.recipients;


  if (!recipients.length) return products;


  return products.filter(
    (product) =>
      productHasAnyValue(product, "recipient", recipients)
  );
}


function applyBadgeFilter(products) {

  const badges =
    productsState.filters.badges;


  if (!badges.length) return products;


  // "NEW" is the only collection the catalog can honestly back
  // (see isNewArrival). An unknown badge from an old bookmarked
  // URL matches nothing rather than silently matching everything.
  return products.filter(
    (product) =>
      badges.every(
        (badge) =>
          badge === "NEW" &&
          isNewArrival(product)
      )
  );
}


const SORT_COMPARATORS = {

  "price-low": (a, b) =>
    getEffectivePrice(a) - getEffectivePrice(b),

  "price-high": (a, b) =>
    getEffectivePrice(b) - getEffectivePrice(a),

  newest: (a, b) =>
    getCreatedTime(b) - getCreatedTime(a),

  rating: (a, b) => {

    const ratingDelta =
      (Number(b?.averageRating) || 0) -
      (Number(a?.averageRating) || 0);


    if (ratingDelta !== 0) return ratingDelta;


    // Same score — the more-reviewed product is the safer bet.
    return (
      (Number(b?.totalReviews) || 0) -
      (Number(a?.totalReviews) || 0)
    );

  },

};


function applySort(products) {

  const comparator =
    SORT_COMPARATORS[productsState.sort];


  // "featured" (and any unrecognised value) keeps whatever order
  // the backend returned.
  if (!comparator) return products;


  return [...products].sort(comparator);
}


/*
 * Runs price -> collection -> sort -> pagination over
 * productsState.fetchedProducts and writes the result into
 * productsState.products / total / totalPages / page.
 *
 * Pure state transform: no fetching, no rendering. Sort, price and
 * page changes only need this, not another network round trip.
 */
export function applyProductsPipeline() {

  const source =
    Array.isArray(productsState.fetchedProducts)
      ? productsState.fetchedProducts
      : [];


  const matched =
    applySort(
      applyBadgeFilter(
        applyRecipientFilter(
          applyOccasionFilter(
            applyPriceFilter(source)
          )
        )
      )
    );


  productsState.total =
    matched.length;


  productsState.totalPages =
    Math.ceil(
      matched.length / productsState.limit
    ) || 0;


  // Narrowing a filter can leave the current page past the end of
  // the new result set (e.g. on page 4, then filtered down to 1
  // page) — clamp instead of rendering an empty grid.
  const page =
    Math.min(
      Math.max(productsState.page, 1),
      Math.max(productsState.totalPages, 1)
    );


  productsState.page = page;


  const start =
    (page - 1) * productsState.limit;


  productsState.products =
    matched.slice(
      start,
      start + productsState.limit
    );


  return productsState.products;
}
