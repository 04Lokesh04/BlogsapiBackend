const express=require('express')

const {register, login, verifyEmail}=require('../controllers/authControllers')

const router=express.Router()

router.post('/register', register)
router.post('/login', login)
router.get("/verify-email/:token", verifyEmail)

module.exports=router