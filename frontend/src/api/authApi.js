import axios from "axios";

const AUTH_API_URL = "http://localhost:8080/api/auth";

export const registerUser = async (userData) => {
  const response = await axios.post(`${AUTH_API_URL}/register`, userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axios.post(`${AUTH_API_URL}/login`, userData);
  return response.data;
};