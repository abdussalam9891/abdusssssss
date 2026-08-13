import {
  API_ENDPOINTS,
  STORE_DOMAIN,
} from "../config.js";

import {
  apiClient,
} from "./apiClient.js";


export const websiteService = {

  async getWebsiteData() {

    const response =
      await apiClient.get(
        API_ENDPOINTS.WEBSITE.PUBLIC(
          STORE_DOMAIN
        )
      );

    if (!response?.success) {
      throw new Error(
        response?.message ||
        "Failed to load website data."
      );
    }

    return response.data;
  },


  // ==========================================
  // POLICIES
  // ==========================================

  async getPolicies() {

    const data =
      await this.getWebsiteData();

    return (
      data?.policies ||
      data?.website?.policies ||
      []
    );
  },


  async getPolicy(type) {

    const policies =
      await this.getPolicies();

    return (
      policies.find(
        (policy) =>
          policy?.type
            ?.trim()
            .toLowerCase() ===
          type
            .trim()
            .toLowerCase()
      ) || null
    );
  },


  // ==========================================
  // FAQ
  // ==========================================

  async getFAQs() {

    const policies =
      await this.getPolicies();


    const faqPolicy =
      policies.find(
        (policy) =>
          policy?.type
            ?.trim()
            .toLowerCase() ===
          "frequently asked questions (faq)"
      );


    if (!faqPolicy) {
      return [];
    }


    const faqContent =
      faqPolicy?.sections?.["Banshiwaale Jewellery"];


    if (
      typeof faqContent !== "string" ||
      !faqContent.trim()
    ) {
      return [];
    }


    return parseFAQs(faqContent);
  },

};


// ==========================================
// PARSE BACKEND FAQ STRING
// ==========================================

function parseFAQs(content) {

  const blocks =
    content
      .trim()
      .split(/\n\s*\n/)
      .map(
        (block) =>
          block.trim()
      )
      .filter(Boolean);


  const faqs = [];

  let currentFAQ = null;


  blocks.forEach((block) => {

    const questionMatch =
      block.match(
        /^(\d+)\.\s+(.+)$/
      );


    if (questionMatch) {

      if (currentFAQ) {
        faqs.push(currentFAQ);
      }


      currentFAQ = {

        id:
          Number(
            questionMatch[1]
          ),

        question:
          questionMatch[2]
            .trim(),

        answer: "",

        category:
          getFAQCategory(
            questionMatch[2]
          ),

        featured: true,

      };


      return;
    }


    if (currentFAQ) {

      currentFAQ.answer =
        currentFAQ.answer
          ? `${currentFAQ.answer}\n\n${block}`
          : block;

    }

  });


  if (currentFAQ) {
    faqs.push(currentFAQ);
  }


  


  return faqs;
}


function getFAQCategory(question = "") {

  const value =
    question
      .toLowerCase()
      .trim();


  // ==========================================
  // ORDERS
  // ==========================================

  if (
    value.includes("order") ||
    value.includes("cancel")
  ) {
    return "Orders";
  }


  // ==========================================
  // SHIPPING
  // ==========================================

  if (
    value.includes("deliver") ||
    value.includes("shipping")
  ) {
    return "Shipping";
  }


  // ==========================================
  // RETURNS / REFUNDS
  // ==========================================

  if (
    value.includes("return") ||
    value.includes("refund") ||
    value.includes("damaged") ||
    value.includes("wrong product")
  ) {
    return "Returns";
  }


  // ==========================================
  // PAYMENTS
  // ==========================================

  if (
    value.includes("payment") ||
    value.includes("pay")
  ) {
    return "Payments";
  }


  // ==========================================
  // JEWELLERY CARE
  // ==========================================

  if (
    value.includes("care") ||
    value.includes("wear") ||
    value.includes("clean") ||
    value.includes("silver") ||
    value.includes("size")
  ) {
    return "Jewellery Care";
  }


  // ==========================================
  // WARRANTY
  // ==========================================

  if (
    value.includes("warranty")
  ) {
    return "Warranty";
  }


  // ==========================================
  // DEFAULT
  // ==========================================

  return "Jewellery Care";
}
