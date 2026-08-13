import { websiteService } from "../../services/websiteService.js";
import { createFaqCard } from "../../components/faq/faqCard.js";

export async function initHomeFaq() {

  const container =
    document.getElementById("homeFaq");

  if (!container) return;

  try {

    const faqs =
      await websiteService.getFAQs();

    // Only 7 FAQs on homepage
    const homeFaqs =
      faqs.slice(0, 7);

    container.innerHTML = `
      <section
        class="
          bg-white
          py-8
        "
      >

        <div
          class="
            mx-auto
            max-w-4xl
            px-6
          "
        >

          <div class="text-center">

            <h2
              class="
                mt-4
                text-4xl
                font-serif
                text-[#181818]
              "
            >
              Everything You Need to Know
            </h2>

            <p
              class="
                mt-4
                text-[#666]
              "
            >
              Quick answers to the questions
              our customers ask most often.
            </p>

          </div>

          <div
            class="
              mt-14
              space-y-5
            "
          >

            ${
              homeFaqs
                .map(createFaqCard)
                .join("")
            }

          </div>

          <div class="mt-10 text-center">

            <a
              href="/pages/faq.html"
              class="
                inline-flex
                items-center
                gap-2
                text-sm
                font-medium
                uppercase
                tracking-[0.18em]
                text-[#A07936]
                transition-all
                duration-300
                hover:gap-3
              "
            >
              View All FAQs

              <span>→</span>

            </a>

          </div>

        </div>

      </section>
    `;

    // Initialize accordion AFTER cards are rendered
    initHomeFaqAccordion();

  } catch (error) {

    console.error(
      "[Home FAQ] Failed:",
      error
    );

    // Don't break the rest of homepage
    container.innerHTML = "";

  }
}


// ==========================================
// HOME FAQ ACCORDION
// ==========================================

function initHomeFaqAccordion() {

  const items =
    document.querySelectorAll(
      "#homeFaq .faq-item"
    );

  items.forEach((item) => {

    const button =
      item.querySelector(
        ".faq-toggle"
      );

    const content =
      item.querySelector(
        ".faq-content"
      );

    const icon =
      item.querySelector(
        ".faq-icon"
      );


    if (
      !button ||
      !content ||
      !icon
    ) {
      return;
    }


    button.addEventListener(
      "click",
      () => {

        const isOpen =
          !content.classList.contains(
            "hidden"
          );


        // Close all FAQs
        items.forEach((faq) => {

          faq
            .querySelector(".faq-content")
            ?.classList.add("hidden");

          faq
            .querySelector(".faq-icon")
            ?.classList.remove("rotate-45");

          faq.classList.remove(
            "border-[#A07936]",
            "shadow-xl"
          );

        });


        // If already open, just close it
        if (isOpen) {
          return;
        }


        // Open clicked FAQ
        content.classList.remove(
          "hidden"
        );

        icon.classList.add(
          "rotate-45"
        );

        item.classList.add(
          "border-[#A07936]",
          "shadow-xl"
        );

      }
    );

  });

}
