export function createHeroSlides(heroSlides = []) {

  return heroSlides
    .map(
      (slide, index) => `
        <div
          class="
            hero-slide
            absolute
            inset-0
            overflow-hidden
            ${index === 0 ? "opacity-100 z-20" : "opacity-0 z-10"}
            transition-opacity
            duration-1000
            ease-out
          "
          data-slide="${index}"
        >

          <!-- Blurred backdrop fill (mobile letterbox filler; hidden behind the cover image on md+) -->

          <div
            class="
              absolute
              inset-0
              overflow-hidden
              md:hidden
            "
            aria-hidden="true"
          >

            <img
              src="${slide.image?.url || ""}"
              alt=""
              loading="${index === 0 ? "eager" : "lazy"}"
              draggable="false"

              class="
                h-full
                w-full
                scale-125
                object-cover
                blur-2xl
                brightness-50
                select-none
              "
            >

          </div>

          <img
            src="${slide.image?.url || ""}"
            alt="${slide.heading || "Banshiwale Jewellery"}"
            loading="${index === 0 ? "eager" : "lazy"}"
            fetchpriority="${index === 0 ? "high" : "auto"}"
            draggable="false"

            class="
              hero-image
              absolute
              inset-0
              h-full
              w-full
              object-contain
              md:object-cover
              select-none
              will-change-transform
            "
          >

          <div
            class="
              absolute
              inset-0
              bg-[linear-gradient(90deg,rgba(0,0,0,.72)_0%,rgba(0,0,0,.45)_40%,rgba(0,0,0,.15)_100%)]
            "
          ></div>

        </div>
      `
    )
    .join("");
}
