const jwtToken= require("jsonwebtoken")

const protectedRoute= async (req, res, next)=>{
    const token=req.headers.authorization?.split(" ")[1]

    if (!token){
        return res.status(401).json({error:'Unauthorized to access'})
    }

    try{
        const tokendecoded=jwtToken.verify(token, process.env.JWT_SECRET)
        req.user=tokendecoded
        next()
        
    }catch(err){
        res.status(401).json({error:err.message})
    }
}

const restrictAccess= async (req, res, next)=>{
    const role=req.user.role
    if (role==='Admin' || role==="Editor"){
        next()
    }
    else{
        return res.status(403).json({error:"You are Forbidden"})
    }
}

module.exports={protectedRoute, restrictAccess}
