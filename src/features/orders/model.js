/*
 * The my-orders response contract isn't pinned down against a live
 * authenticated reply for this store yet (see ordersService.js), so
 * every field here is read defensively with fallbacks rather than
 * assumed to exist.
 */

function resolveProductId(item) {

  const productId =
    item?.productId ??
    item?.product;

  if (!productId) return "";

  if (typeof productId === "string") return productId;

  return productId._id || productId.id || "";
}


// Mirrors features/productDetails/model.js's normalizeGallery — the
// backend's image array entries can be plain URL strings or
// { url, position } objects depending on the endpoint.
export function getProductImage(product) {

  if (!product) return "";

  if (product.image) return product.image;

  const images =
    Array.isArray(product.images)
      ? [...product.images]
          .sort(
            (a, b) =>
              (a?.position ?? 0) - (b?.position ?? 0)
          )
          .map(
            (image) =>
              typeof image === "string"
                ? image
                : image?.url
          )
          .filter(Boolean)
      : [];

  return images[0] || "";
}


function resolveProductImage(item) {

  const productId =
    item?.productId ??
    item?.product;

  // Confirmed live: banshiwale's /orders/my-orders returns each
  // item's own `image` as an array of URL strings (a snapshot taken
  // at order time), not a single string — unlike every other image
  // field on this backend. A bare string is also accepted in case
  // that ever changes.
  if (Array.isArray(item?.image)) {
    return item.image.find(Boolean) || "";
  }

  if (typeof item?.image === "string" && item.image) {
    return item.image;
  }

  if (typeof productId !== "object" || !productId) return "";

  return getProductImage(productId);
}


function normalizeOrderItem(item) {

  const productId =
    item?.productId ??
    item?.product;

  return {
    productId: resolveProductId(item),

    name:
      item?.name ||
      (typeof productId === "object" ? productId?.name : "") ||
      "Product",

    image: resolveProductImage(item),

    price: Number(item?.finalPrice ?? item?.price) || 0,

    quantity: Number(item?.quantity) || 1,

    selectedSize: item?.selectedSize || item?.size || "",
  };
}


export function normalizeOrder(order) {

  return {
    id: order?._id || order?.id || "",

    orderNumber:
      order?.orderNumber ||
      order?._id ||
      order?.id ||
      "",

    status:
      order?.status ||
      order?.orderStatus ||
      "Placed",

    paymentMethod: order?.paymentMethod || "",

    placedAt:
      order?.createdAt ||
      order?.placedAt ||
      order?.orderDate ||
      "",

    totalAmount:
      Number(
        order?.totalAmount ?? order?.grandTotal
      ) || 0,

    items: Array.isArray(order?.items)
      ? order.items.map(normalizeOrderItem)
      : [],
  };
}
