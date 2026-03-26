import { supabase } from "../config/supabase.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getAdminReports = asyncHandler(async (req, res) => {
  if (!req.user?.isAdmin) throw new ApiError(403, "Admin access required");

  // 1️⃣ Total users
  const { count: totalUsers, error: usersError } = await supabase
    .from("users")
    .select("id", { count: "exact", head: true });
  if (usersError) throw new ApiError(500, usersError.message);

  // 2️⃣ Total prize pool
  const { data: prizeData, error: prizeError } = await supabase
    .from("prize_pools")
    .select("total_pool");
  if (prizeError) throw new ApiError(500, prizeError.message);

  const totalPrizePool = prizeData?.reduce((sum, p) => sum + Number(p.total_pool || 0), 0);

  // 3️⃣ Charity contributions
  // Sum of each user's active subscription * charity_percentage
  const { data: subs, error: subsError } = await supabase
    .from("subscriptions")
    .select("plan, user_id")
    .eq("status", "active");
  if (subsError) throw new ApiError(500, subsError.message);

  const { data: users, error: usersDataError } = await supabase
    .from("users")
    .select("id, charity_percentage");
  if (usersDataError) throw new ApiError(500, usersDataError.message);

  let totalCharity = 0;
  for (const sub of subs) {
    const user = users.find(u => u.id === sub.user_id);
    if (user) {
      const amount = sub.plan === "monthly" ? 100 : 1200; // dummy logic
      totalCharity += (amount * (user.charity_percentage || 10)) / 100;
    }
  }

  // 4️⃣ Draw statistics
  const { data: draws, error: drawsError } = await supabase
    .from("draws")
    .select("id, draw_date, published");
  if (drawsError) throw new ApiError(500, drawsError.message);

  const totalDraws = draws.length;
  const publishedDraws = draws.filter(d => d.published).length;
  const unpublishedDraws = totalDraws - publishedDraws;

  res.json(new ApiResponse(200, {
    totalUsers,
    totalPrizePool,
    totalCharity,
    drawStats: {
      totalDraws,
      publishedDraws,
      unpublishedDraws
    }
  }, "Admin reports fetched successfully"));
});

export { getAdminReports };