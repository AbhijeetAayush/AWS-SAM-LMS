const { supabase } = require("../../shared/config/supabase");
const { success, error } = require("../../shared/utils/responseHelper");
const { githubClientId } = require("../../shared/config");

async function redirectToGitHub(req, res) {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${req.headers["x-forwarded-proto"]}://${req.headers.host}/auth/callback`,
      },
    });
    if (error) throw error;
    success(res, { redirectUrl: data.url });
  } catch (err) {
    error(res, err.message, 500);
  }
}

async function handleOAuthCallback(req, res) {
  try {
    const { code } = req.query;
    if (!code) return error(res, "No code provided", 400);
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;
    const { user, session } = data;
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert(
        { id: user.id, role: user.user_metadata.role || "user" },
        { onConflict: "id" }
      );
    if (profileError) throw profileError;
    success(res, { token: session.access_token });
  } catch (err) {
    error(res, err.message, 500);
  }
}

module.exports = { redirectToGitHub, handleOAuthCallback };
