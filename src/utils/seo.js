export const SITE_ORIGIN = "https://banshiwale.com";

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


// A backend image url may already be absolute (CDN/storage host) or
// a site-relative path — callers that need an absolute url (og:image,
// JSON-LD image) shouldn't have to know which.
export function toAbsoluteUrl(url) {

  if (!url) return "";

  if (/^https?:\/\//i.test(url)) return url;

  return `${SITE_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;
}


function setMetaByAttr(attr, key, content) {

  if (!content) return;

  let el =
    document.querySelector(`meta[${attr}="${key}"]`);

  if (!el) {

    el = document.createElement("meta");

    el.setAttribute(attr, key);

    document.head.appendChild(el);
  }

  el.setAttribute("content", content);
}


// Updates <title>, meta description, and the Open Graph/Twitter
// counterparts together so a page never ends up with a title that
// doesn't match what a shared link actually shows.
export function setPageMeta({ title, description, url, image } = {}) {

  if (title) {

    document.title = title;

    setMetaByAttr("property", "og:title", title);
    setMetaByAttr("name", "twitter:title", title);
  }

  if (description) {

    setMetaByAttr("name", "description", description);
    setMetaByAttr("property", "og:description", description);
    setMetaByAttr("name", "twitter:description", description);
  }

  if (url) {

    setMetaByAttr("property", "og:url", url);
  }

  if (image) {

    const absoluteImage = toAbsoluteUrl(image);

    setMetaByAttr("property", "og:image", absoluteImage);
    setMetaByAttr("name", "twitter:image", absoluteImage);
  }
}


export function setRobotsMeta(content) {

  setMetaByAttr("name", "robots", content);
}


// Creates or replaces a <script type="application/ld+json"> tag
// identified by `id`, so a page that resolves its data after render
// (product details) can inject structured data without duplicating
// the script tag on re-render.
export function setJsonLd(id, data) {

  let script =
    document.getElementById(id);

  if (!script) {

    script = document.createElement("script");

    script.type = "application/ld+json";
    script.id = id;

    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(data);
}


export function buildBreadcrumbJsonLd(items) {

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
