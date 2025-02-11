const mongoose=require("mongoose")

const blogsRule={
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true,
    },
    author:{
        type:mongoose.Schema.Types.ObjectId, ref:"UserModel",
        required:true,
    },
    assigned:{
        type: mongoose.Schema.Types.ObjectId, ref:"UserModel",
        default:null,
    }
}

const blogsSchema=new mongoose.Schema(blogsRule)

const BlogModel=mongoose.model("BlogModel", blogsSchema)

module.exports=BlogModel