const express=require('express')

const router=express.Router()

const {createBlog, getAllBlogs, getBlogById, updateBlog,deleteBlog, assignBlogs}=require("../controllers/blogsController")
const { protectedRoute, restrictAccess } = require('../middlewares/authmiddleware')

router.post('/', protectedRoute, createBlog)
router.get('/', protectedRoute, getAllBlogs)
router.get('/:blogId', protectedRoute, getBlogById)
router.patch('/:blogId', protectedRoute, restrictAccess, updateBlog)
router.delete('/:blogId', protectedRoute, deleteBlog)
router.patch('/assign/:id', protectedRoute, assignBlogs)

module.exports=router