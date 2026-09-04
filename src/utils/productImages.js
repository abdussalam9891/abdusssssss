/*
 * One place where a backend product's photos become urls the UI can
 * render, so every card, gallery and thumbnail counts the same
 * images in the same order.
 *
 * The backend is inconsistent about the shape: `images` is usually
 * an array of { url, position } objects but arrives as plain url
 * strings on some endpoints, and the normalized product built by
 * features/productDetails/model.js carries a ready `gallery` array
 * of strings instead. All three are accepted here.
 *
 * Crucially, a product can be published with a single photo — the
 * common case for new catalog entries — so callers are told how
 * many usable images there actually are (`hasHover`) rather than
 * being handed a duplicate second url that makes a one-photo
 * product pretend to have two.
 */


/*
 * A self-contained inline placeholder. Deliberately not a file
 * path: /assets/images/placeholder.webp, the path this codebase
 * used to point at, does not exist under either assets/ or src/
 * assets/, so a broken product image fell back to another broken
 * image.
 */
export const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">` +
    `<rect width="400" height="400" fill="#FCFBF9"/>` +
    `<path d="M140 250 L190 170 L225 215 L260 160 L305 250 Z" ` +
    `fill="none" stroke="#D8CBB0" stroke-width="10" stroke-linejoin="round"/>` +
    `<circle cx="170" cy="140" r="20" fill="none" stroke="#D8CBB0" stroke-width="10"/>` +
    `</svg>`
  );


/*
 * Image entries -> ordered, de-duplicated urls.
 *
 * The same url twice in one product's images (a re-upload of the
 * same file) would otherwise read as two photos and switch a card
 * into hover mode that visibly does nothing, so duplicates are
 * dropped here rather than at each call site.
 */
export function toGalleryUrls(images) {

  if (!Array.isArray(images)) return [];


  const urls =
    [...images]
      .sort(
        (a, b) =>
          (typeof a === "string" ? 0 : a?.position ?? 0) -
          (typeof b === "string" ? 0 : b?.position ?? 0)
      )
      .map(
        (image) =>
          typeof image === "string"
            ? image.trim()
            : image?.url
      )
      .filter(Boolean);


  return [...new Set(urls)];
}


/*
 * Every usable photo for a product, whichever shape it arrived in.
 * `gallery` (the normalized product) wins over `images` (the raw
 * backend one) because a variant selection has already been applied
 * to it — see features/productDetails/state.js.
 */
export function getGalleryUrls(product) {

  if (!product) return [];


  if (Array.isArray(product.gallery) && product.gallery.length) {
    return toGalleryUrls(product.gallery);
  }


  return toGalleryUrls(product.images);
}


/*
 * The first photo, or the placeholder when a product has none.
 */
export function getPrimaryImage(product) {

  return (
    getGalleryUrls(product)[0] ||
    PLACEHOLDER_IMAGE
  );
}


/*
 * What a product card needs to paint itself:
 *
 *   front         the photo shown at rest
 *   back          the photo revealed on hover — "" when the product
 *                 has only one, so the card renders no second layer
 *                 at all instead of cross-fading a photo into itself
 *   hasHover      whether a real second photo exists. The moment the
 *                 backend gains one, cards pick the hover swap up on
 *                 their own; nothing here is hardcoded per product.
 *   frontFallback the url each <img> tries before the placeholder. A
 *   backFallback  product can be published with a photo whose file
 *                 was never uploaded (the S3 url answers 403), which
 *                 would otherwise leave a blank tile.
 */
export function getCardImages(product) {

  const urls =
    getGalleryUrls(product);

  const hasHover =
    urls.length > 1;


  return {

    front:
      urls[0] || PLACEHOLDER_IMAGE,

    back:
      hasHover ? urls[1] : "",

    hasHover,

    frontFallback:
      urls[1] || PLACEHOLDER_IMAGE,

    backFallback:
      urls[0] || PLACEHOLDER_IMAGE,

  };
}
