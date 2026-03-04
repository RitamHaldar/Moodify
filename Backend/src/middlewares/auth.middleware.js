const jwttoken = require("jsonwebtoken");
const redis = require("../config/cache");
async function identifyuser(req,res,next){
    const token = req.cookies.token;
    let decoded = null
    if(!token){
        return res.status(401).json({
            message:"Token not present"
        })
    }
    const backlisted = await redis.get(token);
    if(backlisted){
        return res.status(200).json({
            message:"Token Already Backlisted"
        })
    }
    try {
        decoded= jwttoken.verify(token,process.env.JWT_SECRET);
    }catch(err){
        return res.status(401).json({
            message:"Invalid Token"
        })
    }

    req.user = decoded;
    next();

}
module.exports = identifyuser