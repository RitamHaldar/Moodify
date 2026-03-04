const express = require("express");
const authController = require("../controlers/auth.controller");
const identifyuser = require("../middlewares/auth.middleware");
const authrouter = express.Router();

authrouter.post("/register",authController.registeruserconroller);
authrouter.post("/login", authController.loginusercontroller);
authrouter.get("/get-me",identifyuser,authController.getmecontroller)
authrouter.get("/logout",identifyuser,authController.logoutusercontroller);
module.exports = authrouter;