import apiClient from "./apiClient";

export const submitDailyCheckIn = async (data: {
  mood_score: number;
  stress_level: number;
  sleep_hours: number;
  workload_level: number;
  energy_level: number;
  focus_level: number;
  recovery_time: number;
  work_satisfaction: number;
  notes?: string;
}) => {
  const response = await apiClient.post("/wellness/checkins/create/", data);
  return response.data;
};

export const getCheckInHistory = async () => {
  const response = await apiClient.get("/wellness/checkins/");
  return response.data;
};