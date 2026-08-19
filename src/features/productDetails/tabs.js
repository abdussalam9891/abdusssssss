export function initProductTabs() {

  const productSpecs =
    document.getElementById("productSpecs");

  if (!productSpecs) return;


  const buttons =
    productSpecs.querySelectorAll(".product-tab");


  buttons.forEach((button) => {

    button.addEventListener("click", () => {

      const wrapper =
        button.parentElement;

      if (!wrapper) return;


      const content =
        wrapper.querySelector(".tab-content");

      const icon =
        wrapper.querySelector(".tab-icon");

      if (!content || !icon) return;


      const isOpen =
        content.classList.contains(
          "max-h-[600px]"
        );


      /* ------------------------------------------ */
      /* CLOSE ALL TABS                            */
      /* ------------------------------------------ */

      productSpecs
        .querySelectorAll(".tab-content")
        .forEach((item) => {

          item.classList.remove(
            "max-h-[600px]",
            "pb-8"
          );

          item.classList.add(
            "max-h-0"
          );

        });


      /* ------------------------------------------ */
      /* RESET ALL ICONS                           */
      /* ------------------------------------------ */

      productSpecs
        .querySelectorAll(".tab-icon")
        .forEach((item) => {

          item.setAttribute(
            "data-lucide",
            "plus"
          );

        });


      /* ------------------------------------------ */
      /* OPEN CLICKED TAB                          */
      /* ------------------------------------------ */

      if (!isOpen) {

        content.classList.remove(
          "max-h-0"
        );

        content.classList.add(
          "max-h-[600px]",
          "pb-8"
        );

        icon.setAttribute(
          "data-lucide",
          "minus"
        );

      }


      /* ------------------------------------------ */
      /* REFRESH LUCIDE ICONS                      */
      /* ------------------------------------------ */

      window.lucide?.createIcons();

    });

  });

}
