import { setSelectedSize } from "./state.js";
import { refreshEnquiryLinks } from "./enquiry.js";
import { refreshQuantityLimits } from "./quantity.js";


/*
 * Sizes render only when the backend provides them (see
 * components/productDetails/productInfo.js createSizes), and a
 * default is already selected in state on load — this just wires
 * up choosing a different one.
 */

export function initSizeSelector() {

  const container =
    document.getElementById(
      "productSizeOptions"
    );

  if (!container) return;


  const buttons =
    container.querySelectorAll(
      ".product-size-option"
    );


  function applyActive(selectedLabel) {

    buttons.forEach((button) => {

      const isActive =
        button.dataset.sizeLabel ===
        selectedLabel;

      button.classList.toggle(
        "border-[#181818]",
        isActive
      );

      button.classList.toggle(
        "bg-[#181818]",
        isActive
      );

      button.classList.toggle(
        "text-white",
        isActive
      );

      if (!button.disabled) {

        button.classList.toggle(
          "border-[#ECE5D8]",
          !isActive
        );

        button.classList.toggle(
          "text-[#181818]",
          !isActive
        );

      }

    });

  }


  buttons.forEach((button) => {

    if (button.disabled) return;


    button.addEventListener(
      "click",
      () => {

        const label =
          button.dataset.sizeLabel;

        const stockAttr =
          button.dataset.sizeStock;


        setSelectedSize({
          label,
          stock:
            stockAttr === ""
              ? null
              : Number(stockAttr),
        });


        applyActive(label);

        refreshQuantityLimits();

        refreshEnquiryLinks();

      }
    );

  });

}
