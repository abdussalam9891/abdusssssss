export function createCraftsmanshipSection() {
  return `
<section
  class="
    reveal

    bg-white

    py-8
    lg:py-14
  "
>

 <div
  class="
    mx-auto

    w-full
    max-w-[1600px]

    px-5
    sm:px-6
    lg:px-10
    xl:px-14
  "
>
    <div
      class="
        grid

        items-center

        gap-6
lg:gap-8

        lg:grid-cols-[1.6fr_1fr]
      "
    >

      <!-- Image -->

     <div
  class="
    group
    relative
    overflow-hidden
    rounded-3xl
    reveal
    reveal-left

    h-[350px]
    md:h-[450px]
    lg:h-[550px]
  "
>

      <img
  src="./src/assets/images/hero5.jpg"
  alt="banshiwale Sterling Silver"
  loading="lazy"

  class="
    w-full
    h-full

    object-cover

    transition-transform
    duration-700

    group-hover:scale-105
  "
/>

        <!-- Overlay -->

        <div
          class="
            absolute
            inset-0

            bg-gradient-to-t
            from-black/20
            via-transparent
            to-transparent
          "
        ></div>

      </div>

      <!-- Content -->

<div
  class="
    reveal
    reveal-right

    group

    transition-all
    duration-500

    hover:-translate-y-1
  "
>


  <!-- Heading -->

  <h2
    class="
      mt-5

      font-serif

      text-4xl
      lg:text-6xl

      leading-tight

      text-[#181818]

      transition-all
      duration-500

      group-hover:translate-x-2
    "
  >
    Sterling Silver,
    <br />
    Crafted To Last.
  </h2>

  <!-- Description -->

  <p
    class="
      mt-8

      max-w-xl

      text-lg

      leading-8

      text-[#666]

      transition-all
      duration-500
      delay-75

      group-hover:translate-x-2
    "
  >
    Every banshiwale piece is handcrafted from certified 925 sterling
    silver, combining timeless craftsmanship with modern design.
    Built for everyday confidence and made to stay with you for years.
  </p>

  <!-- CTA -->

 <a
  href="/pages/about.html"
  class="
    group

    relative

    inline-flex

    items-center
    justify-center

    overflow-hidden

    border
    border-[#A07936]

    px-8
    py-4
    mt-8

    text-sm
    font-medium
    uppercase
    tracking-[0.18em]

    text-[#181818]
  "
>

    <span
      class="
        absolute
        inset-0

        origin-left

        scale-x-0

        bg-[#A07936]

        transition-transform
        duration-500
        ease-out

        group-hover:scale-x-100
      "
    ></span>

    <span
      class="
        relative
        z-10

        flex
        items-center
        gap-3

        transition-colors
        duration-300

        group-hover:text-white
      "
    >
        Discover More

        <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
        </svg>

    </span>

</a>

</div>

    </div>

  </div>

</section>
`;
}
