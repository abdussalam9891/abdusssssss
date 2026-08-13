import {
  websiteService,
} from "../../services/websiteService.js";

import {
  renderPolicySections,
} from "../../utils/renderPolicy.js";


export async function initPolicyPage(
  policyType
) {

  const content =
    document.getElementById(
      "policyContent"
    );

  const title =
    document.getElementById(
      "policyTitle"
    );

  const lastUpdated =
    document.getElementById(
      "policyLastUpdated"
    );


  if (!content) {
    return;
  }


  try {

    const policy =
      await websiteService.getPolicy(
        policyType
      );


    if (!policy) {

      content.innerHTML = `
        <p class="text-[#777777]">
          This policy is currently unavailable.
        </p>
      `;

      return;

    }


    // ==========================
    // TITLE
    // ==========================

    if (title) {

      title.textContent =
        policy.type;

    }


    // ==========================
    // LAST UPDATED
    // ==========================

    if (lastUpdated) {

      if (policy.updatedAt) {

        lastUpdated.textContent =
          `Last Updated: ${new Date(
            policy.updatedAt
          ).toLocaleDateString(
            "en-IN",
            {
              month: "long",
              year: "numeric",
            }
          )}`;

      } else {

        lastUpdated.textContent = "";

      }

    }


    // ==========================
    // CONTENT
    // ==========================

    content.innerHTML =
      renderPolicySections(
        policy.sections
      );


  } catch (error) {

    console.error(
      `[Policy] Failed to load ${policyType}:`,
      error
    );


    content.innerHTML = `
      <p class="text-red-600">
        Unable to load this page.
        Please try again later.
      </p>
    `;

  }

}
