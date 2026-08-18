import {
  animateImageEnter,
  animateImageZoom,
} from "./animations.js";

import {
  startTimeline,
  cancelTimeline,
  pauseTimeline,
  resumeTimeline,
} from "./timeline.js";

const SLIDE_DURATION = 6500;

let currentSlide = 0;

let hero = null;

let slides = [];
let indicators = [];
let progressBars = [];

let nextButton = null;
let previousButton = null;

let paused = false;

let touchStartX = 0;
let touchEndX = 0;

let resizeTimer = null;


/* ------------------------------------------------ */
/* DOM CACHE                                        */
/* ------------------------------------------------ */

function cacheDOM() {
  hero = document.getElementById("hero");

  if (!hero) {
    console.warn("[Hero] #hero not found.");
    return;
  }

  slides = [
    ...hero.querySelectorAll(".hero-slide"),
  ];

  indicators = [
    ...hero.querySelectorAll(".hero-indicator"),
  ];

  progressBars = [
    ...hero.querySelectorAll(
      ".hero-indicator-progress"
    ),
  ];

  nextButton =
    document.getElementById("heroNext");

  previousButton =
    document.getElementById("heroPrev");
}


/* ------------------------------------------------ */
/* HELPERS                                          */
/* ------------------------------------------------ */

function getCurrentSlide() {
  return slides[currentSlide];
}

function resetProgressBars() {
  progressBars.forEach(bar => {
    bar.style.transform = "scaleX(0)";
  });
}

function updateIndicators(index) {
  indicators.forEach((indicator, i) => {
    indicator.classList.toggle(
      "h-3",
      i === index
    );

    indicator.classList.toggle(
      "w-3",
      i === index
    );

    indicator.classList.toggle(
      "bg-[#A07936]",
      i === index
    );

    indicator.classList.toggle(
      "bg-white/40",
      i !== index
    );
  });
}


/* ------------------------------------------------ */
/* SLIDES                                            */
/* ------------------------------------------------ */

function hideSlides() {
  slides.forEach(slide => {
    slide.classList.remove(
      "opacity-100",
      "pointer-events-auto",
      "z-20"
    );

    slide.classList.add(
      "opacity-0",
      "pointer-events-none",
      "z-10"
    );
  });
}


function showCurrentSlide() {
  const slide = getCurrentSlide();

  if (!slide) {
    console.warn(
      "[Hero] Current slide not found:",
      currentSlide
    );

    return;
  }

  slide.classList.remove(
    "opacity-0",
    "pointer-events-none",
    "z-10"
  );

  slide.classList.add(
    "opacity-100",
    "pointer-events-auto",
    "z-20"
  );

  updateIndicators(currentSlide);
}


/* ------------------------------------------------ */
/* TIMELINE                                         */
/* ------------------------------------------------ */

function startSlideTimeline() {
  resetProgressBars();

  startTimeline({
    slideDuration: SLIDE_DURATION,

    progress(progress) {
      const bar =
        progressBars[currentSlide];

      if (bar) {
        bar.style.transform =
          `scaleX(${progress})`;
      }
    },

    complete() {
      nextSlide();
    },
  });
}


/* ------------------------------------------------ */
/* PLAY CURRENT SLIDE                               */
/* ------------------------------------------------ */

function playCurrentSlide() {
  hideSlides();

  showCurrentSlide();

  const slide = getCurrentSlide();

  if (!slide) return;

  const image =
    slide.querySelector(".hero-image");

  /* ---------- Image ---------- */

  if (image) {
    animateImageEnter(image);

    animateImageZoom(
      image,
      1400
    );
  }

  /* ---------- Timeline ---------- */

  startSlideTimeline();
}


/* ------------------------------------------------ */
/* NEXT                                             */
/* ------------------------------------------------ */

function nextSlide() {
  if (!slides.length) return;

  cancelTimeline();

  currentSlide++;

  if (
    currentSlide >= slides.length
  ) {
    currentSlide = 0;
  }

  playCurrentSlide();
}


