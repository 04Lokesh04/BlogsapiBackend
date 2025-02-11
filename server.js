const express= require("express")
const dotenv=require("dotenv")
const connectDb=require('./src/config/db')
const authRoutes=require('../blogsapi/src/routes/authRoutes')
const blogsRoute=require('../blogsapi/src/routes/blogsRoute')
const commentsRoute=require('../blogsapi/src/routes/commentsRoute')

dotenv.config()
const app= express()

app.use(express.json())

connectDb()

const PORT=process.env.PORT || 3000

app.use('/api/auth', authRoutes)
app.use('/api/blogs', blogsRoute)
app.use('/api/comment',commentsRoute)


app.listen(PORT, ()=>{
    console.log(`server is running at ${PORT}`)
})

