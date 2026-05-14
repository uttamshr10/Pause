import apiClient from "./apiClient";

export const getWeeklyTrend = async () => {
  const response = await apiClient.get("/analytics/weekly-trend/");
  return response.data;
};