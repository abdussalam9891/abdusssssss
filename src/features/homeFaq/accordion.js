import { websiteService } from "../../services/websiteService.js";
import { createFaqCard } from "../../components/faq/faqCard.js";

// ==========================================
// SKELETON / LOADING STATE
// ==========================================

function createFaqSkeletonCard() {

  return `
    <div
      class="
        animate-pulse
        overflow-hidden
        rounded-3xl
        border
        border-[#E8E2DA]
        bg-white
        px-8
        py-7
      "
    >

      <div class="h-5 w-3/4 rounded bg-[#ECE7E1]"></div>

    </div>
  `;

}

function renderFaqSkeleton() {

  return Array.from(
    { length: 5 },
    createFaqSkeletonCard
  ).join("");

}

// ==========================================
// EMPTY / ERROR STATE
// ==========================================

function renderFaqError() {

  return `
    <div
      class="
        rounded-3xl
        border
        border-dashed
        border-[#E8E2DA]
        px-8
        py-14
        text-center
      "
    >

      <p class="text-ink font-medium">
        We couldn't load our FAQs right now.
      </p>

      <p class="mt-2 text-sm text-[#666]">
        Please try again shortly, or visit our
        <a
          href="/pages/faq.html"
          class="text-primary underline underline-offset-2"
        >FAQ page</a>
        directly.
      </p>

    </div>
  `;

}

// ==========================================
// STATIC SHELL
// ==========================================

function renderShell(listContentHtml) {

  return `
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
              text-ink
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
          id="homeFaqList"
          class="
            mt-14
            space-y-5
          "
        >

          ${listContentHtml}

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
              text-primary
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

}

export async function initHomeFaq() {

  const container =
    document.getElementById("homeFaq");

  if (!container) return;

  // Render the static shell + a loading state
  // immediately, so the section never appears blank.
  container.innerHTML =
    renderShell(renderFaqSkeleton());

  const listEl =
    document.getElementById("homeFaqList");

  try {

    const faqs =
      await websiteService.getFAQs();

    // Only 7 FAQs on homepage
    const homeFaqs =
      faqs.slice(0, 7);

    if (!homeFaqs.length) {
      listEl.innerHTML = renderFaqError();
      return;
    }

    listEl.innerHTML =
      homeFaqs
        .map(createFaqCard)
        .join("");

    // Initialize accordion AFTER cards are rendered
    initHomeFaqAccordion();

  } catch (error) {

    console.error(
      "[Home FAQ] Failed:",
      error
    );

    // Don't break the rest of homepage.
    // Keep the heading/section, only the
    // FAQ list degrades to an empty state.
    if (listEl) {
      listEl.innerHTML = renderFaqError();
    }

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
            "border-primary",
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
          "border-primary",
          "shadow-xl"
        );

      }
    );

  });

}
