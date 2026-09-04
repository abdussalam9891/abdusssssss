/*
 * The backend keys a cart line by productId + selectedSize and has
 * no field of its own for a variant (see services/cartService.js's
 * verified contract — selectedSize is the only per-line option it
 * stores, and removecart/getcart return nothing else). Two variants
 * of the same product in the same size therefore collapse into a
 * single line of quantity 2 instead of staying apart.
 *
 * So the variant rides along inside selectedSize: the size label
 * and the variant's attribute values are packed into one string
 * here, and unpacked again wherever a line is shown. That keeps the
 * whole round trip — add, quantity update, cart page, checkout,
 * order history — working off the one field the backend honours.
 *
 * A variant with no attributes is the base product itself (see
 * features/productDetails/model.js's normalizeVariants), so it adds
 * nothing to the key: lines carted before this existed, and every
 * product without variants, still read as a plain size.
 */

const VARIANT_SEPARATOR = " | ";


/*
 * The variant's identity as a shopper would name it — the attribute
 * values only ("SILVER", "Gold / Small"). Deliberately not
 * variant.label, which falls back to the product's own name for the
 * base variant and would put the whole product name in the key.
 */
export function describeVariant(variant) {

  if (!variant?.attributes?.length) return "";


  return variant.attributes
    .map((attribute) => attribute.value)
    .filter(Boolean)
    .join(" / ");
}


export function buildCartSize(sizeLabel, variant) {

  const size =
    (sizeLabel || "").trim();

  const variantLabel =
    describeVariant(variant);

  if (!variantLabel) return size;


  // The separator is kept even when there's no size, so a
  // variant-only line still parses back as a variant rather than
  // as a size named "SILVER".
  return `${size}${VARIANT_SEPARATOR}${variantLabel}`;
}


export function parseCartSize(rawSize) {

  const value =
    rawSize || "";

  const index =
    value.indexOf(VARIANT_SEPARATOR);

  if (index === -1) {

    return {
      size: value.trim(),
      variant: "",
    };
  }


  return {

    size:
      value.slice(0, index).trim(),

    variant:
      value
        .slice(index + VARIANT_SEPARATOR.length)
        .trim(),

  };
}


/*
 * The one-line "Size: 18 · SILVER" caption shared by the cart row,
 * the checkout summary and the order card, so a line reads the same
 * way everywhere instead of three separate derivations drifting.
 */
export function formatCartSize(rawSize) {

  const { size, variant } =
    parseCartSize(rawSize);

  return [
    size ? `Size: ${size}` : "",
    variant,
  ]
    .filter(Boolean)
    .join(" · ");
}
