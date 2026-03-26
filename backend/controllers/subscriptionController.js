
import { supabase } from "../config/supabase.js";import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const createSubscription = asyncHandler(async (req, res) => {
  const { plan } = req.body;
  if (!["monthly", "yearly"].includes(plan)) {
    throw new ApiError(400, "Invalid subscription plan");
  }

  const startDate = new Date();
  const endDate = plan === "monthly"
    ? new Date(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate())
    : new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate());

  const { data, error } = await supabase
    .from("subscriptions")
    .insert([{ user_id: req.user.id, plan, start_date: startDate, end_date: endDate, status: "active" }])
    .select("*")
    .single();

  if (error) throw new ApiError(500, error.message);

  res.json(new ApiResponse(200, data, "Subscription created"));
});

const getMySubscription = asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", req.user.id)
    .single();

  if (error || !data) throw new ApiError(404, "No subscription found");

  res.json(new ApiResponse(200, data, "Subscription fetched"));
});

const cancelSubscription = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("subscriptions")
    .update({ status: "cancelled" })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new ApiError(500, error.message);

  res.json(new ApiResponse(200, data, "Subscription cancelled"));
});

export { createSubscription, getMySubscription, cancelSubscription };