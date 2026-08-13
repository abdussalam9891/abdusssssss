import { createFaqCard } from "../faq/faqCard.js";


export function createHomeFaq(faqs = []) {

  // Show only first 7 FAQs on homepage
  const homeFaqs =
    Array.isArray(faqs)
      ? faqs.slice(0, 7)
      : [];


  if (!homeFaqs.length) {
    return "";
  }


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
            Quick answers to the questions our customers ask most often.
          </p>

        </div>


        <div
          class="
            mt-14
            space-y-5
          "
        >

          ${homeFaqs
            .map(createFaqCard)
            .join("")}

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
}
