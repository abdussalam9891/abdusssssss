/*
 * Single place where the backend product shape is translated
 * into the shape the product-details UI consumes.
 *
 * Everything under components/productDetails and
 * features/productDetails reads the normalized object below,
 * so backend field names live here and nowhere else.
 *
 * Only fields the backend actually returns are mapped —
 * nothing is invented or defaulted to fake business data.
 */


import {
  PLACEHOLDER_IMAGE,
  toGalleryUrls,
} from "../../utils/productImages.js";


function toArray(value) {

  if (Array.isArray(value)) {

    return value
      .map(
        (item) =>
          typeof item === "string"
            ? item.trim()
            : item
      )
      .filter(Boolean);

  }


  if (
    typeof value === "string" &&
    value.trim()
  ) {
    return [value.trim()];
  }


  return [];
}


function toNumber(value) {

  // Number(null) is 0 and Number("") is 0 — neither means "the
  // backend reported zero," they mean "the backend reported
  // nothing," so they must resolve to null rather than 0.
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }


  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}


/*
 * Ordering, de-duplication and the object-or-string shape question
 * all live in utils/productImages.js, so the gallery the
 * product-details page reads is the same list every product card
 * counts — a product with one photo has one entry everywhere.
 */
function normalizeGallery(images) {

  return toGalleryUrls(images);
}


function normalizeVideos(product) {

  // `video` is an array on the list response; `videoLink` is a
  // single string on the single-product response. Items may be
  // plain URLs or objects carrying a url.
  const videos =
    toArray(product?.video)
      .map(
        (item) =>
          typeof item === "string"
            ? item
            : item?.url
      )
      .filter(Boolean);


  if (
    typeof product?.videoLink === "string" &&
    product.videoLink.trim()
  ) {
    videos.push(
      product.videoLink.trim()
    );
  }


  return [...new Set(videos)];
}


function normalizeAttributes(attributes) {

  if (!Array.isArray(attributes)) return [];


  return attributes
    .map((attribute) => ({

      // Some backend records use `key` instead of `name`.
      name:
        attribute?.name ||
        attribute?.key ||
        "",

      value:
        attribute?.value || "",

    }))
    .filter(
      (attribute) =>
        attribute.name &&
        attribute.value
    );
}


function normalizeSizes(sizes) {

  if (!Array.isArray(sizes)) return [];


  return sizes
    .map(
      (size) =>
        typeof size === "string"
          ? { label: size, stock: null }
          : {
              label:
                size?.size ||
                size?.label ||
                size?.name ||
                "",

              stock:
                toNumber(size?.stock),
            }
    )
    .filter(
      (size) => size.label
    );
}


/*
 * `variantPricing` entries are full pricing objects (their own
 * price/tax/discount breakdown), not simple option pairs, and
 * they're inconsistent in practice: some carry `attributes`
 * (e.g. METAL: SILVER) and their own `images`, others carry
 * neither (confirmed live — a product can have a second variant
 * with empty attributes/images but a different finalPrice). A
 * variant with no images of its own falls back to the base
 * product gallery rather than rendering blank, and one with no
 * attributes is the base product itself, so it carries the
 * product's own name.
 */
function normalizeVariants(variantPricing, baseGallery, baseName) {

  if (!Array.isArray(variantPricing)) return [];


  return variantPricing
    .map((variant, index) => {

      const attributes =
        normalizeAttributes(variant?.attributes);

      const images =
        normalizeGallery(variant?.images);

      const price =
        toNumber(variant?.price);

      const finalPrice =
        toNumber(variant?.finalPrice);

      // No attributes to build a real name from (e.g. "Gold /
      // Small") means this entry is the plain product rather than
      // a finish of it, so it reads as the product's own name.
      // Price is only a last resort — a chip labelled "₹1,471"
      // repeats the price line beside it and names nothing.
      const label =
        attributes.length
          ? attributes
              .map((attribute) => attribute.value)
              .join(" / ")
          : baseName ||
            formatPrice(finalPrice ?? price) ||
            `Option ${index + 1}`;

      return {

        id: variant?._id || "",

        label,

        attributes,

        // An entry with no attributes represents the base product
        // itself (see the label logic above), so its gallery must
        // stay the base product's own photos — the ones showcase
        // cards show — even if the backend happens to have stored
        // an unrelated `images` array on that entry. Only a real
        // attributed finish (METAL: SILVER and friends) gets to
        // swap in its own photos.
        images:
          attributes.length && images.length
            ? images
            : baseGallery,

        price,

        finalPrice:
          finalPrice ?? price,

        discountType:
          variant?.discountType || "",

        discountValue:
          toNumber(variant?.discountValue) || 0,

        makingCharges:
          toNumber(variant?.makingCharges),

        taxRate:
          toNumber(variant?.taxRate),

      };
    })
    .filter(
      (variant) => variant.id
    )
    // The base product leads the option row; the attributed
    // finishes are secondary and follow it. Sort is stable, so
    // those keep their backend order among themselves.
    .sort(
      (a, b) =>
        (a.attributes.length ? 1 : 0) -
        (b.attributes.length ? 1 : 0)
    );
}


/*
 * The backend marks no variantPricing entry as the default, but
 * the entry with no attributes is the base product itself — the
 * attributed ones (METAL: SILVER and friends) are finishes of it
 * — so that entry is the one to land on. Order is not a reliable
 * signal: live products list the attributed variant first, which
 * is why the first entry is no longer taken as primary.
 */
