import { productsState } from "./state.js";


export function getProductsQuery() {

  const params =
    new URLSearchParams(
      window.location.search
    );


  return {

    category:
      params.get("category")
        ? params
            .get("category")
            .split(",")
            .filter(Boolean)
        : [],


    /*
     * `tag` is the legacy alias used by the New Arrivals links
     * (/pages/products.html?tag=new). It means the same thing as
     * `badge`, so it is read here instead of being silently
     * ignored. Links are left untouched; the URL normalizes to
     * `badge` on the next filter change.
     */

    badge: (() => {

      const badge =
        params.get("badge") ||
        params.get("tag");


      return badge
        ? badge
            .split(",")
            .filter(Boolean)
        : [];

    })(),


    sort:
      params.get("sort") ||
      "featured",


    page:
      Math.max(
        Number(params.get("page")) || 1,
        1
      ),


    search:
      params.get("search") || "",


    price: (() => {

      const min =
        params.get("min");

      const max =
        params.get("max");


      if (
        min === null &&
        max === null
      ) {
        return null;
      }


      return {
        min:
          min !== null
            ? Number(min)
            : 0,

        max:
          max !== null
            ? Number(max)
            : Infinity,
      };

    })(),

  };
}


export function restoreProductsStateFromURL() {

  const query =
    getProductsQuery();


  /*
   * Category values are opaque backend strings (e.g. "Silver Ring"),
   * not a fixed enum, so they're kept exactly as given — lowercasing
   * them would break an exact match against the backend's own data.
   */

  productsState.filters.categories =
    query.category;


  productsState.filters.badges =
    query.badge.map(
      (badge) =>
        badge.toUpperCase()
    );


  productsState.filters.price =
    query.price;


  productsState.sort =
    query.sort;


  productsState.page =
    query.page;


  productsState.search =
    query.search;
}


export function updateProductsURL() {

  const params =
    new URLSearchParams();


  if (
    productsState.filters.categories.length
  ) {

    params.set(
      "category",
      productsState.filters.categories.join(",")
    );

  }


  if (
    productsState.filters.badges.length
  ) {

    params.set(
      "badge",
      productsState.filters.badges.join(",")
    );

  }


  if (
    productsState.filters.price
  ) {

    const {
      min,
      max,
    } =
      productsState.filters.price;


    if (
      min !== undefined &&
      min !== null
    ) {

      params.set(
        "min",
        min
      );

    }


    if (
      max !== undefined &&
      max !== null &&
      max !== Infinity
    ) {

      params.set(
        "max",
        max
      );

    }

  }


  if (
    productsState.sort !== "featured"
  ) {

    params.set(
      "sort",
      productsState.sort
    );

  }


  if (
    productsState.search
  ) {

    params.set(
      "search",
      productsState.search
    );

  }


  if (
    productsState.page > 1
  ) {

    params.set(
      "page",
      productsState.page
    );

  }


  const queryString =
    params.toString();


  const url =
    queryString
      ? `${window.location.pathname}?${queryString}`
      : window.location.pathname;


  window.history.replaceState(
    {},
    "",
    url
  );
}


export function resetProductsURL() {

  window.history.replaceState(
    {},
    "",
    window.location.pathname
  );
}
