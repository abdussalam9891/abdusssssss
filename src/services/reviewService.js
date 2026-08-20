import { API_ENDPOINTS } from "../config.js";
import { apiClient } from "./apiClient.js";


/*
 * GET /review/getProductReviews/:productId
 *   -> { success, data: [ { _id, rating, reviewText, createdAt,
 *        userId: { name, email } | user: {...} } ] }
 *
 * GET /review/starsummary/:productId
 *   -> { success, data: { averageRating, totalReviews } }
 *
 * POST /review/createReview { productId, rating, reviewText }
 *   -> requires an authenticated user (apiClient attaches the
 *      bearer token from localStorage when one exists).
 */
export const reviewService = {

  getProductReviews: async (productId) => {

    const response =
      await apiClient.get(
        API_ENDPOINTS.REVIEW.LIST(productId)
      );

    return Array.isArray(response?.data)
      ? response.data
      : [];
  },


  getRatingSummary: async (productId) => {

    const response =
      await apiClient.get(
        API_ENDPOINTS.REVIEW.SUMMARY(productId)
      );

    return {
      averageRating:
        Number(response?.data?.averageRating) || 0,

      totalReviews:
        Number(response?.data?.totalReviews) || 0,
    };
  },


  createReview: async ({ productId, rating, reviewText }) => {

    return apiClient.post(
      API_ENDPOINTS.REVIEW.CREATE,
      {
        productId,
        rating,
        reviewText,
      }
    );
  },

};
