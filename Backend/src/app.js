const cookieParser = require("cookie-parser");
const express = require("express");
const authrouter = require("./routes/auth.routes");
const songroute = require("./routes/songs.routes");
const cors = require("cors");

const app = express();
app.use(cors({
    credentials: true,
    origin: "https://moodsync-ectw.onrender.com"
}))
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authrouter);
app.use("/api/songs", songroute);
app.use(express.static("./Public"))
module.exports = app;