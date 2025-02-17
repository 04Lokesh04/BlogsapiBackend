const jwtToken=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const UserModel=require('../models/UserModel')
const {sendVerificationEmail}=require("../nodeMailer")
const { use } = require('../routes/authRoutes')


const register = async (req, res)=>{
    const {name, email, password, role}=req.body 

    if (!name || !email || !password || !role){
        return res.status(400).json({
            error: 'Provide all details'
        })
    }

    try{
        const existing= await UserModel.findOne({email})
        if (existing){
            return res.status(400).json({
                error:"email is already registered"
            })
        }
        
        const user= new UserModel({name, email, password, role})
        await user.save()
        const verificationToken= await jwtToken.sign({userId:user._id, email:user.email}, process.env.JWT_SECRET, {expiresIn:"1d"}) 
        await sendVerificationEmail(user.email, verificationToken)
        res.status(200).json({
            status:"success",
            message:"user created successfully. Check your email to verify your account"
        })
    }catch(err){
        res.status(400).json({
            error:err.message
        })
    }
}

const login = async (req, res)=>{
    const {email, password}=req.body 

    if (!email || !password ){
        return res.status(400).json({
            error: 'Provide all details'
        })
    }

    try{
        const user = await UserModel.findOne({email})

        if (!user){
            return res.status(404).json({
                error:'user not found'
            })
        }

        if (!user.isVerified){
            return res.status(404).json({
                error:'user is not verified'
            })
        }

        const confirm=await bcrypt.compare(password, user.password)


        if (!confirm){
            return res.status(400).json({
                error:"incorrect password"
            })
        }

        const token =jwtToken.sign({userId:user._id, role:user.role}, process.env.JWT_SECRET, {expiresIn:'1d'})
        res.status(200).json({
            token,
        })
    } catch(err){
        res.status(500).json({error:err.message})
    }
}

const verifyEmail=async (req, res)=>{
    const {token}=req.params

    if (!token){
        return res.status(404).json({
            error:'token not found'
        })
    }

    try{
        const decoded=jwtToken.verify(token, process.env.JWT_SECRET)
        const id=decoded.userId
        await UserModel.findByIdAndUpdate(id, {isVerified:true})
        res.status(200).json({
            message:"Email verified successfully"
        }) 
        


    }catch(error){
        console.log(error.message)
        res.status(400).json({
            error:"Invalid token or token is expired"
        })
    }
}

module.exports={register, login, verifyEmail}