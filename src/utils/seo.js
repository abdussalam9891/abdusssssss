const SITE_ORIGIN = "https://banshiwale.com";

// Points the page's <link rel="canonical"> at `path` (e.g. the value
// returned by getProductDetailsHref). Used by pages whose canonical
// URL depends on data only known after render (one static HTML file
// serving many products via ?slug=/?id=), where the tag can't be
// hardcoded at build time because there is no build step.
export function setCanonicalUrl(path) {

  let link =
    document.querySelector('link[rel="canonical"]');

  if (!link) {

    link = document.createElement("link");

    link.setAttribute("rel", "canonical");

    document.head.appendChild(link);
  }

  link.setAttribute("href", `${SITE_ORIGIN}${path}`);
}
