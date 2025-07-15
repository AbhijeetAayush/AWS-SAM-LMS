const { supabase } = require("../config/supabase");

async function getProgress(userId, courseId) {
  const { data: progress, error } = await supabase
    .from("progress")
    .select("completed_lessons, quiz_attempts")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .single();
  if (error && error.code !== "PGRST116") throw error;
  const { data: lessons, error: lessonError } = await supabase
    .from("lessons")
    .select("id")
    .eq("course_id", courseId);
  if (lessonError) throw lessonError;
  const totalLessons = lessons.length;
  const completedLessons = progress?.completed_lessons?.length || 0;
  const quizAvg =
    progress?.quiz_attempts?.reduce((acc, a) => acc + a.score, 0) /
      (progress?.quiz_attempts?.length || 1) || 0;
  const percentComplete = totalLessons
    ? (completedLessons / totalLessons) * 50 + quizAvg * 0.5
    : 0;
  return {
    completed_lessons: progress?.completed_lessons || [],
    quiz_attempts: progress?.quiz_attempts || [],
    percent_complete: percentComplete,
  };
}

module.exports = { getProgress };
