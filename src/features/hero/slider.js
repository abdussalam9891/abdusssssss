import {
  animateImageEnter,
  animateImageZoom,
  animateTitleLine,
  animateDescription,
  animateButton,
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
let contents = [];
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

  slides = [...hero.querySelectorAll(".hero-slide")];

  contents = [...hero.querySelectorAll(".hero-content")];

  indicators = [...hero.querySelectorAll(".hero-indicator")];

  progressBars = [
    ...hero.querySelectorAll(".hero-indicator-progress"),
  ];

  nextButton = document.getElementById("heroNext");

  previousButton = document.getElementById("heroPrev");
}




/* ------------------------------------------------ */
/* HELPERS                                          */
/* ------------------------------------------------ */

function getCurrentSlide() {
  return slides[currentSlide];
}

function getCurrentContent() {
  return contents[currentSlide];
}

function resetProgressBars() {
  progressBars.forEach(bar => {
    bar.style.transform = "scaleX(0)";
  });
}

function updateIndicators(index) {
  indicators.forEach((indicator, i) => {
    indicator.classList.toggle("h-3", i === index);
    indicator.classList.toggle("w-3", i === index);

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

  contents.forEach(content => {
    content.classList.remove(
      "opacity-100",
      "visible"
    );

    content.classList.add(
      "opacity-0",
      "invisible",
      "absolute"
    );
  });
}

function showCurrentSlide() {
  const slide = getCurrentSlide();
  const content = getCurrentContent();

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

  content.classList.remove(
    "opacity-0",
    "invisible",
    "absolute"
  );

  content.classList.add(
    "opacity-100",
    "visible"
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
      const bar = progressBars[currentSlide];

      if (bar) {
        bar.style.transform = `scaleX(${progress})`;
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
  const content = getCurrentContent();

  const image = slide.querySelector(".hero-image");

  const titleLines = [
    ...content.querySelectorAll(".hero-title-word"),
  ];

  const description = content.querySelector(
    ".hero-description"
  );

  const button = content.querySelector(
    ".hero-button"
  );

  /* ---------- Image ---------- */

  animateImageEnter(image);

  animateImageZoom(image, 1400);

  /* ---------- Title ---------- */

  titleLines.forEach((line, index) => {
    animateTitleLine(
      line,
      350 + index * 180
    );
  });

  /* ---------- Description ---------- */

  animateDescription(
    description,
    1000
  );

  /* ---------- Button ---------- */

  animateButton(
    button,
    1250
  );

  startSlideTimeline();
}

/* ------------------------------------------------ */
/* NEXT                                             */
/* ------------------------------------------------ */

function nextSlide() {
  cancelTimeline();

  currentSlide++;

  if (currentSlide >= slides.length) {
    currentSlide = 0;
  }

  playCurrentSlide();
}

/* ------------------------------------------------ */
/* PREVIOUS                                         */
/* ------------------------------------------------ */

function previousSlide() {
  cancelTimeline();

  currentSlide--;

  if (currentSlide < 0) {
    currentSlide = slides.length - 1;
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
  nextButton?.addEventListener("click", nextSlide);

  previousButton?.addEventListener("click", previousSlide);

  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      goToSlide(index);
    });
  });

  document.addEventListener("keydown", event => {
    switch (event.key) {
      case "ArrowRight":
        nextSlide();
        break;

      case "ArrowLeft":
        previousSlide();
        break;
    }
  });
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
  hero.addEventListener(
    "touchstart",
    event => {
      touchStartX =
        event.changedTouches[0].clientX;
    },
    { passive: true }
  );

  hero.addEventListener(
    "touchend",
    event => {
      touchEndX =
        event.changedTouches[0].clientX;

      const distance =
        touchStartX - touchEndX;

      if (Math.abs(distance) < 60) return;

      if (distance > 0) {
        nextSlide();
      } else {
        previousSlide();
      }
    },
    { passive: true }
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
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
      playCurrentSlide();
    }, 200);
  });
}

/* ------------------------------------------------ */
/* INITIALIZE                                       */
/* ------------------------------------------------ */

export function initHeroSlider() {
  cacheDOM();

  if (!hero) return;

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
  contents = [];
  indicators = [];
  progressBars = [];

  hero = null;
}
