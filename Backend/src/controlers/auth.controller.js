const bcrypt = require("bcryptjs");
const jwttoken = require("jsonwebtoken");
const usermodel = require("../models/user.model");
const redis = require("../config/cache");

/**
 * @description Register a new user
 * @route POST /api/auth/register
 * @access Public
 */

async function registeruserconroller(req, res) {
    const { username, email, password } = req.body;
    const useralreadyexists = await usermodel.findOne({
        $or: [
            { username },
            { email }
        ]
    })
    if (useralreadyexists) {
        return res.status(409).json({
            message: "user already exists with this " + (useralreadyexists.email == email ? email : username)
        })
    }
    const hashpass = await bcrypt.hash(password, 10);

    const user = await usermodel.create({
        username, email, password: hashpass
    })
    const token = jwttoken.sign({
        id: user._id,
        username: user.username
    },
        process.env.JWT_SECRET,
        { expiresIn: "3d" });

    res.cookie("token", token);
    res.status(201).json({
        message: "User created successfully",
        user
    })

}

/**
 * @description Login user
 * @route POST /api/auth/login
 * @access Public
 */

async function loginusercontroller(req, res) {
    const { username, email, password } = req.body

    const user = await usermodel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (!user) {
        return res.status(404).json({
            message: "User does not exist"
        })
    }

    const validpassword = await bcrypt.compare(password, user.password);
    if (!validpassword) {
        return res.status(401).json({
            message: "Incorrect password"
        })
    }

    const token = jwttoken.sign({
        id: user._id,
        username: user.username
    }, process.env.JWT_SECRET,
        { expiresIn: "3d" })
    res.cookie("token", token);
    res.status(201).json({
        message: "user logged in successfully",
        user
    })

}


/**
 * @description Get current user
 * @route GET /api/auth/me
 * @access Private
 */

async function getmecontroller(req, res) {
    const user = await usermodel.findById(req.user.id).select("-password");
    if (!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }
    res.status(200).json({
        message: "User fetched succesdsfully",
        user
    })
}


/**
 * @description Logout user
 * @route POST /api/auth/logout
 * @access Private
 */

async function logoutusercontroller(req, res) {
    const user = req.user.username;
    const token = req.cookies.token;

    res.clearCookie("token");
    await redis.set(token, Date.now().toString(), "EX", 60 * 60);
    res.status(200).json({
        message: "User logged out successfully"
    })

}
module.exports = {
    registeruserconroller,
    loginusercontroller,
    logoutusercontroller,
    getmecontroller
}