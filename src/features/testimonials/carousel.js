export function initTestimonialCarousel() {
  const track = document.getElementById("testimonialTrack");
  const prev = document.getElementById("testimonialPrev");
  const next = document.getElementById("testimonialNext");
  const dotsContainer =
    document.getElementById("testimonialDots");

  if (!track) return;

  let index = 0;

  function visibleCards() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  }

  function totalCards() {
    return track.children.length;
  }

  function maxIndex() {
    return Math.max(
      totalCards() - visibleCards(),
      0
    );
  }

  function updateDots() {
    if (!dotsContainer) return;

    const dots =
      dotsContainer.querySelectorAll(
        ".testimonial-dot"
      );

    dots.forEach((dot, i) => {
      dot.classList.remove(
        "w-6",
        "bg-[#A07936]"
      );

      dot.classList.add(
        "w-2",
        "bg-[#D8D2C8]"
      );

      if (i === index) {
        dot.classList.remove(
          "w-2",
          "bg-[#D8D2C8]"
        );

        dot.classList.add(
          "w-6",
          "bg-[#A07936]"
        );
      }
    });
  }

  function update() {
    const visible = visibleCards();

    track.style.transform = `translateX(-${
      index * (100 / visible)
    }%)`;

    updateDots();
  }

  function goNext() {
    index =
      index < maxIndex()
        ? index + 1
        : 0;

    update();
  }

  function goPrev() {
    index =
      index > 0
        ? index - 1
        : maxIndex();

    update();
  }

  next?.addEventListener("click", goNext);

  prev?.addEventListener("click", goPrev);

  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener(
    "touchstart",
    (event) => {
      touchStartX =
        event.changedTouches[0].clientX;
    },
    { passive: true }
  );

  track.addEventListener(
    "touchend",
    (event) => {
      touchEndX =
        event.changedTouches[0].clientX;

      const distance =
        touchStartX - touchEndX;

      if (Math.abs(distance) < 40) return;

      if (distance > 0) {
        goNext();
      } else {
        goPrev();
      }
    },
    { passive: true }
  );

  dotsContainer
    ?.querySelectorAll(".testimonial-dot")
    .forEach((dot) => {
      dot.addEventListener("click", () => {
        index = Number(dot.dataset.index);

        if (index > maxIndex()) {
          index = maxIndex();
        }

        update();
      });
    });

  window.addEventListener("resize", () => {
    if (index > maxIndex()) {
      index = maxIndex();
    }

    update();
  });

  update();
}
