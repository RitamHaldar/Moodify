
const ImageKit = require("@imagekit/nodejs").default;
const client = new ImageKit({
    privateKey: process.env.IMAGE_KIT_KEY
})

const user = async (buffer, filename, foldername = "") => {
    const file = await client.files.upload({
        file: await ImageKit.toFile(Buffer.from(buffer)),
        fileName: filename,
        foldername
    })
    return file
}

module.exports = { user }