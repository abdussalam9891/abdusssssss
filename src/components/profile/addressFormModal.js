/*
 * Static markup only. Add and Edit reuse this one modal —
 * features/profile/addresses.js swaps the title and pre-fills the
 * fields when editing.
 *
 * Layout mirrors components/customizeJewellery/modal.js's
 * responsive pattern: a full-height sheet on mobile (header +
 * scrollable body + sticky footer as flex children) that becomes a
 * centered, capped-height dialog from `sm:` up — rather than
 * components/productDetails/reviewModal.js's simpler fixed-size
 * dialog, which doesn't hold up once cropped for small screens and
 * this many fields.
 *
 * Field names (fullName / mobile / address / city / state /
 * pincode / isDefault) match the backend's Address schema,
 * confirmed via its validation error message
 * ("fullName ... address ... mobile ... required").
 */

const INPUT_CLASSES = `
  w-full

  rounded-2xl

  border
  border-[#E5DFD3]

  bg-white

  px-4
  py-3.5

  text-[14px]

  text-[#181818]

  outline-none

  transition-colors
  duration-300

  placeholder:text-[#B0AA9D]

  focus:border-[#A07936]
  focus:ring-1
  focus:ring-[#A07936]
`;

const LABEL_CLASSES = `
  mb-1.5
  block
  text-[12px]
  font-medium
  text-[#181818]
`;


export function createAddressFormModal() {

  return `

<div
  id="addressFormModal"

  class="
    fixed
    inset-0
    z-[200]

    hidden

    items-center
    justify-center

    bg-black/60
    backdrop-blur-sm

    p-0
    sm:p-4
  "
>

  <div
    id="addressFormModalOverlay"

    class="absolute inset-0"
  ></div>


  <div
    id="addressFormModalPanel"

    class="
      relative
      z-10

      flex

      h-full
      w-full
      max-w-lg

      flex-col

      overflow-hidden

      rounded-none
      sm:rounded-[28px]

      border-0
      sm:border
      border-[#ECE5D8]

      bg-white

      opacity-0
      scale-100
      sm:scale-95

      shadow-[0_30px_90px_rgba(0,0,0,.25)]

      transition-all
      duration-300

      sm:h-auto
      max-h-[100dvh]
      sm:max-h-[88vh]
    "
  >

    <!-- HEADER -->

    <div
      class="
        flex
        shrink-0

        items-center
        justify-between

        border-b
        border-[#F0EAE0]

        px-6
        py-5

        sm:px-7
      "
    >

      <h3
        id="addressFormModalTitle"

        class="
          font-serif

          text-[20px]
          sm:text-[22px]

          italic

          text-[#181818]
        "
      >
        Add Address
      </h3>

      <button
        type="button"
        id="closeAddressFormModal"
        aria-label="Close"

        class="
          flex
          h-9
          w-9
          shrink-0

          items-center
          justify-center

          rounded-full

          text-[#B0AA9D]

          transition-colors
          duration-300

          hover:bg-[#FAF7F1]
          hover:text-[#181818]
        "
      >
        <i data-lucide="x" class="h-5 w-5"></i>
      </button>

    </div>


    <!-- FORM (body scrolls, header/footer stay put) -->

    <form
      id="addressForm"

      class="
        flex

        min-h-0
        flex-1

        flex-col
      "
    >

      <input type="hidden" id="addressFormId" name="addressId" value="">

      <div
        class="
          min-h-0
          flex-1

          space-y-5

          overflow-y-auto

          px-6
          py-6

          sm:px-7
        "
      >

        <div>
          <label for="addressFormFullName" class="${LABEL_CLASSES}">
            Full Name
          </label>
          <input
            id="addressFormFullName"
            name="fullName"
            type="text"
            autocomplete="name"
            maxlength="80"
            required
            placeholder="Recipient's full name"
            class="${INPUT_CLASSES}"
          />
        </div>

        <div>
          <label for="addressFormMobile" class="${LABEL_CLASSES}">
            Mobile Number
          </label>
          <input
            id="addressFormMobile"
            name="mobile"
            type="tel"
            autocomplete="tel"
            inputmode="numeric"
            maxlength="10"
            required
            placeholder="10-digit mobile number"
            class="${INPUT_CLASSES}"
          />
        </div>

        <div>
          <label for="addressFormAddress" class="${LABEL_CLASSES}">
            Full Address
          </label>
          <textarea
            id="addressFormAddress"
            name="address"
            rows="3"
            autocomplete="street-address"
            maxlength="250"
            required
            placeholder="House no., building, street, area, landmark"
            class="${INPUT_CLASSES} resize-none"
          ></textarea>
        </div>

        <div
          class="
            grid

            grid-cols-1
            gap-5

            sm:grid-cols-2
          "
        >

          <div>
            <label for="addressFormCity" class="${LABEL_CLASSES}">
              City
            </label>
            <input
              id="addressFormCity"
              name="city"
              type="text"
              autocomplete="address-level2"
              maxlength="60"
              required
              class="${INPUT_CLASSES}"
            />
          </div>

          <div>
            <label for="addressFormState" class="${LABEL_CLASSES}">
              State
            </label>
            <input
              id="addressFormState"
              name="state"
              type="text"
              autocomplete="address-level1"
              maxlength="60"
              required
              class="${INPUT_CLASSES}"
            />
          </div>

        </div>

        <div>
          <label for="addressFormPincode" class="${LABEL_CLASSES}">
            Pincode
          </label>
          <input
            id="addressFormPincode"
            name="pincode"
            type="text"
            autocomplete="postal-code"
            inputmode="numeric"
            maxlength="6"
            required
            placeholder="6-digit pincode"
            class="${INPUT_CLASSES}"
          />
        </div>

        <label class="flex items-center gap-2.5 pt-1">
          <input
            id="addressFormIsDefault"
            name="isDefault"
            type="checkbox"

            class="
              h-4
              w-4

              rounded

              border-[#DDD7CF]

              text-[#A07936]

              focus:ring-[#A07936]
            "
          />
          <span class="text-[13px] text-[#55514B]">
            Set as default address
          </span>
        </label>


        <p
          id="addressFormError"

          class="hidden text-[13px] text-[#B3261E]"
        ></p>

      </div>


      <!-- FOOTER -->

      <div
        class="
          flex
          shrink-0

          gap-3

          border-t
          border-[#F0EAE0]

          px-6
          py-5

          sm:px-7
        "
      >

        <button
          type="button"
          id="cancelAddressFormModal"

          class="
            flex-1

            rounded-full

            border
            border-[#ECE5D8]

            py-3.5

            text-[12px]

            font-medium

            uppercase

            tracking-[0.14em]

            text-[#181818]

            transition-colors
            duration-300

            hover:border-[#A07936]
          "
        >
          Cancel
        </button>

        <button
          type="submit"
          id="submitAddressFormButton"

          class="
            flex-1

            rounded-full

            bg-[#181818]

            py-3.5

            text-[12px]

            font-medium

            uppercase

            tracking-[0.14em]

            text-white

            transition-colors
            duration-300

            hover:bg-[#A07936]

            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          <span id="submitAddressFormButtonText">Save Address</span>
        </button>

      </div>

    </form>

  </div>

</div>

`;
}
