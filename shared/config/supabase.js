const { createClient } = require("@supabase/supabase-js");
const { supabaseUrl, supabaseKey } = require("./index");

const supabase = createClient(supabaseUrl, supabaseKey);
module.exports = { supabase };
