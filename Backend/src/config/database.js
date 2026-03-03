const mongoose = require("mongoose");

const connecttoDB = () => {
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("Connected to MongoDB");
    })
}

module.exports = connecttoDB;