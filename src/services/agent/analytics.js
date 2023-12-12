import { httpGet, httpPost } from "../../rest-api";

const AgentAnalyticsService = {
  getTokensDetails: async (startDate, endDate) => {
    try {
      const queryParams = new URLSearchParams({
        startDate,
        endDate,
      }).toString();

      const response = await httpGet(
        `agent/analytics/tokens?${queryParams}`
      );
      return response;
    } catch (error) {
      console.error("Error while fetching tokens details", error);
      return null;
    }
  },

  getPropertyOffers: async (startDate, endDate) => {
    try {
      const queryParams = new URLSearchParams({
        startDate,
        endDate,
      }).toString();

      const response = await httpPost(
        `agent/analytics/property-offers?${queryParams}`
      );
      return response;
    } catch (error) {
      console.error("Error while fetching property offers", error);
      return null;
    }
  },

  getPropertyVisits: async (startDate, endDate) => {
    try {
      const queryParams = new URLSearchParams({
        startDate,
        endDate,
      }).toString();

      const response = await httpPost(
        `agent/analytics/property-visits?${queryParams}`
      );
      return response;
    } catch (error) {
      console.error("Error while fetching property visits", error);
      return null;
    }
  },

  getPropertyListings: async (startDate, endDate) => {
    try {
      const queryParams = new URLSearchParams({
        startDate,
        endDate,
      }).toString();

      const response = await httpPost(
        `agent/analytics/properties-listed?${queryParams}`
      );
      return response;
    } catch (error) {
      console.error("Error while fetching property listings", error);
      return null;
    }
  },
};

export default AgentAnalyticsService;
