const express = require("express");
const controller = require("./controller");
const app = express();
const router = express.Router();

router.get("/signup", controller.redirectToGitHub);
router.get("/callback", controller.handleOAuthCallback);

app.use("/auth", router);
module.exports = app;
