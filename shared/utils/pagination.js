const { supabase } = require("../config/supabase");

async function getPaginatedResults(table, cursor, limit = 10) {
  let query = supabase.from(table).select("*").order("id");
  if (cursor) query = query.gt("id", cursor);
  const { data, error } = await query.limit(limit);
  if (error) throw error;
  const nextCursor = data.length === limit ? data[data.length - 1].id : null;
  return { data, nextCursor };
}

module.exports = { getPaginatedResults };
