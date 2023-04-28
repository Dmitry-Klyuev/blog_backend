import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import {loginValidation, postCreateValidation, registerValidation} from "./validations/validations.js";
import checkAuth from "./utils/checkAuth.js";
import {authMe, login, register} from "./controllers/UserControllers.js";
import {deletePost, getAllPosts, getOne, postCreate, updatePost} from "./controllers/PostControllers.js";

dotenv.config()
const app = express()

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('db ok')
    })
    .catch((err) => {
        console.log('db error'.err)
    })

app.use(express.json())
app.post('/auth/login', loginValidation, login)
app.post('/auth/register', registerValidation, register)
app.get('/auth/me', checkAuth, authMe)

app.get('/post', getAllPosts)
app.get('/post/:id', getOne)
app.post('/post', checkAuth, postCreateValidation,  postCreate)
app.delete('/post/:id',checkAuth, deletePost)
app.patch('/post/:id', checkAuth, updatePost)

app.listen(4444, (e) => {
    if (e) return console.log(e)
    console.log('Server ok')
})