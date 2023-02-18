import express from 'express'

import { getPosts, addPost } from '../controller/posts.js' 



const router = express.Router()

router.get('/get',getPosts)
router.post('/post',addPost)


export default router