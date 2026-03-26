



import { supabase } from "../config/supabase.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import cloudinary from "../config/cloudinary.js";

// ===============================
// 👤 USER: Upload Proof
// ===============================
const uploadProof = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { winnerId } = req.params;

  if (!req.file || !req.file.buffer || req.file.buffer.length === 0) {
    throw new ApiError(400, "Proof image is required and cannot be empty");
  }

  // ✅ Upload to Cloudinary
  let imageUrl;
  try {
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "winner_proofs" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });
    imageUrl = uploadResult.secure_url;
  } catch (uploadError) {
    throw new ApiError(500, `Image upload failed: ${uploadError.message}`);
  }

  const { data: winner, error: fetchError } = await supabase
    .from("draw_results")
    .select("*")
    .eq("id", winnerId)
    .single();

  if (fetchError || !winner) {
    throw new ApiError(404, "Winner not found");
  }

  if (winner.user_id !== userId) {
    throw new ApiError(403, "Unauthorized");
  }

  if (winner.proof_url) {
    throw new ApiError(400, "Proof already uploaded");
  }

  const { data, error } = await supabase
    .from("draw_results")
    .update({
      proof_url: imageUrl,
      status: "pending",
    })
    .eq("id", winnerId)
    .select("id, proof_url, status")
    .single();

  if (error) throw new ApiError(500, error.message);

  res.json(new ApiResponse(200, data, "Proof uploaded successfully"));
});

// ===============================
// 👤 USER: Get My Winnings
// ===============================
const getMyWinnings = asyncHandler(async (req, res) => {
  const userId = req.user.id;
 console.log("REQ.USER:", req.user);

  const { data, error } = await supabase
    .from("draw_results")
    .select("*")
    .eq("user_id", userId) // ✅ FIXED
    .order("created_at", { ascending: false });

  if (error) throw new ApiError(500, error.message);

  res.json(new ApiResponse(200, data, "User winnings fetched"));
});

// ===============================
// 👨‍💼 ADMIN: Get All Winners
// ===============================
const getAllWinners = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(403, "Admin only");
  }

  const { data, error } = await supabase
    .from("draw_results")
    // .select(`
    //   *,
    //   users (id, name, email)
    // `)
      .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new ApiError(500, error.message);

  res.json(new ApiResponse(200, data, "All winners fetched"));
});

// ===============================
// 👨‍💼 ADMIN: Approve / Reject
// ===============================
const updateWinnerStatus = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(403, "Admin only");
  }

  const { id } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const { data: winner } = await supabase
    .from("draw_results")
    .select("*")
    .eq("id", id)
    .single();

  if (!winner) throw new ApiError(404, "Winner not found");

  if (winner.status !== "pending") {
    throw new ApiError(400, "Already processed");
  }

  const { data, error } = await supabase
    .from("draw_results")
    .update({ status })
    .eq("id", id)
    .select("id, status")
    .single();

  if (error) throw new ApiError(500, error.message);

  res.json(new ApiResponse(200, data, `Winner ${status}`));
});

// ===============================
// 👨‍💼 ADMIN: Mark Payment
// ===============================
const markPayment = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(403, "Admin only");
  }

  const { id } = req.params;

  const { data: winner } = await supabase
    .from("draw_results")
    .select("*")
    .eq("id", id)
    .single();

  if (!winner) throw new ApiError(404, "Winner not found");

  if (winner.status !== "approved") {
    throw new ApiError(400, "Not approved yet");
  }

  const { data, error } = await supabase
    .from("draw_results")
    .update({ payment_status: "paid" })
    .eq("id", id)
    .select("id, payment_status")
    .single();

  if (error) throw new ApiError(500, error.message);

  res.json(new ApiResponse(200, data, "Payment marked as paid"));
});

export {
  uploadProof,
  getMyWinnings,
  getAllWinners,
  updateWinnerStatus,
  markPayment,
};