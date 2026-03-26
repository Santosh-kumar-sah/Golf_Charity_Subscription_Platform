// src/api/subscriptionApi.ts
import axiosInstance from "./axiosInstance";

// Subscription type
export interface Subscription {
  id: string;
  plan: "monthly" | "yearly";
  status: "active" | "inactive" | "cancelled";
  start_date: string;
  end_date: string;
}

// Get logged-in user's subscription
export const getMySubscription = async (): Promise<Subscription> => {
  const response = await axiosInstance.get("/subscriptions/me");
  return response.data.data;
};

// Create a subscription
export const createSubscription = async (plan: "monthly" | "yearly"): Promise<Subscription> => {
  const response = await axiosInstance.post("/subscriptions", { plan });
  return response.data.data;
};

// Cancel subscription
export const cancelSubscription = async (id: string): Promise<Subscription> => {
  const response = await axiosInstance.patch(`/subscriptions/${id}/cancel`);
  return response.data.data;
};