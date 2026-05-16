import apiClient from "./apiClient";

export const loginUser = async (data: {
  username: string;
  password: string;
}) => {
  const response = await apiClient.post("/auth/login/", data);
  return response.data;
};

export const registerUser = async (data: {
  username: string;
  email: string;
  password: string;
  organization?: string;
  designation?: string;
}) => {
  const response = await apiClient.post("/auth/register/register/", data);
  return response.data;
};