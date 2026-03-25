const songmodel = require("../models/song.model");

const { user } = require("../services/upload.service");
const id3 = require("node-id3");
async function createsonghandler(req, res) {
    const { mood } = req.body;
    const tag = id3.read(req.file.buffer);
    const [posterFile, songFile] = await Promise.all(
        [user(
            tag.image.imageBuffer,
            tag.title + ".jpeg",
            "cohort-2.0/moodify/poster"
        ),
        user(
            req.file.buffer,
            tag.title + "mp3",
            "cohort-2.0/moodify/songs"
        )
        ])

    const song = await songmodel.create({
        songUrl: songFile.url,
        posterUrl: posterFile.url,
        title: tag.title,
        mood

    })
    res.status(201).json({
        message: "Song uploades successfully",
        song
    })
}

async function getsongcontroller(req, res) {
    const { mood } = req.query;
    const songs = await songmodel.find({ mood });
    res.status(200).json({
        message: "Song fetched successfully",
        songs
    })
}
module.exports = {
    createsonghandler,
    getsongcontroller
}