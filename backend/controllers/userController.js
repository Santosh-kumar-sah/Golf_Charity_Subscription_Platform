import { supabase } from "../config/supabase.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// PATCH /api/user/charity
// const updateUserCharity = asyncHandler(async (req, res) => {
//   const userId = req.user.id;
//   const { charity_id, charity_percentage } = req.body;

//   // validation
//   if (!charity_id) {
//     throw new ApiError(400, "Charity is required");
//   }

//   if (!charity_percentage || charity_percentage < 10) {
//     throw new ApiError(400, "Minimum contribution is 10%");
//   }

//   // check charity exists
//   const { data: charity, error: charityError } = await supabase
//     .from("charities")
//     .select("id")
//     .eq("id", charity_id)
//     .single();

//   if (charityError || !charity) {
//     throw new ApiError(404, "Charity not found");
//   }

//   // update user
//   const { data, error } = await supabase
//     .from("users")
//     .update({
//       charity_id,
//       charity_percentage,
//     })
//     .eq("id", userId)
//     .select()
//     .maybeSingle();

//   if (error) throw new ApiError(500, error.message);

//   res.json(new ApiResponse(200, data, "Charity updated successfully"));
// });

const updateUserCharity = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // ❌ रोकना है admin को
  if (req.user.isAdmin) {
    throw new ApiError(403, "Admins cannot select charity");
  }

  const { charity_id, charity_percentage } = req.body;

  if (!charity_id) {
    throw new ApiError(400, "Charity is required");
  }

  const percentage = charity_percentage || 10;

  if (percentage < 10) {
    throw new ApiError(400, "Minimum contribution is 10%");
  }

  // ✅ check charity exists
  const { data: charity, error: charityError } = await supabase
    .from("charities")
    .select("id")
    .eq("id", charity_id)
    .single();

  if (charityError || !charity) {
    throw new ApiError(404, "Charity not found");
  }

  // ✅ update user
  const { data, error } = await supabase
    .from("users")
    .update({
      charity_id,
      charity_percentage: percentage,
    })
    .eq("id", userId)
    .select("id, email, name, charity_id, charity_percentage") // ✅ only required fields
    .single();

  if (error) throw new ApiError(500, error.message);

  res.json(
    new ApiResponse(200, data, "Charity updated successfully")
  );
});


// const getUserCharity = asyncHandler(async (req, res) => {
//   const userId = req.user.id;

//   const { data, error } = await supabase
//     .from("users")
//     .select(`
//       charity_percentage,
//       charities (
//         id,
//         name,
//         image_url
//       )
//     `)
//     .eq("id", userId)
//     .single();

//   if (error) throw new ApiError(500, error.message);

//   res.json(new ApiResponse(200, data, "User charity fetched"));
// });

const getUserCharity = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const { data, error } = await supabase
    .from("users")
    .select(`
      charity_percentage,
      charities (
        id,
        name,
        image_url
      )
    `)
    .eq("id", userId)
    .single();

  if (error) throw new ApiError(500, error.message);

  res.json(new ApiResponse(200, data, "User charity fetched"));
});
export { updateUserCharity, getUserCharity };