const { supabase } = require("../config/supabase");

async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
}

async function updateUserRole(userId, role) {
  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);
  if (error) throw error;
}

module.exports = { getUserProfile, updateUserRole };
