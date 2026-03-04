const Redis = require("ioredis").default;
const redis = new Redis({
    host:process.env.REDIS_HOST,
    port:process.env.REDIS_POST,
    password:process.env.Redis_PASS
})

redis.on("connect",()=>{
    console.log("Connected to redis");
})
redis.on("error",(err)=>{
    console.log(err);
})

module.exports = redis;