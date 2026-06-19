import apiClient from "./apiClient";

export const getWeeklyTrend = async () => {
  const response = await apiClient.get("/analytics/weekly-trend/");
  return response.data;
};

export const getTrendAnalysis = async () => {
  const response = await apiClient.get("/analytics/trend-analysis/");
  return response.data;
};

export const getWeeklyReport = async () => {
  const response = await apiClient.get("/analytics/weekly-report/");
  return response.data;
};

export const getStreak = async () => {
  const response = await apiClient.get("/analytics/streak/");
  return response.data;
}

export const getBurnoutPrediction = async () => {
  const response = await apiClient.get("/analytics/burnout-prediction/");
  return response.data;
};

export const getReflection = async () => {
  const response = await apiClient.get("/analytics/reflection/");
  return response.data;
};

export const getAchievements = async () => {
  const response = await apiClient.get("/analytics/achievements/");
  return response.data;
};

export const getRecommendations = async () => {
  const response = await apiClient.get(
    "/analytics/recommendations/"
  );

  return response.data;
};

export const getActionPlans = async () => {
  const response = await apiClient.get("/analytics/action-plans/");
  return response.data;
};

export const toggleActionPlan = async (
  planId: number
) => {
  const response = await apiClient.patch(
    `/analytics/action-plans/${planId}/toggle/`
  );

  return response.data;
};

export const getRecoveryProgress = async () => {
  const response = await apiClient.get(
    "/analytics/recovery-progress/"
  );

  return response.data;
};