import axiosInstance from "./axiosInstance";

export interface Score {
  id: string;
  user_id: string;
  score: number;
  played_at: string;
}

// User-specific scores (backend returns last 5 scores)
export const getScores = async (): Promise<Score[]> => {
  const res = await axiosInstance.get("/scores");
  const payload = res.data?.data ?? res.data;
  if (Array.isArray(payload)) return payload as Score[];
  if (payload?.data && Array.isArray(payload.data)) return payload.data as Score[];
  return [];
};

// Backwards-compatible alias (in case other code still references the old name)
export const getUserScores = getScores;

// Add new score
export const addScore = async (
  score: number,
  playedAt: string
): Promise<Score> => {
  const res = await axiosInstance.post("/scores", { score, played_at: playedAt });
  const payload = res.data.data;
  return Array.isArray(payload) ? payload[0] : payload;
};

// Update score
export const updateScore = async (
  id: string,
  score: number,
  playedAt: string
): Promise<Score> => {
  const res = await axiosInstance.put(`/scores/${id}`, { score, played_at: playedAt });
  const payload = res.data.data;
  return Array.isArray(payload) ? payload[0] : payload;
};

// Delete score
export const deleteScore = async (id: string): Promise<Record<string, unknown>> => {
  const res = await axiosInstance.delete(`/scores/${id}`);
  return res.data.data;
};