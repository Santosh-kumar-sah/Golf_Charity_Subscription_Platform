import { supabase } from "../config/supabase.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// GET /api/admin/users — List all users
const getAllUsers = asyncHandler(async (req, res) => {
  // ✅ Check admin
  if (!req.user?.isAdmin) {
    throw new ApiError(403, "Admin access required");
  }

  const { data: users, error } = await supabase
    .from("users")
    .select("id, email, name, role, isAdmin");

  if (error) throw new ApiError(500, error.message);

  res.json(new ApiResponse(200, users, "Users fetched successfully"));
});

// PATCH /api/admin/users/:id — Edit user info (role, isAdmin)
const updateUser = asyncHandler(async (req, res) => {
  if (!req.user?.isAdmin) {
    throw new ApiError(403, "Admin access required");
  }

  const { id } = req.params;
  const { role, isAdmin, name } = req.body;

  const updateData = {};
  if (role) updateData.role = role;
  if (typeof isAdmin === "boolean") updateData.isAdmin = isAdmin;
  if (name) updateData.name = name;

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "No valid fields to update");
  }

  const { data, error } = await supabase
    .from("users")
    .update(updateData)
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) throw new ApiError(500, error.message);
  if (!data) throw new ApiError(404, "User not found");

  res.json(new ApiResponse(200, data, "User updated successfully"));
});


const updateScore = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { score, played_at } = req.body;

  // Check admin access
  if (!req.user || !req.user.isAdmin) {
    throw new ApiError(403, "Admin access required");
  }

  if (!score || score < 1 || score > 45) {
    throw new ApiError(400, "Score must be between 1 and 45");
  }

  const { data, error } = await supabase
    .from("scores")
    .update({ score, played_at })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) throw new ApiError(500, error.message);
  if (!data) throw new ApiError(404, "Score not found");

  res.json(new ApiResponse(200, data, "Score updated successfully"));
});

const deleteScore = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!req.user || !req.user.isAdmin) {
    throw new ApiError(403, "Admin access required");
  }

  const { data, error } = await supabase
    .from("scores")
    .delete()
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) throw new ApiError(500, error.message);
  if (!data) throw new ApiError(404, "Score not found");

  res.json(new ApiResponse(200, data, "Score deleted successfully"));
});
export { getAllUsers, updateUser, updateScore, deleteScore };