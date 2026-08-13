// export function getProductImages(product) {
//   const { folder, imageId } = product;

//   return {
//     front: `./src/assets/${folder}/${imageId}-1.webp`,
//     back: `./src/assets/${folder}/${imageId}-2.webp`,
//   };
// }




export function getProductImages(product) {

  // ==========================================
  // API PRODUCT
  // ==========================================

  if (
    Array.isArray(product?.images) &&
    product.images.length > 0
  ) {

    const images =
      [...product.images]
        .sort(
          (a, b) =>
            (a.position ?? 0) -
            (b.position ?? 0)
        );

    return {
      front: images[0]?.url || "",
      back: images[1]?.url || images[0]?.url || "",
    };
  }


  // ==========================================
  // LEGACY LOCAL PRODUCT
  // ==========================================

  const {
    folder,
    imageId
  } = product || {};

  if (folder && imageId) {

    return {
      front:
        `./src/assets/${folder}/${imageId}-1.webp`,

      back:
        `./src/assets/${folder}/${imageId}-2.webp`,
    };

  }


  // ==========================================
  // FALLBACK
  // ==========================================

  return {
    front: "",
    back: "",
  };
}
