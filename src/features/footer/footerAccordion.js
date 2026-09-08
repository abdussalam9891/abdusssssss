export function initFooterAccordion() {

    if (window.innerWidth >= 1024) return;

    const toggles =
        document.querySelectorAll(".footer-toggle");

    toggles.forEach(toggle => {

        toggle.addEventListener("click", () => {

            const content = toggle.nextElementSibling;
            const chevron =
                toggle.querySelector(".footer-chevron");

            toggles.forEach(otherToggle => {

                if (otherToggle === toggle) return;

                otherToggle.nextElementSibling
                    .classList.add("hidden");

                otherToggle
                    .querySelector(".footer-chevron")
                    .classList.remove("rotate-180");

            });

            content.classList.toggle("hidden");

            chevron.classList.toggle("rotate-180");

        });

    });

}
