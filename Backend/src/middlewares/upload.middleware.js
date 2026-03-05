const Multer = require("multer");
const storage = Multer.memoryStorage();

const upload = new Multer({
    storage: storage,
    limits: 1024 * 1024 * 20
})

module.exports = upload;