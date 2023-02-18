import express, { json } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import multer from 'multer'

import './db.js'

import userRoute from './routes/users.js'
import authRoute from './routes/auth.js'
import commentRoute from './routes/comments.js'
import likeRoute from './routes/likes.js'
import postRoute from './routes/posts.js'

const app = express()


app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Credentials", true)

    next()
})

app.use(json())
app.use(cors({
    origin:"http://localhost:3000"
}))
app.use(cookieParser())



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../frontend/public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })


  app.post('/uploads',upload.single("image"), (req,res)=>{
    res.status(200).send(req.file.filename)
  })

app.use('/',userRoute)
app.use('/auth',authRoute)
app.use('/comments',commentRoute)
app.use('/likes',likeRoute)
app.use('/posts',postRoute)




const port = 3300

app.listen(port,()=>{
    console.log(`App Listening at port ${port}`)
})


/*

POST: 

user/auth:
http://localhost:3300/auth/register
http://localhost:3300/auth/login
http://localhost:3300/auth/logout

posts:
http://localhost:3300/posts/post


GET:

posts:
http://localhost:3300/posts/get

comments:
http://localhost:3300/comments?postid=10

*/