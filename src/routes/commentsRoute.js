const express=require('express')
const { createComment, deleteComment }=require("../controllers/commentsControllers")
const { protectedRoute } = require('../middlewares/authmiddleware')
const router=express.Router()

router.post('/:blogId', protectedRoute, createComment)
router.delete('/:commentId', protectedRoute, deleteComment)

module.exports =router