const mongoose = require("mongoose");
const songschema = new mongoose.Schema({
    songUrl: {
        type: String,
        required: [true, "Song is required"]
    },
    posterUrl: {
        type: String,
        required: [true, "Poster is required"]
    },
    title: {
        type: String,
        required: [true, "Caption is required"]
    },
    mood: {
        type: String,
        required: [true, "Mood is required"],
        enum: ["happy", "sad", "surprised"]
    }

})
const songmodel = mongoose.model("songs", songschema);
module.exports = songmodel;