/* ------------------------------------------------ */
/* PREVIOUS                                         */
/* ------------------------------------------------ */

function previousSlide() {
  if (!slides.length) return;

  cancelTimeline();

  currentSlide--;

  if (currentSlide < 0) {
    currentSlide =
      slides.length - 1;
  }

  playCurrentSlide();
}


/* ------------------------------------------------ */
/* GO TO SLIDE                                      */
/* ------------------------------------------------ */

function goToSlide(index) {
  if (
    index === currentSlide ||
    index < 0 ||
    index >= slides.length
  ) {
    return;
  }

  cancelTimeline();

  currentSlide = index;

  playCurrentSlide();
}


/* ------------------------------------------------ */
/* CONTROLS                                         */
/* ------------------------------------------------ */

function bindControls() {
  nextButton?.addEventListener(
    "click",
    nextSlide
  );

  previousButton?.addEventListener(
    "click",
    previousSlide
  );

  indicators.forEach(
    (indicator, index) => {
      indicator.addEventListener(
        "click",
        () => {
          goToSlide(index);
        }
      );
    }
  );

  document.addEventListener(
    "keydown",
    event => {
      switch (event.key) {
        case "ArrowRight":
          nextSlide();
          break;

        case "ArrowLeft":
          previousSlide();
          break;
      }
    }
  );
}


/* ------------------------------------------------ */
/* PAUSE / RESUME                                   */
/* ------------------------------------------------ */

function pauseSlider() {
  if (paused) return;

  paused = true;

  pauseTimeline();
}


function resumeSlider() {
  if (!paused) return;

  paused = false;

  resumeTimeline();
}


/* ------------------------------------------------ */
/* HOVER                                            */
/* ------------------------------------------------ */

function bindHover() {
  if (!hero) return;

  hero.addEventListener(
    "mouseenter",
    pauseSlider
  );

  hero.addEventListener(
    "mouseleave",
    resumeSlider
  );
}


/* ------------------------------------------------ */
/* TOUCH SUPPORT                                    */
/* ------------------------------------------------ */

function bindTouch() {
  if (!hero) return;

  hero.addEventListener(
    "touchstart",
    event => {
      touchStartX =
        event.changedTouches[0].clientX;
    },
    {
      passive: true,
    }
  );

  hero.addEventListener(
    "touchend",
    event => {
      touchEndX =
        event.changedTouches[0].clientX;

      const distance =
        touchStartX - touchEndX;

      if (
        Math.abs(distance) < 60
      ) {
        return;
      }

      if (distance > 0) {
        nextSlide();
      } else {
        previousSlide();
      }
    },
    {
      passive: true,
    }
  );
}


/* ------------------------------------------------ */
/* PAGE VISIBILITY                                  */
/* ------------------------------------------------ */

function bindVisibility() {
  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) {
        pauseSlider();
      } else {
        resumeSlider();
      }
    }
  );
}


/* ------------------------------------------------ */
/* RESIZE                                           */
/* ------------------------------------------------ */

function bindResize() {
  window.addEventListener(
    "resize",
    () => {
      clearTimeout(
        resizeTimer
      );

      resizeTimer =
        setTimeout(() => {
          playCurrentSlide();
        }, 200);
    }
  );
}


/* ------------------------------------------------ */
/* INITIALIZE                                       */
/* ------------------------------------------------ */

export function initHeroSlider() {
  cacheDOM();

  if (!hero) return;

  if (!slides.length) {
    console.warn(
      "[Hero] No hero slides found."
    );

    return;
  }

  currentSlide = 0;

  playCurrentSlide();

  bindControls();

  bindHover();

  bindTouch();

  bindVisibility();

  bindResize();
}


/* ------------------------------------------------ */
/* DESTROY                                          */
/* ------------------------------------------------ */

export function destroyHeroSlider() {
  cancelTimeline();

  paused = false;

  currentSlide = 0;

  slides = [];

  indicators = [];

  progressBars = [];

  nextButton = null;

  previousButton = null;

  hero = null;
}
