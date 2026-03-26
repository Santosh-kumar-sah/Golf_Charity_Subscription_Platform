import { supabase } from "../config/supabase.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import cloudinary from "../config/cloudinary.js";

const addCharity = asyncHandler(async (req, res) => {
  if (!req.user?.isAdmin) {
    throw new ApiError(403, "Admin access required");
  }

  const { name, description } = req.body;

  if (!name) throw new ApiError(400, "Name required");

  let image_url = null;
  let image_public_id = null;

  
  if (req.file && req.file.buffer && req.file.buffer.length > 0) {
    try {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "charities" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      image_url = uploadResult.secure_url;
      image_public_id = uploadResult.public_id;
    } catch (uploadError) {
      throw new ApiError(500, `Image upload failed: ${uploadError.message}`);
    }
  }

  const { data, error } = await supabase
    .from("charities")
    .insert([{ name, description, image_url, image_public_id }])
    .select()
    .maybeSingle();

  if (error) throw new ApiError(500, error.message);

  res.json(new ApiResponse(201, data, "Charity created"));
});


const editCharity = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data: existing } = await supabase
    .from("charities")
    .select("*")
    .eq("id", id)
    .single();

  if (!existing) throw new ApiError(404, "Charity not found");

  let image_url = existing.image_url;
  let image_public_id = existing.image_public_id;

 
  if (req.file && req.file.buffer && req.file.buffer.length > 0) {
    try {
    
      if (image_public_id) {
        await cloudinary.uploader.destroy(image_public_id);
      }

    
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "charities" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      image_url = uploadResult.secure_url;
      image_public_id = uploadResult.public_id;
    } catch (uploadError) {
      throw new ApiError(500, `Image upload failed: ${uploadError.message}`);
    }
  }

  const { data, error } = await supabase
    .from("charities")
    .update({
      ...req.body,
      image_url,
      image_public_id,
    })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) throw new ApiError(500, error.message);

  res.json(new ApiResponse(200, data, "Charity updated"));
});

// DELETE /api/admin/charities/:id
const deleteCharity = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data } = await supabase
    .from("charities")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) throw new ApiError(404, "Not found");

  // 🔥 Delete image from Cloudinary
  if (data.image_public_id) {
    await cloudinary.uploader.destroy(data.image_public_id);
  }

  await supabase.from("charities").delete().eq("id", id);

  res.json(new ApiResponse(200, {}, "Charity deleted"));
});
// GET /api/admin/charities
const listCharities = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    throw new ApiError(403, "Admin access required");
  }

  const { data, error } = await supabase
    .from("charities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new ApiError(500, error.message);

  res.json(new ApiResponse(200, data, "Charities fetched successfully"));
});

export { addCharity, editCharity, deleteCharity, listCharities };