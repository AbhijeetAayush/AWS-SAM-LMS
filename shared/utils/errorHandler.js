const { error } = require("./responseHelper");

function handleError(res, err, status = 500) {
  console.error(err);
  error(res, err.message || "Internal Server Error", status);
}

module.exports = { handleError };
