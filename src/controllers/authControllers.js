const jwtToken=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const UserModel=require('../models/UserModel')

const register = async (req, res)=>{
    const {name, email, password, role}=req.body 

    if (!name || !email || !password || !role){
        return res.status(400).json({
            error: 'Provide all details'
        })
    }

    try{
        const user= new UserModel({name, email, password, role})
        await user.save()
        res.status(200).json({
            status:"success",
            message:"user created successfully"
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

module.exports={register, login}