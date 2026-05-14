import apiClient from "./apiClient";

export const getInsight = async () => {
  const response = await apiClient.get("/analytics/insight/");
  return response.data;
};