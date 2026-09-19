import { escapeHtml, formatPrice } from "../../utils/format.js";
import { formatCartSize } from "../../utils/cartLine.js";


// Self-contained inline placeholder — mirrors
// features/cart/cartItemRow.js / features/wishlist/wishlistCard.js's
// copy of the same, so a broken/missing order-item thumbnail never
// falls back to another broken image path.
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">` +
    `<rect width="400" height="400" fill="#FCFBF9"/>` +
    `<path d="M140 250 L190 170 L225 215 L260 160 L305 250 Z" ` +
    `fill="none" stroke="#D8CBB0" stroke-width="10" stroke-linejoin="round"/>` +
    `<circle cx="170" cy="140" r="20" fill="none" stroke="#D8CBB0" stroke-width="10"/>` +
    `</svg>`
  );


const STATUS_STYLES = {
  delivered: "bg-[#E9F5EC] text-[#1E7B3C]",
  cancelled: "bg-[#FBEAE9] text-[#B3261E]",
  canceled: "bg-[#FBEAE9] text-[#B3261E]",
  returned: "bg-[#FBEAE9] text-[#B3261E]",
  shipped: "bg-[#EAF1FB] text-[#1D4E9B]",
  "out for delivery": "bg-[#EAF1FB] text-[#1D4E9B]",
};

const DEFAULT_STATUS_STYLE = "bg-[#FAF7F1] text-primary";


function statusBadgeClasses(status) {

  return (
    STATUS_STYLES[String(status).toLowerCase()] ||
    DEFAULT_STATUS_STYLE
  );
}


function formatOrderDate(isoString) {

  if (!isoString) return "";

  try {

    return new Date(isoString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  } catch {

    return "";
  }

}


function createOrderItemRow(item) {

  const detailsHref =
    item.productId
      ? `/pages/product-details.html?id=${encodeURIComponent(item.productId)}`
      : "#";

  const lineTotal =
    formatPrice(item.price * item.quantity);

  return `

<a
  href="${detailsHref}"

  class="
    flex

    gap-4

    py-4

    transition-colors
    duration-300

    hover:bg-[#FCFBF9]
  "
>

  <div
    class="
      h-16
      w-16

      shrink-0

      overflow-hidden

      rounded-xl

      border
      border-[#ECE5D8]

      bg-[#FCFBF9]
    "
  >
    <img
      data-order-item-image="${escapeHtml(item.productId)}"

      src="${escapeHtml(item.image || PLACEHOLDER_IMAGE)}"

      alt="${escapeHtml(item.name)}"

      loading="lazy"

      onerror="this.onerror=null;this.src='${PLACEHOLDER_IMAGE}';"

      class="
        h-full
        w-full

        object-cover
      "
    >
  </div>

  <div
    class="
      flex

      min-w-0

      flex-1

      items-center

      justify-between

      gap-4
    "
  >

    <div class="min-w-0">

      <p
        class="
          line-clamp-2

          text-[14px]
          sm:text-[15px]

          font-medium

          text-ink
        "
      >
        ${escapeHtml(item.name)}
      </p>

      <p
        class="
          mt-1

          text-[12px]

          text-[#8A8A8A]
        "
      >
        ${
          [
            escapeHtml(formatCartSize(item.selectedSize)),

            `Qty: ${item.quantity}`,
          ]
            .filter(Boolean)
            .join(" · ")
        }
      </p>

    </div>

    ${
      lineTotal
        ? `
<span
  class="
    shrink-0

    text-[14px]

    font-semibold

    text-ink
  "
>
  ${lineTotal}
</span>
`
        : ""
    }

  </div>

</a>

`;
}


export function createOrderCard(order) {

  const itemsHtml =
    order.items
      .map((item) => createOrderItemRow(item))
      .join("");

  const orderDate =
    formatOrderDate(order.placedAt);

  return `

<div
  class="
    overflow-hidden

    rounded-[24px]

    border
    border-[#F3EEE6]

    bg-white
  "
>

  <!-- HEADER -->

  <div
    class="
      flex

      flex-wrap

      items-center

      justify-between

      gap-3

      border-b
      border-[#F3EEE6]

      bg-[#FCFBF9]

      px-5
      sm:px-6

      py-4
    "
  >

    <div class="min-w-0">

      <p
        class="
          text-[11px]

          uppercase

          tracking-[0.18em]

          text-[#8A8A8A]
        "
      >
        Order ${escapeHtml(order.orderNumber)}
      </p>

      ${
        orderDate
          ? `
<p
  class="
    mt-1

    text-[12px]

    text-[#99938B]
  "
>
  Placed on ${escapeHtml(orderDate)}
</p>
`
          : ""
      }

    </div>

    <span
      class="
        inline-flex

        shrink-0

        items-center

        rounded-full

        px-3.5
        py-1.5

        text-[11px]

        font-medium

        uppercase

        tracking-[0.1em]

        ${statusBadgeClasses(order.status)}
      "
    >
      ${escapeHtml(order.status)}
    </span>

  </div>


  <!-- ITEMS -->

  <div
    class="
      divide-y
      divide-[#F3EEE6]

      px-5
      sm:px-6
    "
  >
    ${itemsHtml}
  </div>


  <!-- FOOTER -->

  <div
    class="
      flex

      flex-wrap

      items-center

      justify-between

      gap-3

      border-t
      border-[#F3EEE6]

      px-5
      sm:px-6

      py-4
    "
  >

    <p
      class="
        text-[12px]

        text-[#8A8A8A]
      "
    >
      ${
        order.paymentMethod
          ? `Payment: ${escapeHtml(order.paymentMethod)}`
          : ""
      }
    </p>

    <p
      class="
        text-[15px]

        font-semibold

        text-ink
      "
    >
      Total: ${formatPrice(order.totalAmount) || "—"}
    </p>

  </div>

</div>

`;
}
