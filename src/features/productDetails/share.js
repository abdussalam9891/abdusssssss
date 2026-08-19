import { productState } from "./state.js";
import { showToast } from "../../utils/toast.js";


export function initShareButton() {

  const button =
    document.getElementById(
      "productShareButton"
    );

  if (!button) return;


  button.addEventListener(
    "click",
    async () => {

      const product =
        productState.product;

      const url =
        window.location.href;

      const title =
        product?.name || "Banshiwaale";


      if (navigator.share) {

        try {

          await navigator.share({
            title,
            url,
          });

        } catch (error) {

          // AbortError just means the user cancelled the
          // native share sheet — nothing to report.
          if (error?.name !== "AbortError") {

            console.error(
              "[Product Details] Share failed:",
              error
            );

          }

        }

        return;
      }


      try {

        await navigator.clipboard.writeText(url);

        showToast({
          type: "success",
          title: "Link Copied",
          message: "Product link copied to clipboard.",
        });

      } catch (error) {

        console.error(
          "[Product Details] Could not copy link:",
          error
        );

        showToast({
          type: "error",
          title: "Could Not Copy Link",
          message:
            "Please copy the link from your browser's address bar.",
        });

      }

    }
  );

}
