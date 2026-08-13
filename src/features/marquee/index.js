import { createMarqueeSection } from "../../components/marquee/marqueeSection.js";
import { websiteService } from "../../services/websiteService.js";


export async function initMarquee() {

  const container =
    document.getElementById("marquee");

  if (!container) return;


  try {

    const data =
      await websiteService.getWebsiteData();


    const marquees =
      Array.isArray(data?.website?.marquees)
        ? data.website.marquees
        : Array.isArray(data?.marquees)
          ? data.marquees
          : [];


    const activeMarquees =
      marquees.filter(
        (item) =>
          item?.status?.toLowerCase() === "active"
      );


    container.innerHTML =
      createMarqueeSection(activeMarquees);


  } catch (error) {

    console.error(
      "[Marquee] Failed to load marquee data:",
      error
    );

    container.innerHTML = "";

  }

}
