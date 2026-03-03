const bcrypt = require("bcryptjs");
const jwttoken = require("jsonwebtoken");
const usermodel = require ("../models/user.model");

async function registeruserconroller(req,res) {
    const {username , email , password } = req.body;
    const useralreadyexists = await usermodel.findOne({
        $or:[
            {username},
            {email}
        ]
    })
    if(useralreadyexists){
        return res.status(409).json({
            message: "user already exists with this "+(useralreadyexists.email==email? email:username)
        })
    }
    const hashpass = await bcrypt.hash(password,10);

    const user = await usermodel.create({
        username,email,password:hashpass
    })
    const token = jwttoken.sign({
        id:user._id,
        username:user.username
    },
        process.env.JWT_SECRET,
    {expiresIn:"3d"});

    res.cookie("token",token);
    res.status(201).json({
        message:"User created successfully",
        user
    })
    
}

async function loginusercontroller(req,res){
    const {username , email , password } = req.body

    const userexists = await usermodel.findOne({
        $or:[
            {username},
            {email}
        ]
    })

    if(!userexists){
        return res.status(404).json({
            message:"User does not exist"
        })
    }

    const validpassword = await bcrypt.compare(password,userexists.password);
    if(!validpassword){
        return res.status(401).json({
            message:"Incorrect password"
        })
    }

    const token = jwttoken.sign({
        id: userexists._id,
        username: userexists.username
    }, process.env.JWT_SECRET,
        { expiresIn: "3d" })
    res.cookie("token",token);
    res.status(201).json({
        message:"user logged in successfully",
        userexists
    })

}

module.exports = {
    registeruserconroller,
    loginusercontroller
}