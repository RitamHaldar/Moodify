const cookieParser = require("cookie-parser");
const express = require("express");
const authrouter = require("./routes/auth.routes");
const songroute = require("./routes/songs.routes");
const cors = require("cors");

const app = express();
app.use(cors({
    withCredentials:true,
    origin:"http://localhost:5173"
}))
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth",authrouter);
app.use("/api/songs",songroute);
module.exports = app;