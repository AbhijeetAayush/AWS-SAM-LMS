const { supabase } = require("../config/supabase");

async function createQuiz(data) {
  const { data: quiz, error } = await supabase
    .from("quizzes")
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return quiz;
}

async function createQuestion(data) {
  const { data: question, error } = await supabase
    .from("questions")
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return question;
}

async function getQuizzesByCourse(courseId) {
  const { data, error } = await supabase
    .from("quizzes")
    .select("*, questions(*)")
    .eq("course_id", courseId);
  if (error) throw error;
  return data;
}

async function submitQuizAttempt(userId, courseId, quizId, answers) {
  const { data: questions, error } = await supabase
    .from("questions")
    .select("id, correct_answer")
    .eq("quiz_id", quizId);
  if (error) throw error;
  const score =
    (answers.reduce(
      (acc, ans, i) => acc + (ans === questions[i].correct_answer ? 1 : 0),
      0
    ) /
      questions.length) *
    100;
  const { data: progress, error: fetchError } = await supabase
    .from("progress")
    .select("quiz_attempts")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .single();
  if (fetchError && fetchError.code !== "PGRST116") throw fetchError;
  const attempts = progress?.quiz_attempts || [];
  attempts.push({ quiz_id: quizId, attempt_num: attempts.length + 1, score });
  const { error: updateError } = await supabase
    .from("progress")
    .upsert(
      { user_id: userId, course_id: courseId, quiz_attempts: attempts },
      { onConflict: "user_id,course_id" }
    );
  if (updateError) throw updateError;
  return { score, attempt_num: attempts.length };
}

module.exports = {
  createQuiz,
  createQuestion,
  getQuizzesByCourse,
  submitQuizAttempt,
};
