const {createTransport}= require("nodemailer")
require("dotenv").config()

const transportDetails={
    host:"smtp.resend.com",
    port:587,
    secure:false,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    },

}

const transporter=createTransport(transportDetails)

const sendVerificationEmail= async (email, token)=>{
    const url=`http://localhost:${process.env.PORT}/api/auth/verify-email/${token}`

    const mailOptions={
        from:"BlogsApi onboarding@resend.dev",
        to:email,
        subject:"Verify your email",
        text:"click the link below",
        html:`<p>Click here <a href="${url}">to verify your email</a></p>`,

    }

    try{
        await transporter.sendMail(mailOptions)
        console.log("Verification link is sent")
    }catch(error){
        console.log(error)
    }
}

module.exports={sendVerificationEmail}