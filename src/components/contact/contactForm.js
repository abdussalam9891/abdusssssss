/*
 * The contact card renders immediately with neutral
 * placeholders. features/contact/hydrateContactInfo.js fills the
 * [data-contact-*] hooks in place once the backend answers, so
 * the form is usable without waiting for a request and no
 * contact detail is ever invented locally.
 */

const LOADING_TEXT = "Loading…";


export function createContactForm(contactInfo = {}) {

  const {
    email = "",
    phone = "",
    whatsapp = "",
    address = "",
    supportTime = "",
  } = contactInfo;


  const whatsappDigits =
    whatsapp.replace(/\D/g, "");


  const whatsappUrl =
    whatsappDigits
      ? `https://wa.me/91${whatsappDigits}`
      : "#";


  return `

    <div
      class="
        mx-auto
        grid
        max-w-7xl

        gap-8

        px-6
        py-16

        md:py-20

        lg:grid-cols-[1.6fr_0.9fr]
        lg:items-stretch
      "
    >

      <!-- =====================================
           LEFT — CONTACT FORM
      ====================================== -->

      <div
        class="
          reveal
          reveal-left

          rounded-[32px]

          bg-[#FAF8F5]

          p-8

          md:p-10

          lg:p-12
        "
      >

        <!-- HEADER -->

        <div>

          <span
            class="
              text-xs
              font-semibold
              uppercase
              tracking-[0.22em]

              text-[#A07936]
            "
          >
            Get In Touch
          </span>


          <h2
            class="
              mt-4

              font-serif

              text-4xl
              leading-tight

              text-[#181818]

              md:text-5xl
            "
          >
            We'd Love to Hear From You
          </h2>


          <p
            class="
              mt-5

              max-w-2xl

              leading-8

              text-[#6B6B6B]
            "
          >
            Fill out the form below and our team will get back to you
            as soon as possible.
          </p>

        </div>


        <!-- FORM -->

        <form
          id="contactForm"

          class="
            mt-12

            space-y-7
          "
        >

          <!-- NAME -->

          <div>

            <label
              for="contactName"

              class="
                mb-3
                block
                text-sm
                font-medium
                text-[#181818]
              "
            >
              Full Name
            </label>


            <input
              id="contactName"
              name="name"
              type="text"
              autocomplete="name"
              inputmode="text"
              placeholder="Enter your full name"
              required
              minlength="2"
              maxlength="80"
              pattern="[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '\\-][A-Za-zÀ-ÖØ-öø-ÿ]+)*"

              class="
                w-full

                rounded-2xl

                border
                border-[#DDD7CF]

                bg-white

                px-6
                py-4

                text-[#181818]

                outline-none

                transition-all
                duration-300

                placeholder:text-[#A5A09A]

                focus:border-[#A07936]
                focus:ring-1
                focus:ring-[#A07936]
              "
            />

          </div>


          <!-- EMAIL -->

          <div>

            <label
              for="contactEmail"

              class="
                mb-3
                block
                text-sm
                font-medium
                text-[#181818]
              "
            >
              Email Address
            </label>


            <input
              id="contactEmail"
              name="email"
              type="email"
              autocomplete="email"
              inputmode="email"
              placeholder="name@example.com"
              required
              maxlength="254"

              class="
                w-full

                rounded-2xl

                border
                border-[#DDD7CF]

                bg-white

                px-6
                py-4

                text-[#181818]

                outline-none

                transition-all
                duration-300

                placeholder:text-[#A5A09A]

                focus:border-[#A07936]
                focus:ring-1
                focus:ring-[#A07936]
              "
            />

          </div>


          <!-- PHONE -->

          <div>

            <label
              for="contactPhone"

              class="
                mb-3
                block
                text-sm
                font-medium
                text-[#181818]
              "
            >
              Phone Number
            </label>


            <input
              id="contactPhone"
              name="phone"
              type="tel"
              autocomplete="tel"
              inputmode="numeric"
              placeholder="+91 98765 43210"
              required
              minlength="10"
              maxlength="15"
              pattern="\\+?[0-9]{10,15}"

              class="
                w-full

                rounded-2xl

                border
                border-[#DDD7CF]

                bg-white

                px-6
                py-4

                text-[#181818]

                outline-none

                transition-all
                duration-300

                placeholder:text-[#A5A09A]

                focus:border-[#A07936]
                focus:ring-1
                focus:ring-[#A07936]
              "
            />

          </div>


          <!-- MESSAGE -->

          <div>

            <label
              for="contactMessage"

              class="
                mb-3
                block
                text-sm
                font-medium
                text-[#181818]
              "
            >
              Message
            </label>


            <textarea
              id="contactMessage"
              name="message"
              rows="7"
              placeholder="Tell us how we can help you..."
              required

              class="
                w-full

                resize-none

                rounded-2xl

                border
                border-[#DDD7CF]

                bg-white

                px-6
                py-5

                text-[#181818]

                outline-none

                transition-all
                duration-300

                placeholder:text-[#A5A09A]

                focus:border-[#A07936]
                focus:ring-1
                focus:ring-[#A07936]
              "
            ></textarea>

          </div>


          <!-- STATUS -->

          <p
            id="contactFormMessage"

            class="
              hidden
              text-sm
              leading-6
            "
            aria-live="polite"
          ></p>


          <!-- SUBMIT -->

          <button
            id="contactSubmitButton"
            type="submit"

            class="
              group
              relative
              inline-flex

              items-center
              justify-center

              overflow-hidden

              rounded-full

              bg-[#181818]

              px-10
              py-4

              text-sm
              font-medium
              uppercase
              tracking-[0.18em]

              text-white

              transition-all
              duration-300

              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >

            <span
              class="
                absolute
                inset-0

                origin-left

                scale-x-0

                rounded-full

                bg-[#A07936]

                transition-transform
                duration-700

                ease-[cubic-bezier(0.22,1,0.36,1)]

                group-hover:scale-x-100
              "
            ></span>


            <span
              id="contactSubmitText"

              class="
                relative
                z-10
              "
            >
              Send Message
            </span>

          </button>

        </form>

      </div>


      <!-- =====================================
           RIGHT — CONTACT INFORMATION
      ====================================== -->

      <aside
        class="
          reveal
          reveal-right

          flex
          h-full
          flex-col

          overflow-hidden

          rounded-[32px]

          bg-[#181818]

          p-8

          text-white

          md:p-10
        "
      >

        <!-- TOP -->

        <div>

          <span
            class="
              text-xs
              font-semibold
              uppercase
              tracking-[0.22em]

              text-[#A07936]
            "
          >
            Contact Banshiwale
          </span>


          <h3
            class="
              mt-4

              font-serif

              text-3xl
              leading-tight

              md:text-4xl
            "
          >
            We're Here To Help.
          </h3>


          <p
            class="
              mt-5

              leading-7

              text-white/65
            "
          >
            Have a question about our jewellery, your order, or
            anything else? Our team is always happy to assist.
          </p>

        </div>


        <!-- CONTACT DETAILS -->

        <div
          class="
            mt-10

            space-y-7
          "
        >

          <!-- BACKEND ERROR STATE -->

          <p
            data-contact-error

            class="
              hidden

              text-sm
              leading-6

              text-red-400
            "
            aria-live="polite"
          >
            Contact details are unavailable right now.
            Please use the form to reach us.
          </p>


          <!-- WHATSAPP -->

          <a
            href="${whatsappUrl}"

            data-contact-whatsapp

            target="_blank"
            rel="noopener noreferrer"

            class="
              group
              flex
              items-start
              gap-4
            "
          >

            <div
              class="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center

                rounded-full

                border
                border-white/10

                text-[#A07936]
              "
            >

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                fill="currentColor"
                class="h-5 w-5"
              >
                <path d="M16 3C8.83 3 3 8.72 3 15.78c0 2.54.74 4.99 2.14 7.11L3.5 29l6.32-1.61A13.1 13.1 0 0 0 16 28.56c7.17 0 13-5.72 13-12.78S23.17 3 16 3Zm0 23.12a10.9 10.9 0 0 1-5.57-1.53l-.4-.24-3.75.95 1-3.63-.26-.42a10.53 10.53 0 0 1-1.63-5.47C5.39 10.1 10.06 5.5 16 5.5s10.61 4.6 10.61 10.28S21.94 26.12 16 26.12Zm5.88-7.74c-.32-.16-1.9-.93-2.2-1.04-.29-.1-.5-.16-.71.16s-.82 1.03-1 1.24c-.19.21-.37.24-.69.08-.32-.16-1.34-.49-2.55-1.56-.94-.83-1.57-1.86-1.76-2.18-.18-.31-.02-.48.14-.64.14-.14.32-.37.48-.56.16-.18.21-.31.32-.52.1-.21.05-.39-.03-.55-.08-.16-.71-1.69-.97-2.32-.26-.61-.53-.53-.71-.54h-.61c-.21 0-.55.08-.84.39-.29.31-1.11 1.08-1.11 2.63s1.13 3.05 1.29 3.26c.16.21 2.22 3.35 5.38 4.69.75.32 1.34.51 1.8.66.76.24 1.45.21 2 .13.61-.09 1.9-.78 2.17-1.54.27-.76.27-1.41.19-1.54-.08-.13-.29-.21-.61-.37Z"/>
              </svg>

            </div>

            <div>

              <span
                class="
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]

                  text-[#A07936]
                "
              >
                WhatsApp
              </span>


              <span
                data-contact-whatsapp-text

                class="
                  mt-2
                  block

                  text-sm

                  text-white/80

                  transition-colors
                  duration-300

                  group-hover:text-white
                "
              >
                ${whatsapp || phone || LOADING_TEXT}
              </span>

            </div>

          </a>


          <!-- EMAIL -->

          <a
            href="${email ? `mailto:${email}` : "#"}"

            data-contact-email

            class="
              group
              flex
              items-start
              gap-4
            "
          >

            <div
              class="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center

                rounded-full

                border
                border-white/10

                text-[#A07936]
              "
            >

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-5 w-5"
              >
                <path d="M4 5h16v14H4z" />
                <path d="m4 6 8 7 8-7" />
              </svg>

            </div>

            <div>

              <span
                class="
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]

                  text-[#A07936]
                "
              >
                Email
              </span>


              <span
                data-contact-email-text

                class="
                  mt-2
                  block

                  break-all

                  text-sm

                  text-white/80

                  transition-colors
                  duration-300

                  group-hover:text-white
                "
              >
                ${email || LOADING_TEXT}
              </span>

            </div>

          </a>


          <!-- PHONE -->

          <a
            href="${phone ? `tel:${phone}` : "#"}"

            data-contact-phone

            class="
              group
              flex
              items-start
              gap-4
            "
          >

            <div
              class="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center

                rounded-full

                border
                border-white/10

                text-[#A07936]
              "
            >

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="h-5 w-5"
              >
                <path d="M6.6 10.8c1.4 2.7 3.6 4.9 6.3 6.3l2.1-2.1c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.4 21 3 13.6 3 4.5c0-.6.4-1 1-1H7.6c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.2 1L6.6 10.8Z" />
              </svg>

            </div>

            <div>

              <span
                class="
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]

                  text-[#A07936]
                "
              >
                Phone
              </span>


              <span
                data-contact-phone-text

                class="
                  mt-2
                  block

                  text-sm

                  text-white/80

                  transition-colors
                  duration-300

                  group-hover:text-white
                "
              >
                ${phone || LOADING_TEXT}
              </span>

            </div>

          </a>

        </div>


        <!-- OFFICE -->

        <div
          class="
            mt-10

            border-t
            border-white/10

            pt-8
          "
        >

          <span
            class="
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.18em]

              text-[#A07936]
            "
          >
            Banshiwale Office
          </span>


          <div
            class="
              mt-4
              flex
              gap-4
            "
          >

            <!-- LOCATION ICON -->

            <div
              class="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center

                rounded-full

                border
                border-white/10

                text-[#A07936]
              "
            >

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.5"
                class="h-5 w-5"
              >

                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"
                />

                <circle
                  cx="12"
                  cy="9"
                  r="2.2"
                />

              </svg>

            </div>


            <p
              data-contact-address

              class="
                text-sm
                leading-7

                text-white/70
              "
            >
              ${address || LOADING_TEXT}
            </p>

          </div>

        </div>


        <!-- BOTTOM — PUSH TO BOTTOM -->

        <div
          class="
            mt-auto

            border-t
            border-white/10

            pt-8
          "
        >

          <div
            class="
              flex
              items-end
              justify-between
              gap-4
            "
          >

            <div>

              <span
                class="
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]

                  text-[#A07936]
                "
              >
                Support Hours
              </span>


              <p
                data-contact-support-time

                class="
                  mt-2

                  text-sm

                  text-white/75
                "
              >
                ${supportTime || LOADING_TEXT}
              </p>

            </div>


            <span
              class="
                h-2
                w-2

                rounded-full

                bg-[#A07936]

                shadow-[0_0_0_5px_rgba(160,121,54,.12)]
              "
            ></span>

          </div>

        </div>

      </aside>

    </div>

  `;
}
