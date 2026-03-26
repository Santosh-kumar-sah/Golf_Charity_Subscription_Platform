import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

// Use Service Role Key here
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);



const makeAdmin = async () => {
  const { data, error } = await supabase
    .from("users")
    .update({ isAdmin: true, role: 'admin' })
    .eq('email', 'admin1234@gmail.com');

  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Updated:", data);
  }
  
};


makeAdmin();