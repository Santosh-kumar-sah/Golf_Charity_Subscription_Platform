// src/api/drawApi.ts
import axiosInstance from "./axiosInstance";

export interface Draw {
  id: string;
  title: string;
  date: string;
  prizeAmount: number;
}

// Get public draws (user/home page)
export const getPublicDraws = async (): Promise<Draw[]> => {
  // Backend currently exposes "public draws" under the admin-prefixed router.
  const response = await axiosInstance.get("/admin/public");
  return response.data;
};

export interface AdminDraw {
  id: string;
  draw_date: string;
  numbers: unknown;
  created_at?: string;
  draw_results?: unknown;
}

export interface DrawWinner {
  user_id: string;
  matched_numbers: number;
  prize_amount: number;
}

export interface AdminDrawSimulationResult {
  draw: AdminDraw;
  winners: DrawWinner[];
}

export interface DrawResult {
  id: string;
  draw_id: string;
  user_id: string;
  matched_numbers: number;
  prize_amount: number;
  created_at?: string;
}

export interface PrizePool {
  id?: string;
  draw_id: string;
  total_pool: number;
  match_5: number;
  match_4: number;
  match_3: number;
  created_at?: string;
}

export const simulateDraw = async (): Promise<AdminDrawSimulationResult> => {
  const response = await axiosInstance.post("/admin/draws/simulate");
  return response.data.data;
};

export const getAllDraws = async (): Promise<AdminDraw[]> => {
  const response = await axiosInstance.get("/admin/draws");
  return response.data.data;
};

export const publishDraw = async (id: string): Promise<AdminDraw> => {
  const response = await axiosInstance.post(`/admin/draws/${id}/publish`);
  return response.data.data;
};

export const getDrawResults = async (): Promise<DrawResult[]> => {
  const response = await axiosInstance.get("/admin/draw_results");
  return response.data.data;
};

export const calculatePrizePool = async (draw_id: string): Promise<PrizePool> => {
  const response = await axiosInstance.post(`/admin/draws/${draw_id}/prize-pool`);
  return response.data.data;
};

export const getPrizePools = async (): Promise<PrizePool[]> => {
  const response = await axiosInstance.get("/admin/draws/prize-pools");
  return response.data.data;
};