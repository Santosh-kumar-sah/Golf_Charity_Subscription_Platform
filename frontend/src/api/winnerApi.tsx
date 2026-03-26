import axiosInstance from "./axiosInstance";

export interface Winner {
  id: string;
  user_id: string;
  draw_id: string;
  matched_numbers: number;
  prize_amount: number;
  proof_url?: string;
  status: "pending" | "approved" | "rejected";
  payment_status: "paid" | "unpaid";
  created_at: string;
}

// User: Get my winnings
export const getMyWinnings = async (): Promise<Winner[]> => {
  const response = await axiosInstance.get("/winner/my");
  return response.data.data;
};

// User: Get all winners (public view)
export const getWinners = async (): Promise<Winner[]> => {
  const response = await axiosInstance.get("/winner/winners");
  return response.data.data;
};

// User: Upload proof for a winning
export const uploadProof = async (winnerId: string, file: File): Promise<Winner> => {
  const formData = new FormData();
  formData.append("proof", file);
  
  const response = await axiosInstance.post(`/winner/upload-proof/${winnerId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
};

// Admin: Update winner status (approve/reject)
export const updateWinnerStatus = async (winnerId: string, status: "approved" | "rejected"): Promise<Winner> => {
  const response = await axiosInstance.patch(`/winner/${winnerId}/status`, { status });
  return response.data.data;
};

// Admin: Mark payment as paid
export const markPayment = async (winnerId: string): Promise<Winner> => {
  const response = await axiosInstance.patch(`/winner/${winnerId}/payment`);
  return response.data.data;
};