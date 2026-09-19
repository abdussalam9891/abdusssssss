/*
 * Static shell only — fetching GET /customercoupons/getAvailableCoupons/:domain
 * and rendering the coupon rows is wired up in
 * features/productDetails/offers.js. Starts hidden and is only
 * revealed once real coupons are available, so a backend failure
 * or an empty coupon list simply leaves this out of the page.
 */

export function createOffersSection() {

  return `

<div
  id="productOffers"

  class="hidden"
>

  <p
    class="
      text-[12px]

      font-semibold

      uppercase

      tracking-[0.22em]

      text-primary
    "
  >
    Offers For You
  </p>


  <div
    id="productOffersList"

    class="
      mt-4

      space-y-2
    "
  ></div>

</div>

`;
}
