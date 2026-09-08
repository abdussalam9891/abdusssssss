function createToastContainer() {
  return `
<div
  id="toastContainer"

  class="
    fixed

    top-6
    right-6

    z-[9999]

    flex
    flex-col

    gap-4

    pointer-events-none
  "
></div>
`;
}

export function initToast() {

  if (
    document.getElementById(
      "toastContainer"
    )
  ) {
    return;
  }

  document.body.insertAdjacentHTML(
    "beforeend",
    createToastContainer()
  );

}
