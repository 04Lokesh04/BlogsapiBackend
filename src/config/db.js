const mongoose= require('mongoose')
const connectDb= async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Mongoose is connected")
    }catch(err){
        console.log(err.message)
        process.exit(1)
    }
}

module.exports=connectDb
