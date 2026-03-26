import { supabase } from "../config/supabase.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// ✅ GET LAST 5 SCORES
const getScores = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const { data, error } = await supabase
    .from("scores")
    .select("*")
    .eq("user_id", userId)
    .order("played_at", { ascending: false })
    .limit(5);

  if (error) {
    throw new ApiError(500, error.message);
  }

  res.json(new ApiResponse(200, data, "Scores fetched"));
});


// ✅ ADD SCORE (ROLLING LOGIC)
const addScore = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { score, played_at } = req.body;

  // 1️⃣ Get existing scores (oldest first)
  const { data: existingScores, error: fetchError } = await supabase
    .from("scores")
    .select("*")
    .eq("user_id", userId)
    .order("played_at", { ascending: true });

  if (fetchError) {
    throw new ApiError(500, fetchError.message);
  }

  // 2️⃣ If already 5 → delete oldest
  if (existingScores.length >= 5) {
    const oldest = existingScores[0];

    const { error: deleteError } = await supabase
      .from("scores")
      .delete()
      .eq("id", oldest.id);

    if (deleteError) {
      throw new ApiError(500, deleteError.message);
    }
  }

  // 3️⃣ Insert new score
  const { data, error } = await supabase
    .from("scores")
    .insert([
      {
        user_id: userId,
        score,
        played_at
      }
    ])
    .select();

  if (error) {
    throw new ApiError(500, error.message);
  }

  res.json(new ApiResponse(201, data, "Score added"));
});



const updateScore = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { score, played_at } = req.body;
  const userId = req.user.id;

  const { data, error } = await supabase
    .from("scores")
    .update({ score, played_at })
    .eq("id", id)
    .eq("user_id", userId)
    .select();

  if (error) throw new ApiError(500, error.message);

  res.json(new ApiResponse(200, data, "Score updated"));
});


// ✅ DELETE SCORE
const deleteScore = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const { error } = await supabase
    .from("scores")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw new ApiError(500, error.message);
  }

  res.json(new ApiResponse(200, {}, "Score deleted"));
});

export { getScores, addScore, deleteScore, updateScore };