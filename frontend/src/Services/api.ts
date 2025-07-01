import axios from "axios";
import type { UserProfile } from "../types/index";

const API_URL = "http://127.0.0.1:5500/api/recommend";

export const getDietRecommendation = async (data: UserProfile) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};
