const { supabase } = require("../config/supabase");
const { getPaginatedResults } = require("../utils/pagination");

async function createCourse(data) {
  const { data: course, error } = await supabase
    .from("courses")
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return course;
}

async function getCourses(cursor, limit) {
  return getPaginatedResults("courses", cursor, limit);
}

async function getCourseById(id) {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

async function enroll(userId, courseId) {
  const { error } = await supabase
    .from("enrollments")
    .insert({ user_id: userId, course_id: courseId });
  if (error) throw error;
}

module.exports = { createCourse, getCourses, getCourseById, enroll };
