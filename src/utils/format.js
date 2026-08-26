export function formatPrice(value) {

  const number = Number(value);

  if (!Number.isFinite(number)) return "";


  return `₹${Math.round(number).toLocaleString(
    "en-IN"
  )}`;
}


// Slug is preferred (the human-readable identifier the product
// details page is built around); `id` is kept as a fallback for
// products/cart items that don't carry a slug.
export function getProductDetailsHref(id, slug) {

  if (slug) {

    return `/pages/product-details.html?slug=${encodeURIComponent(slug)}`;
  }


  if (id) {

    return `/pages/product-details.html?id=${encodeURIComponent(id)}`;
  }


  return "#";
}


// Backend/user-entered strings are rendered through innerHTML
// templates, so escape them here rather than trusting input.
export function escapeHtml(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
