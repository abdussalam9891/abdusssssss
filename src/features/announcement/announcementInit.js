import { websiteService }
  from "../../services/websiteService.js";

function createAnnouncementBar(marquees = []) {

  // Duplicate for seamless infinite scrolling
  const announcements = [
    ...marquees,
    ...marquees,
  ];

  return `
    <div
      class="
        announcement-bar
        relative
        overflow-hidden
        bg-[#111111]
        border-b
        border-white/10
        py-2
      "
    >

      <!-- Left Fade -->

      <div
        class="
          pointer-events-none
          absolute
          left-0
          top-0
          z-10
          h-full
          w-10
          bg-gradient-to-r
          from-[#111111]
          to-transparent
        "
      ></div>


      <!-- Right Fade -->

      <div
        class="
          pointer-events-none
          absolute
          right-0
          top-0
          z-10
          h-full
          w-10
          bg-gradient-to-l
          from-[#111111]
          to-transparent
        "
      ></div>


      <!-- Track -->

      <div class="announcement-track">

        ${announcements
          .map(
            (item) => `
              <a
                href="${item?.href || "#"}"

                class="
                  announcement-item
                  group
                  flex
                  items-center
                  gap-6
                  whitespace-nowrap
                  px-8
                  lg:px-10
                  text-[11px]
                  font-medium
                  uppercase
                  tracking-[0.22em]
                  text-[#D6B46A]
                  transition-colors
                  duration-300
                  hover:text-white
                "
              >

                <span>
                  ${item?.text || ""}
                </span>


                <span
                  class="
                    text-primary
                    transition-transform
                    duration-300
                    group-hover:rotate-45
                  "
                >

                  <svg
                    class="h-3.5 w-3.5 text-primary"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2L12 2z"
                    />
                  </svg>

                </span>

              </a>
            `
          )
          .join("")}

      </div>

    </div>
  `;
}


export async function getActiveMarquees() {

  const data =
    await websiteService.getWebsiteData();


  const marquees =
    Array.isArray(data?.website?.marquees)
      ? data.website.marquees
      : Array.isArray(data?.marquees)
        ? data.marquees
        : [];


  return marquees.filter(
    (item) =>
      item?.status?.toLowerCase() === "active"
  );

}


export async function initAnnouncementBar(container) {

  if (!container) return;


  try {

    const activeMarquees =
      await getActiveMarquees();


    container.innerHTML =
      createAnnouncementBar(activeMarquees);


  } catch (error) {

    console.error(
      "[Announcement] Failed to load marquee data:",
      error
    );

    container.innerHTML = `
      <p class="w-full bg-[#111111] py-2 text-center text-sm text-red-500">
        Unable to load announcements.
      </p>
    `;

  }

}
