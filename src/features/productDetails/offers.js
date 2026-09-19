import { offersService } from "../../services/offersService.js";
import { escapeHtml, formatPrice } from "./model.js";
import { showToast } from "../../utils/toast.js";


function describeCoupon(coupon) {

  const discount =
    Number(coupon?.discount);

  const title =
    Number.isFinite(discount) && discount > 0
      ? `${discount}% OFF`
      : coupon?.couponCode || "Offer";


  const minPurchase =
    Number(coupon?.minPurchase);

  const subtitle =
    Number.isFinite(minPurchase) && minPurchase > 0
      ? `Min. purchase ${formatPrice(minPurchase)}`
      : "";


  return { title, subtitle };
}


function createOfferRow(coupon, index) {

  const { title, subtitle } =
    describeCoupon(coupon);

  const code =
    coupon?.couponCode || "";

  if (!code) return "";


  return `

<div
  data-offer-row="${index}"

  class="
    overflow-hidden

    rounded-xl

    border
    border-[#ECE5D8]
  "
>

  <button
    type="button"

    data-offer-toggle="${index}"

    class="
      flex

      w-full

      items-center
      justify-between

      gap-3

      px-4
      py-3

      text-left

      transition-colors
      duration-300

      hover:bg-[#FCFAF6]
    "
  >

    <span class="text-[13px] font-medium text-ink">
      ${escapeHtml(title)}
      ${
        subtitle
          ? `<span class="block text-[12px] font-normal text-[#8A8A8A]">${escapeHtml(subtitle)}</span>`
          : ""
      }
    </span>

    <i
      data-lucide="chevron-down"
      data-offer-icon="${index}"

      class="
        h-4
        w-4
        shrink-0

        text-[#B0AA9D]

        transition-transform
        duration-300
      "
    ></i>

  </button>


  <div
    data-offer-body="${index}"

    class="hidden border-t border-[#F2ECE3] px-4 py-3"
  >

    <div class="flex items-center justify-between gap-3">

      <span
        class="
          rounded
          border
          border-dashed
          border-[#B0AA9D]

          px-2
          py-1

          font-mono

          text-[12px]
          font-semibold

          text-ink
        "
      >
        ${escapeHtml(code)}
      </span>

      <button
        type="button"
        data-offer-copy="${index}"
        data-offer-code="${escapeHtml(code)}"

        class="
          text-[12px]
          font-semibold

          text-primary

          hover:underline
        "
      >
        Copy Code
      </button>

    </div>

  </div>

</div>

`;
}


export async function initOffers() {

  const container =
    document.getElementById("productOffers");

  const list =
    document.getElementById("productOffersList");

  if (!container || !list) return;


  let coupons = [];

  try {

    coupons =
      await offersService.getAvailableCoupons();

  } catch (error) {

    console.error(
      "[Product Details] Failed to load offers:",
      error
    );

    return;
  }


  const rows =
    coupons
      .map((coupon, index) => createOfferRow(coupon, index))
      .filter(Boolean);

  if (!rows.length) return;


  list.innerHTML =
    rows.join("");

  container.classList.remove("hidden");


  window.lucide?.createIcons();


  list.addEventListener("click", (event) => {

    const toggle =
      event.target.closest("[data-offer-toggle]");

    if (toggle) {

      const index =
        toggle.dataset.offerToggle;

      const body =
        list.querySelector(
          `[data-offer-body="${index}"]`
        );

      const icon =
        list.querySelector(
          `[data-offer-icon="${index}"]`
        );

      body?.classList.toggle("hidden");

      icon?.classList.toggle("rotate-180");

      return;
    }


    const copyButton =
      event.target.closest("[data-offer-copy]");

    if (copyButton) {

      const code =
        copyButton.dataset.offerCode || "";

      navigator.clipboard
        ?.writeText(code)
        .then(() => {

          showToast({
            type: "success",
            title: "Code Copied",
            message: `${code} has been copied to your clipboard.`,
          });

        })
        .catch(() => {});

    }

  });

}
