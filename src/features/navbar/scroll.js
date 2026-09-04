const SCROLL_THRESHOLD = 60;

export function initScroll() {
  const navbar = document.getElementById("navbar");
  const header = document.getElementById("siteHeader");

  if (!navbar || !header) return;

  const theme = header.dataset.theme || "light";

  const navbarItems =
    navbar.querySelectorAll(".navbar-text");

  const logo = document.getElementById("navbarLogo");
  const logoWrap = document.getElementById("navbarLogoWrap");

  let ticking = false;

  function updateNavbar() {
    const scrolled =
      window.scrollY > SCROLL_THRESHOLD;

    navbar.classList.toggle("h-16", scrolled);
    navbar.classList.toggle("h-20", !scrolled);

    if (logo) {
      const nextSrc = scrolled
        ? logo.dataset.logoScrolled
        : logo.dataset.logoTop;

      if (nextSrc && logo.getAttribute("src") !== nextSrc) {
        logo.setAttribute("src", nextSrc);
      }

      // logo-white.png is a circular coin mark, cropped to
      // fill its wrapper. logo.png is a wider lockup that
      // needs to be shown in full instead of cropped.
      logo.classList.toggle("object-cover", !scrolled);
      logo.classList.toggle("object-contain", scrolled);
    }

    if (logoWrap) {
      logoWrap.classList.toggle("rounded-full", !scrolled);
      logoWrap.classList.toggle("overflow-hidden", !scrolled);

      // Bump the logo up slightly once the navbar goes black.
      logoWrap.classList.toggle("h-12", !scrolled);
      logoWrap.classList.toggle("w-12", !scrolled);
      logoWrap.classList.toggle("lg:h-20", !scrolled);
      logoWrap.classList.toggle("lg:w-20", !scrolled);

      logoWrap.classList.toggle("h-14", scrolled);
      logoWrap.classList.toggle("w-14", scrolled);
      logoWrap.classList.toggle("lg:h-24", scrolled);
      logoWrap.classList.toggle("lg:w-24", scrolled);
    }

    if (scrolled) {
      navbar.classList.remove(
        "bg-transparent",
        "border-transparent"
      );

      navbar.classList.add(
        "bg-[#181818]/95",
        "backdrop-blur-xl",
        "shadow-lg",
        "border-white/10"
      );

      // Only pages that start with dark text
      if (theme === "dark") {
        navbarItems.forEach((item) => {
          // An active nav link (e.g. the current category) keeps its
          // gold highlight regardless of scroll state — forcing
          // text-white on it here would otherwise fight the
          // text-[#A07936] active class at equal CSS specificity.
          if (
            item.classList.contains(
              "text-[#A07936]"
            )
          ) {
            return;
          }

          item.classList.remove(
            "text-[#181818]",
            "text-[#181818]/90",
            "hover:bg-black/5",
            "hover:bg-white/20"
          );

          item.classList.add(
            "text-white"
          );
        });
      }
    } else {
      navbar.classList.remove(
        "bg-[#181818]/95",
        "backdrop-blur-xl",
        "shadow-lg",
        "border-white/10"
      );

      navbar.classList.add(
        "bg-transparent",
        "border-transparent"
      );

      if (theme === "dark") {
        navbarItems.forEach((item) => {
          if (
            item.classList.contains(
              "text-[#A07936]"
            )
          ) {
            return;
          }

          item.classList.remove(
            "text-white",
            "hover:bg-white/20",
            "hover:bg-black/5"
          );

          item.classList.add(
            "text-[#181818]/90"
          );
        });
      }
    }

    ticking = false;
  }

  function handleScroll() {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }

  window.addEventListener(
    "scroll",
    handleScroll,
    {
      passive: true,
    }
  );

  updateNavbar();
}
