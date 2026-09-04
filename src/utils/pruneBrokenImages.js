/*
 * A product can be published with an image whose file never made it
 * to storage: the url sits in the payload but answers 403/404. The
 * <img> onerror fallbacks stop such a slide from rendering blank,
 * but the shopper still meets a placeholder as the first gallery
 * slide and it still spends a thumbnail slot. Probing the urls once
 * before the gallery is built drops them from the running instead.
 */


const PROBE_TIMEOUT_MS = 4000;


// One probe per url for the life of the page — a variant switch
// reuses the base gallery's answers instead of re-testing them.
const probeCache = new Map();


function probe(url) {

  const cached = probeCache.get(url);

  if (cached) return cached;


  const result = new Promise((resolve) => {

    const image = new Image();

    let timer = null;
    let settled = false;


    function finish(reachable) {

      if (settled) return;

      settled = true;

      clearTimeout(timer);

      resolve(reachable);
    }


    /*
     * A slow connection must not hold the render hostage. An
     * image that hasn't answered in time counts as reachable and
     * keeps its placeholder fallback as the safety net.
     */
    timer = setTimeout(
      () => finish(true),
      PROBE_TIMEOUT_MS
    );


    image.onload = () => finish(true);

    image.onerror = () => finish(false);

    image.src = url;

  });


  probeCache.set(url, result);

  return result;
}


/*
 * Whether a single url actually resolves to an image. Shares the
 * probe cache above, so asking about a url the gallery already
 * tested costs nothing.
 */
export function isImageReachable(url) {

  if (!url) return Promise.resolve(false);


  return probe(url);
}


export async function pruneBrokenImages(urls) {

  if (!Array.isArray(urls)) return [];


  /*
   * Nothing to choose between with a single image, and dropping it
   * would only swap one degraded state for another — the gallery's
   * own "no images" branch already covers that.
   */
  if (urls.length < 2) return urls;


  const reachable =
    await Promise.all(
      urls.map(probe)
    );


  const kept =
    urls.filter(
      (_, index) => reachable[index]
    );


  /*
   * Every image failing points at the shopper being offline rather
   * than at a product with no photos, so the original list stands.
   */
  return kept.length ? kept : urls;
}


/*
 * Prunes the base gallery and every variant's own images, so
 * switching a variant later (state.js applyVariantToProduct copies
 * variant.images onto the product) can't reintroduce a dead url.
 */
export async function pruneProductImages(product) {

  if (!product) return product;


  const variants =
    Array.isArray(product.variants)
      ? product.variants
      : [];


  const [gallery, ...variantGalleries] =
    await Promise.all([
      pruneBrokenImages(product.gallery),
      ...variants.map(
        (variant) =>
          pruneBrokenImages(variant.images)
      ),
    ]);


  product.gallery = gallery;

  variants.forEach((variant, index) => {

    variant.images = variantGalleries[index];

  });


  return product;
}
