const Joi = require("joi");
const { error } = require("./responseHelper");

const schemas = {
  course: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow(""),
    instructor: Joi.string().required(),
    price: Joi.number().positive().required(),
  }),
  lesson: Joi.object({
    course_id: Joi.string().uuid().required(),
    title: Joi.string().required(),
    video_url: Joi.string().uri().required(),
    resource_links: Joi.array().items(Joi.string().uri()).optional(),
  }),
  quiz: Joi.object({
    course_id: Joi.string().uuid().required(),
  }),
  question: Joi.object({
    quiz_id: Joi.string().uuid().required(),
    text: Joi.string().required(),
    options: Joi.array().items(Joi.string()).min(2).required(),
    correct_answer: Joi.string().required(),
  }),
  enrollment: Joi.object({
    course_id: Joi.string().uuid().required(),
  }),
  quizAttempt: Joi.object({
    quiz_id: Joi.string().uuid().required(),
    answers: Joi.array().items(Joi.string()).required(),
  }),
};

async function validate(schemaName, data, res) {
  try {
    await schemas[schemaName].validateAsync(data, { abortEarly: false });
  } catch (err) {
    error(res, err.details.map((d) => d.message).join(", "), 400);
    throw err;
  }
}

module.exports = { validate, schemas };
