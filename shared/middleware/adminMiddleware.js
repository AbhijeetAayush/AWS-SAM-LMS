const { error } = require("../utils/responseHelper");

function adminMiddleware(req, res, next) {
  if (req.user.role !== "admin")
    return error(res, "Admin access required", 403);
  next();
}

module.exports = adminMiddleware;
