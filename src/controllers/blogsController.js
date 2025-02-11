const BlogModel=require("../models/BlogModel")
const CommentModel = require("../models/CommentModel")
const UserModel = require("../models/UserModel")

const createBlog=async (req, res)=>{
    const {title, content}=req.body 
    try{
        const blog= new BlogModel({
            title,
            content,
            author:req.user.userId
        })
        await blog.save()

        res.status(200).json({
            status:"success",
            message:"Blog created successfully"
        })

    }catch(err){
        console.log(err)
        res.status(500).json({
            error:err.message
        })
    }
}

const getAllBlogs=async (req, res)=>{
    try{
        const blogs= await BlogModel.find()
        res.status(200).json({
            blogs
        })
    }catch(err){
        res.status(500).json({
            error:err.message
        })
    }
}

const getBlogById=async (req, res)=>{
    const {blogId}=req.params 
    try{
        const blogs= await BlogModel.findById(blogId)
        if (!blogs){
            return res.status(404).json({
                message:"Blog not found"
            })
        }
        const comments= await CommentModel.find({blog:blogId}).populate('author', "name")

        res.status(200).json({blogs, comments})
    }catch(err){
        res.status(500).json({error:err.message})
    }

}

const updateBlog=async (req, res)=> {
    const {blogId}=req.params
    const {title, content}=req.body

    try{
        
        const blog= await BlogModel.findById(blogId)

        if (!blog){
            return res.status(404).json({
                message:"Blog not found"
            })
        }

        if (req.user.role==="Editor"){
            if (!blog.assigned || blog.assigned.toString() !== req.user.userId.toString()){
                return res.status(400).json({
                    message:"You are not the Editor for this blog"
                })
            }
        }

        

        blog.title= title || blog.title
        blog.content=content|| blog.content

        await blog.save()
        res.status(200).json({status:"success", message:"update the blog"})

    }catch(err){
        res.status(500).json({error:err.message})
    }
}

const deleteBlog=async (req, res)=>{
    const {blogId}=req.params 
    try{
        const blog= await BlogModel.findByIdAndDelete(blogId)

        if(!blog){
            return res.status(404).json({message:"Blog not found"})
        }
        res.status(200).json({status:"success", message:"Blog Deleted successfully", blog})
    }catch(err){
        res.status(500).json({error:err.message})
    }
}

const assignBlogs=async (req, res)=>{
    const {id}=req.params
    const {email}=req.body 

    try{
        if (req.user.role !=="Admin"){
            return res.status(400).json({
                message:"Admin only can assign editors"
            })
        }
        const blog= await BlogModel.findById(id)
        const user=await UserModel.findOne({email})
        if(!blog){
            return res.status(404).json({message:"Blog not found"})
        }
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        const allblogs= await BlogModel.find()

        let isassginedbefore=false

        for (const each of allblogs){

            if (each.assigned && each.assigned.toString()===user._id.toString()){
                isassginedbefore=true
                break
            }
            
        }

        if (isassginedbefore){
            return res.status(400).json({message:"this user is already an editor"})
        }

        blog.assigned=user._id
        user.role="Editor"
        await user.save()
        await blog.save()
        res.status(200).json({status:"success", message:"Assigned editor successfully"})
    }catch(err){
        res.status(500).json({
            error:err.message
        })
    }
}

module.exports={createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog, assignBlogs}