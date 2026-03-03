const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:[true,"Username Already exists"],
        required:[true,"Username is required"]
    },
    email:{
        type:String,
        unique:[true,"Email already exists"],
        required:[true,"Email is required"]
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    }
})

const authmodel=mongoose.model("users",userSchema);

module.exports = authmodel;