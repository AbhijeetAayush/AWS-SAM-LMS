const { supabase } = require("../config/supabase");
const { error } = require("../utils/responseHelper");

async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) return error(res, "No token provided", 401);
  const { data, error: authError } = await supabase.auth.getUser(token);
  if (authError) return error(res, "Invalid token", 401);
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();
  if (profileError) return error(res, "Profile not found", 404);
  req.user = { ...data.user, role: profile.role };
  next();
}

module.exports = authMiddleware;
