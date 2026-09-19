/*
 * Per-product SEO: every product resolves on the same static
 * product-details.html, so title/description/canonical/OG/JSON-LD
 * all have to be filled in from the normalized product after it
 * loads — the markup in the head is just generic fallback content.
 */

import { getProductDetailsHref } from "../../utils/format.js";
import {
  SITE_ORIGIN,
  setCanonicalUrl,
  setPageMeta,
  setRobotsMeta,
  setJsonLd,
  toAbsoluteUrl,
  buildBreadcrumbJsonLd,
} from "../../utils/seo.js";


function truncate(text, maxLength) {

  const clean =
    text.replace(/\s+/g, " ").trim();

  if (clean.length <= maxLength) return clean;

  return `${clean.slice(0, maxLength - 1).trimEnd()}…`;
}


function buildDescription(product) {

  if (product.description) {
    return truncate(product.description, 155);
  }

  return truncate(
    `Shop ${product.name} — handcrafted sterling silver jewellery from Banshiwale.`,
    155
  );
}


function buildProductJsonLd(product, url) {

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    url,
    image: product.gallery.map(toAbsoluteUrl).filter(Boolean),
    description: product.description || undefined,
    sku: product.sku || undefined,
    brand: {
      "@type": "Brand",
      name: "Banshiwale",
    },
  };

  const price =
    product.finalPrice ?? product.price;

  if (price !== null && price !== undefined) {

    schema.offers = {
      "@type": "Offer",
      url,
      priceCurrency: "INR",
      price: String(price),
      availability:
        product.inStock === false
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    };
  }

  if (product.totalReviews > 0) {

    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.averageRating,
      reviewCount: product.totalReviews,
    };
  }

  return schema;
}


function buildBreadcrumbs(product, url) {

  const items = [
    { name: "Home", url: `${SITE_ORIGIN}/` },
    { name: "Collections", url: `${SITE_ORIGIN}/pages/products.html` },
  ];

  if (product.category) {

    items.push({
      name: product.category,
      url: `${SITE_ORIGIN}/pages/products.html?category=${encodeURIComponent(product.category)}`,
    });
  }

  items.push({ name: product.name, url });

  return buildBreadcrumbJsonLd(items);
}


// Called once the product resolves — sets the canonical url (as
// before) plus everything a shared link or a search result actually
// shows: title, description, OG/Twitter tags, Product + Breadcrumb
// JSON-LD.
export function applyProductSeo(product) {

  const path =
    getProductDetailsHref(product.id, product.slug);

  const url = `${SITE_ORIGIN}${path}`;

  setCanonicalUrl(path);

  setPageMeta({
    title: `${product.name} | Banshiwale`,
    description: buildDescription(product),
    url,
    image: product.gallery[0],
  });

  setJsonLd("product-jsonld", buildProductJsonLd(product, url));
  setJsonLd("breadcrumb-jsonld", buildBreadcrumbs(product, url));
}


// A product-details load that 404s must not keep masquerading as an
// indexable product page under the generic static markup's title.
export function applyProductNotFoundSeo() {

  document.title = "Product Not Found | Banshiwale";

  setRobotsMeta("noindex, follow");
}


// A transient load failure (network/5xx) isn't "not found" — the
// product may well exist — but it's still not a page worth indexing
// under whatever title happened to be in the static markup.
export function applyProductErrorSeo() {

  document.title = "Banshiwale | Product Details";

  setRobotsMeta("noindex, follow");
}
