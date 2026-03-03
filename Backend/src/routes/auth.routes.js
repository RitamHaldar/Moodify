const express = require("express");
const authController = require("../controlers/auth.controller");

const authrouter = express.Router();

authrouter.post("/register",authController.registeruserconroller);
authrouter.post("/login", authController.loginusercontroller);

module.exports = authrouter;