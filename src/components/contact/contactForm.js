export function createContactForm() {

  return `

    <div
      class="
        mx-auto
        max-w-4xl
        px-6
        py-20
        md:py-24
      "
    >

      <!-- HEADER -->

      <div
        class="
          text-center
          reveal
          reveal-up
        "
      >



        <h2
          class="
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
            mx-auto
            mt-6
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
          mx-auto
          mt-14
          max-w-3xl
          space-y-8
          reveal
          reveal-up
        "
      >

        <!-- NAME -->

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
    pattern="[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '\-][A-Za-zÀ-ÖØ-öø-ÿ]+)*"
    title="Please enter a valid name using letters, spaces, hyphens or apostrophes."
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
    pattern="\+?[0-9]{10,15}"
    title="Please enter a valid phone number."
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
            class="relative z-10"
          >
            Send Message
          </span>

        </button>

      </form>

    </div>

  `;
}
