// src/api/charityApi.ts
import axiosInstance from "./axiosInstance";

export interface Charity {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  amountRaised?: number;
  targetAmount?: number;
}

// Get all charities (for home page)
export const getCharities = async (): Promise<Charity[]> => {
  // Backend currently exposes charities list under the admin-prefixed router.
  // This endpoint uses `authMiddleware` (not `adminMiddleware`), so it isn't admin-only.
  const response = await axiosInstance.get("/admin/charities");
  return response.data.data;
};

export const createCharity = async (input: {
  name: string;
  description: string;
  imageFile?: File | null;
}): Promise<Charity> => {
  const formData = new FormData();
  formData.append("name", input.name);
  formData.append("description", input.description);
  if (input.imageFile) {
    formData.append("image", input.imageFile);
  }

  const response = await axiosInstance.post("/admin/charities", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data.data;
};

export const updateCharity = async (
  id: string,
  input: { name: string; description: string; imageFile?: File | null }
): Promise<Charity> => {
  const formData = new FormData();
  formData.append("name", input.name);
  formData.append("description", input.description);
  if (input.imageFile) {
    formData.append("image", input.imageFile);
  }

  const response = await axiosInstance.put(`/admin/charities/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data.data;
};

export const deleteCharity = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/admin/charities/${id}`);
};