export function pickDefaultVariant(product) {

  const variants =
    product?.variants || [];

  return (
    variants.find(
      (variant) => !variant.attributes.length
    ) ||
    variants[0] ||
    null
  );
}


/*
 * Default to the first size that isn't explicitly out of stock
 * (stock === 0). A size with no stock figure at all (stock ===
 * null) is treated as available, since the backend simply didn't
 * report a count for it.
 */
export function pickDefaultSize(product) {

  const sizes =
    product?.availableSizes || [];

  if (!sizes.length) return null;


  return (
    sizes.find(
      (size) => size.stock === null || size.stock > 0
    ) || sizes[0]
  );
}


export function normalizeProduct(product) {

  if (!product) return null;


  const price =
    toNumber(product.price);

  const finalPrice =
    toNumber(product.finalPrice);


  const discountValue =
    toNumber(product.discountValue) || 0;

  const discountType =
    product.discountType || "";


  const stock =
    toNumber(product.stock) ??
    toNumber(product.quantity);

  const gallery =
    normalizeGallery(product.images);


  return {

    // ----------------------------------------
    // IDENTITY
    // ----------------------------------------

    id:
      product._id || "",

    name:
      product.name || "",

    slug:
      product.slug || "",

    sku:
      product.sku || "",

    status:
      product.status || "",


    // ----------------------------------------
    // MEDIA
    // ----------------------------------------

    gallery,

    videos:
      normalizeVideos(product),

    variants:
      normalizeVariants(
        product.variantPricing,
        gallery,
        product.name || ""
      ),


    // ----------------------------------------
    // PRICING
    // ----------------------------------------

    price,

    // finalPrice is what the customer pays: it already
    // includes making charges, taxes and any discount.
    finalPrice:
      finalPrice ?? price,

    discountType,

    discountValue,

    hasDiscount:
      discountValue > 0,

    makingCharges:
      toNumber(product.makingCharges),

    taxRate:
      toNumber(product.taxRate),


    // ----------------------------------------
    // AVAILABILITY
    // ----------------------------------------

    stock,

    inStock:
      stock === null
        ? null
        : stock > 0,

    stockStatus:
      product.stockStatus || "",

    availableSizes:
      normalizeSizes(product.availableSizes),


    // ----------------------------------------
    // CLASSIFICATION
    // ----------------------------------------

    category:
      product.category || "",

    subCategory:
      toArray(product.subCategory),

    childCategory:
      toArray(product.childCategory),

    sizeCategory:
      product.sizeCategory || "",

    gender:
      toArray(product.gender),

    occasion:
      toArray(product.occasion),

    recipient:
      toArray(product.recipient),


    // ----------------------------------------
    // DETAILS
    // ----------------------------------------

    description:
      product.description || "",

    attributes:
      normalizeAttributes(product.attributes),


    // ----------------------------------------
    // SHIPPING
    // ----------------------------------------

    shippingWeight:
      toNumber(product.shippingWeight),

    weightUnit:
      product.weightUnit || "",

    shippingDimensions:
      typeof product.shippingDimensions === "string"
        ? product.shippingDimensions.trim()
        : "",

    dimensionUnit:
      product.dimensionUnit || "",


    // ----------------------------------------
    // REVIEWS
    // ----------------------------------------

    averageRating:
      toNumber(product.averageRating) || 0,

    totalReviews:
      toNumber(product.totalReviews) || 0,

  };
}


// ==========================================
// IMAGE FALLBACK
// ==========================================

/*
 * The placeholder for an image that fails to load now lives in
 * utils/productImages.js beside the gallery helpers, and is
 * re-exported here because the product-details components have
 * always imported it from this module.
 */

export { PLACEHOLDER_IMAGE };


// ==========================================
// SHARED FORMATTERS
// ==========================================

export function formatPrice(value) {

  const number = Number(value);

  if (!Number.isFinite(number)) return "";


  return `₹${Math.round(number).toLocaleString(
    "en-IN"
  )}`;
}



// Shared by productInfo.js's stock badge and productTabs.js's
// Specifications tab so "Availability" reads the same way in
// both places instead of two separate derivations drifting apart.
export function getAvailabilityLabel(product) {

  if (product.inStock === null) return "";


  if (product.inStock) {

    return (
      product.stockStatus ||
      (product.stock <= 5
        ? `Only ${product.stock} left in stock`
        : "In Stock")
    );
  }


  return (
    product.stockStatus ||
    "Out of Stock"
  );
}


export function formatDiscount(product) {

  // discountValue is always the percentage number itself
  // (e.g. 5 means "5% off"), regardless of discountType —
  // mirrors components/showcase/showcaseCard.js.
  if (product?.discountValue > 0) {
    return `${product.discountValue}% OFF`;
  }


  // Backend didn't send a discountValue, but the final price is
  // still lower than the base price — derive the badge from
  // the actual price gap so it never goes missing.
  if (product?.price && product.finalPrice < product.price) {

    const percentOff = Math.round(
      ((product.price - product.finalPrice) / product.price) * 100
    );

    return percentOff > 0 ? `${percentOff}% OFF` : "";
  }


  return "";
}


// Backend strings are rendered through innerHTML templates,
// so escape them here rather than trusting CMS input.
export function escapeHtml(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
