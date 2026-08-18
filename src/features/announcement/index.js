import { createAnnouncementBar }
  from "../../components/announcement/announcementBar.js";

import { websiteService }
  from "../../services/websiteService.js";


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

    container.innerHTML = "";

  }

}
