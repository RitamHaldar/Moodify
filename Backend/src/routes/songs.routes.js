const express = require("express");

const songroute = express.Router();
const upload = require("../middlewares/upload.middleware");
const songcontroller = require("../controlers/song.controller");
const identifyuser = require("../middlewares/auth.middleware");
songroute.post("/", upload.single("song"), identifyuser, songcontroller.createsonghandler);
songroute.get("/", identifyuser, songcontroller.getsongcontroller);

module.exports = songroute;