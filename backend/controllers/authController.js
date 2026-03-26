

// import { supabase } from "../config/supabase.js";
// import { generateToken } from "../utils/generateToken.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";
// import { ApiResponse } from "../utils/ApiResponse.js";

// // REGISTER
// const registerUser = asyncHandler(async (req, res) => {
//   const { name, email, password } = req.body;

//   if (!email || !password) throw new ApiError(400, "Email and password required");

//   // 1️⃣ Sign up user in Supabase
//   const { data, error } = await supabase.auth.signUp({ email, password });
//   if (error) throw new ApiError(400, error.message);

//   // 2️⃣ Insert into users table with default isAdmin = false
//   await supabase.from("users").insert([
//     { id: data.user.id, name, email, "isAdmin": false }
//   ]);

//   // 3️⃣ Generate our own JWT (with isAdmin = false)
//   const token = generateToken({ id: data.user.id, isAdmin: false });

//   res
//     .cookie("token", token, { httpOnly: true, secure: false, sameSite: "strict" })
//     .status(201)
//     .json(new ApiResponse(201, {id: data.user.id,name: name, email: data.user.email }, "User registered"));
// });

// // LOGIN (updated to include isAdmin)
// const loginUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   // 1️⃣ Authenticate via Supabase
//   const { data, error } = await supabase.auth.signInWithPassword({ email, password });
//   if (error) throw new ApiError(401, error.message);
//   if (!data.user) throw new ApiError(401, "Login failed");

//   // 2️⃣ Fetch user info from users table to get isAdmin
//   const { data: userData, error: userError } = await supabase
//     .from("users")
//     .select("id, email, isAdmin")
//     .eq("id", data.user.id)
//     .maybeSingle();

//   if (userError) throw new ApiError(400, userError.message);

//   // 3️⃣ Generate JWT including isAdmin
//   const token = generateToken({ id: userData.id, isAdmin: userData.isAdmin });

//   res
//     .cookie("token", token, { httpOnly: true, secure: false, sameSite: "strict" })
//     .json(new ApiResponse(200, { user: { id: userData.id,name: userData.name, email: userData.email, isAdmin: userData.isAdmin } }, "Login successful"));
// });

// // LOGOUT
// const logoutUser = asyncHandler(async (req, res) => {
//   res.clearCookie("token", { httpOnly: true, sameSite: "strict", secure: false })
//      .json(new ApiResponse(200, {}, "Logged out successfully"));
// });

// // GET ME
// const getMe = asyncHandler(async (req, res) => {
//   if (!req.user || !req.user.id) throw new ApiError(401, "Unauthorized");

//   const { data, error } = await supabase
//     .from("users")
//     .select("*")
//     .eq("id", req.user.id)
//     .single();

//   if (error) throw new ApiError(400, error.message);

//   res.json(new ApiResponse(200, data, "User fetched successfully"));
// });

// export { registerUser, loginUser, logoutUser, getMe };

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

// LOGIN USER
// const loginUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   // 1️⃣ Authenticate via Supabase Auth
//   const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
//   if (authError) throw new ApiError(401, authError.message);
//   if (!authData.user) throw new ApiError(401, "Login failed");

//   const userId = authData.user.id;

//   // 2️⃣ Check profile row
//   let { data: profile } = await supabase
//     .from("users")
//     .select("*")
//     .eq("id", userId)
//     .maybeSingle();

//   // 3️⃣ Auto-create profile if missing
//   if (!profile) {
//     const { data: newProfile, error: insertError } = await supabase
//       .from("users")
//       .insert([{ id: userId, email, name: email, isAdmin: false }])
//       .select()
//       .maybeSingle();

//     if (insertError) throw new ApiError(500, insertError.message);
//     profile = newProfile;
//   }

//   // 4️⃣ Generate JWT including isAdmin
//   const token = generateToken({ id: profile.id, isAdmin: profile.isAdmin });

//   res
//     .cookie("token", token, { httpOnly: true, secure: false, sameSite: "strict" })
//     .json(new ApiResponse(200, { user: profile }, "Login successful"));
// });

// const loginUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   // 1️⃣ Authenticate via Supabase Auth
//   const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
//   if (authError) throw new ApiError(401, authError.message);
//   if (!authData.user) throw new ApiError(401, "Login failed");

//   const userId = authData.user.id;

//   // 2️⃣ Fetch profile from users table
//   const { data: profile, error: profileError } = await supabase
//     .from("users")
//     .select("*")
//     .eq("id", userId)
//     .maybeSingle(); // fetch single row if exists

//   if (profileError) throw new ApiError(500, profileError.message);
//   if (!profile) throw new ApiError(404, "User profile not found");

//   // 3️⃣ Generate JWT including isAdmin
//   const token = generateToken({ id: profile.id, isAdmin: profile.isAdmin ,role: profile.role});

//   res
//     .cookie("token", token, { httpOnly: true, secure: false, sameSite: "strict" })
//     .json(new ApiResponse(200, { user: profile }, "Login successful"));
// });

// const loginUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   // 1️⃣ Authenticate via Supabase Auth
//   const { data: authData, error: authError } =
//     await supabase.auth.signInWithPassword({ email, password });

//   if (authError) throw new ApiError(401, authError.message);
//   if (!authData.user) throw new ApiError(401, "Login failed");

//   const authUser = authData.user;

//   // 2️⃣ Find user using email (NOT id)
//   let { data: profile, error: profileError } = await supabase
//     .from("users")
//     .select("*")
//     .eq("email", authUser.email)
//     .maybeSingle();

//   if (profileError) throw new ApiError(500, profileError.message);

//   // 3️⃣ If user exists → update auth_id
//   if (profile) {
//     await supabase
//       .from("users")
//       .update({ auth_id: authUser.id })
//       .eq("id", profile.id);
//   } else {
//     throw new ApiError(404, "User profile not found");
//   }

//   // 4️⃣ Generate JWT using YOUR DB ID (IMPORTANT)
//   const token = generateToken({
//     id: profile.id, // ✅ THIS is the fix
//     isAdmin: profile.isAdmin,
//     role: profile.role,
//   });

//   res
//     .cookie("token", token, {
//       httpOnly: true,
//       secure: false,
//       sameSite: "strict",
//     })
//     .json(new ApiResponse(200, { user: profile }, "Login successful"));
// });

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
      secure: false,
      sameSite: "strict",
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