const CommentModel=require('../models/CommentModel')

const createComment=async (req, res)=>{
    const {content}=req.body 
    const {blogId}=req.params 

    try{
        const commnet=new CommentModel({
            content,
            blog:blogId,
            author:req.user.userId
        })
        await commnet.save()

        res.status(200).json({
            status:"success",
            message:"comment created successfully"
        })
    }catch (err){
        res.status(500).json({
            error:err.message
        })
    }
}

const deleteComment=async(req, res)=>{
    const {commentId}=req.params
    const userId=req.user.userId

    try{
        const comment= await CommentModel.findById(commentId)

        if (!comment){
            return res.status(404).json({message:"comment not found"})

        }

        if (comment.author.toString()!==userId){
            return res.status(403).json({message:"unauthorized to do this action"})
        }

        const deletedcommnet=await CommentModel.findByIdAndDelete(commentId)

        res.status(200).json({
            status:"success",
            message:"comment deleted successfully",
            deletedcommnet,
        })
    }catch(err){
        res.status(500).json({error:err.message})
    }
}

module.exports={createComment, deleteComment}