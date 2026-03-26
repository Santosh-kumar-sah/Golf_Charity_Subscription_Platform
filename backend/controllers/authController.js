

import { supabase } from "../config/supabase.js";
import { generateToken } from "../utils/generateToken.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// REGISTER USER
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) throw new ApiError(400, "Email and password required");

  // 1️⃣ Sign up via Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
  if (authError) throw new ApiError(400, authError.message);

  // 2️⃣ Create profile row in users table
  const { data: profileData, error: profileError } = await supabase
    .from("users")
    .insert([{ id: authData.user.id, email, name: name || email, isAdmin: false }])
    .select()
    .maybeSingle();

  if (profileError) throw new ApiError(500, profileError.message);

  // 3️⃣ Generate JWT including isAdmin
  const token = generateToken({ id: profileData.id, isAdmin: profileData.isAdmin });

  res
    .cookie("token", token, { httpOnly: true, secure: false, sameSite: "strict" })
    .status(201)
    .json(new ApiResponse(201, { user: profileData }, "User registered"));
});



const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1️⃣ Authenticate via Supabase Auth
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({ email, password });

  if (authError) throw new ApiError(401, authError.message);
  if (!authData.user) throw new ApiError(401, "Login failed");

  const authUser = authData.user;

  // 2️⃣ Find user using email (NOT id)
  let { data: profile, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("email", authUser.email)
    .maybeSingle();

  if (profileError) throw new ApiError(500, profileError.message);
  if (!profile) throw new ApiError(404, "User profile not found");

  // 3️⃣ ✅ FIXED: Update auth_id SAFELY + HANDLE ERROR
  const { error: updateError } = await supabase
    .from("users")
    .update({ auth_id: authUser.id })
    .eq("email", authUser.email); // ✅ use email (consistent)

  if (updateError) {
    console.error("AUTH_ID UPDATE ERROR:", updateError);
    throw new ApiError(500, "Failed to sync auth_id");
  }

  // 4️⃣ Generate JWT using YOUR DB ID (IMPORTANT)
  const token = generateToken({
    id: profile.id,        // ✅ DB user id
    isAdmin: profile.isAdmin,
    role: profile.role,
  });

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    })
    .json(new ApiResponse(200, { user: profile }, "Login successful"));
});

// LOGOUT USER
const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "strict", secure: false })
     .json(new ApiResponse(200, {}, "Logged out successfully"));
});

// GET ME
const getMe = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) throw new ApiError(401, "Unauthorized");

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", req.user.id)
    .maybeSingle();

  if (error) throw new ApiError(500, error.message);

  res.json(new ApiResponse(200, data, "User fetched successfully"));
});

export { registerUser, loginUser, logoutUser, getMe };