import apiClient from "./apiClient";

export const getUserProfile = async () => {
  const response = await apiClient.get("/users/profile/");
  return response.data;
};

export const updateUserProfile = async (data: {
  avg_sleep_hours: number;
  avg_work_hours: number;
  stress_baseline: number;
  user_type: string;
  wellness_goal: string;
}) => {
  const response = await apiClient.put("/users/profile/", data);
  return response.data;
};