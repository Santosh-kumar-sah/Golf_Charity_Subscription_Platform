

import { supabase } from "../config/supabase.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateDrawNumbers, countMatches } from "../utils/drawUtils.js";

// Admin simulation: generate draw automatically and calculate winners
const simulateDraw = asyncHandler(async (req, res) => {
  // ✅ Admin check
  if (!req.user || !req.user.isAdmin) {
    throw new ApiError(403, "Admin access required");
  }

  const drawDate = new Date().toISOString().slice(0, 10);

  // ✅ Generate 5 random draw numbers
  const drawNumbers = generateDrawNumbers();

  // ✅ Check if a draw already exists for this date (optional)
  const { data: existingDraw } = await supabase
    .from("draws")
    .select("*")
    .eq("draw_date", drawDate)
    .maybeSingle();

  if (existingDraw) {
    throw new ApiError(400, "A draw already exists for today");
  }

  // ✅ Fetch all users
  const { data: users, error: usersError } = await supabase
    .from("users")
    .select("id");
  if (usersError) throw new ApiError(500, usersError.message);

  const winners = [];

  for (const user of users) {
    // ✅ Fetch latest 5 scores
    const { data: scores, error: scoresError } = await supabase
      .from("scores")
      .select("score")
      .eq("user_id", user.id)
      .order("played_at", { ascending: false })
      .limit(5);

    if (scoresError) throw new ApiError(500, scoresError.message);

    const userScores = scores.map(s => s.score);
    const matches = countMatches(userScores, drawNumbers);

    if (matches >= 3) {
      let prize = 0;
      if (matches === 5) prize = 400; // 40%
      else if (matches === 4) prize = 350; // 35%
      else if (matches === 3) prize = 250; // 25%

      winners.push({ user_id: user.id, matched_numbers: matches, prize_amount: prize });
    }
  }

  // ✅ Save draw
  const { data: draw, error: drawError } = await supabase
    .from("draws")
    .insert([{ draw_date: drawDate, numbers: drawNumbers }])
    .select()
    .maybeSingle();

  if (drawError) throw new ApiError(500, drawError.message);

  // ✅ Save draw results
  if (winners.length > 0) {
    const resultsToInsert = winners.map(w => ({ ...w, draw_id: draw.id }));
    const { error: resultsError } = await supabase
      .from("draw_results")
      .insert(resultsToInsert);

    if (resultsError) throw new ApiError(500, resultsError.message);
  }

  res.json(new ApiResponse(200, { draw, winners }, "Draw simulated successfully"));
});


const getAllDraws = asyncHandler(async (req, res) => {
  if (!req.user?.isAdmin) throw new ApiError(403, "Admin access required");

  const { data, error } = await supabase
    .from("draws")
    .select(
      `id, draw_date, numbers, created_at, draw_results(count)`
    )
    .order("draw_date", { ascending: false });

  if (error) throw new ApiError(500, error.message);

  res.json(new ApiResponse(200, data, "All draws fetched"));
});


const publishDraw = asyncHandler(async (req, res) => {
  if (!req.user?.isAdmin) throw new ApiError(403, "Admin access required");

  const { id } = req.params;

  const { data, error } = await supabase
    .from("draws")
    .update({ published: true })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) throw new ApiError(500, error.message);
  if (!data) throw new ApiError(404, "Draw not found");

  res.json(new ApiResponse(200, data, "Draw published successfully"));
});

const getAllDrawResults = asyncHandler(async (req, res) => {
  if (!req.user?.isAdmin) throw new ApiError(403, "Admin access required");

  const { data, error } = await supabase
    .from("draw_results")
    .select("id, draw_id, user_id, matched_numbers, prize_amount, created_at")
    .order("created_at", { ascending: false });

  if (error) throw new ApiError(500, error.message);

  res.json(new ApiResponse(200, data, "All draw results fetched"));
});


const getAllPublicDraws = async (req, res) => {
  try {
    // Only published draws
    const draws = await Draw.findAll({
      where: { published: true },
      attributes: ["id", "title", "date", "prizeAmount"],
      order: [["date", "ASC"]],
      limit: 10, // limit to 10 for home page
    });

    res.status(200).json(draws);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching public draws" });
  }
};

const calculatePrizePool = asyncHandler(async (req, res) => {
  if (!req.user?.isAdmin) throw new ApiError(403, "Admin access required");

  const { draw_id } = req.params;
  if (!draw_id) throw new ApiError(400, "draw_id is required");

  // ✅ Fetch active subscriptions (dummy logic, assume monthly = 100, yearly = 1200)
  const { data: subs, error: subError } = await supabase
    .from("subscriptions")
    .select("plan")
    .eq("status", "active");

  if (subError) throw new ApiError(500, subError.message);


  const totalPool = subs.reduce((sum, s) => sum + (s.plan === "monthly" ? 100 : 1200), 0);

  const match_5 = totalPool * 0.4; // 40%
  const match_4 = totalPool * 0.35; // 35%
  const match_3 = totalPool * 0.25; // 25%

  // ✅ Save to prize_pools table
  const { data, error } = await supabase
    .from("prize_pools")
    .insert([{ draw_id, total_pool: totalPool, match_5, match_4, match_3 }])
    .select()
    .maybeSingle();

  if (error) throw new ApiError(500, error.message);

  res.json(new ApiResponse(200, data, "Prize pool calculated successfully"));
});

// Admin: get all prize pools
const getPrizePools = asyncHandler(async (req, res) => {
  if (!req.user?.isAdmin) throw new ApiError(403, "Admin access required");

  const { data, error } = await supabase
    .from("prize_pools")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new ApiError(500, error.message);

  res.json(new ApiResponse(200, data, "All prize pools fetched"));
});
export { simulateDraw, getAllDraws, publishDraw, getAllDrawResults, calculatePrizePool, getPrizePools, getAllPublicDraws };