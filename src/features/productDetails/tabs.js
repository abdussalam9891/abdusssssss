export function initProductTabs() {

  const productInfo =
    document.getElementById("productInfo");

  if (!productInfo) return;


  const buttons =
    productInfo.querySelectorAll(".product-tab");


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

      productInfo
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

      productInfo
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
