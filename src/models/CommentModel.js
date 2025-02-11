const mongoose=require('mongoose')

const commentsrule={
    content:{
        type:String,
        required:true
    },
    blog:{
        type:mongoose.Schema.Types.ObjectId, ref:"BlogsModel"
    },
    author:{
        type:mongoose.Schema.Types.ObjectId, ref:"UserModel"
    }
}

const commentSchema=new mongoose.Schema(commentsrule)

const CommentModel=mongoose.model("CommentModel", commentSchema)

module.exports=CommentModel