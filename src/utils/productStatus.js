/*
 * The public store endpoint returns every product regardless of
 * publish state, including ones marked "Inactive" by the store
 * admin (drafts / unpublished items). A shopper should never see
 * one of those, so every surface that lists or resolves a raw
 * backend product must run it through this check first.
 */
export function isActiveProduct(product) {

  return (
    product?.status?.toLowerCase() === "active"
  );

}
