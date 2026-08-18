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

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}


function normalizeGallery(images) {

  if (!Array.isArray(images)) return [];


  return [...images]
    .sort(
      (a, b) =>
        (a?.position ?? 0) -
        (b?.position ?? 0)
    )
    .map(
      (image) =>
        typeof image === "string"
          ? image
          : image?.url
    )
    .filter(Boolean);
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

      name:
        attribute?.name || "",

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

    gallery:
      normalizeGallery(product.images),

    videos:
      normalizeVideos(product),


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
// SHARED FORMATTERS
// ==========================================

export function formatPrice(value) {

  const number = Number(value);

  if (!Number.isFinite(number)) return "";


  return `₹${number.toLocaleString(
    "en-IN",
    {
      maximumFractionDigits: 2,
    }
  )}`;
}


export function formatDiscount(product) {

  if (!product?.hasDiscount) return "";


  return product.discountType === "Percentage"
    ? `${product.discountValue}% OFF`
    : `${formatPrice(product.discountValue)} OFF`;
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
