const { supabase } = require("../config/supabase");

async function getLessonsByCourse(courseId) {
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("course_id", courseId);
  if (error) throw error;
  return data;
}

async function markLessonComplete(userId, courseId, lessonId) {
  const { data, error } = await supabase
    .from("progress")
    .select("completed_lessons")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .single();
  if (error && error.code !== "PGRST116") throw error;
  const completed = data?.completed_lessons || [];
  if (!completed.includes(lessonId)) {
    completed.push(lessonId);
    const { error: updateError } = await supabase
      .from("progress")
      .upsert(
        { user_id: userId, course_id: courseId, completed_lessons: completed },
        { onConflict: "user_id,course_id" }
      );
    if (updateError) throw updateError;
  }
}

module.exports = { getLessonsByCourse, markLessonComplete };
