export function getProductId() {

  const params =
    new URLSearchParams(window.location.search);

  return params.get("id");

}


export function getProductSlug() {

  const params =
    new URLSearchParams(window.location.search);

  return params.get("slug");

}
