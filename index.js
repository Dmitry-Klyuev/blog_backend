import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import {loginValidation, postCreateValidation, registerValidation} from "./validations/validations.js";

import multer from "multer";
import {handleValidationsError, checkAuth} from './utils/index.js'
import {authMe, deletePost, getAllPosts, getOne, login, postCreate, updatePost, register} from "./controllers/index.js";

dotenv.config()
const app = express()
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './upload')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname + '-' + Date.now()  + '.jpg')
    }
})

const upload = multer({ storage })
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('db ok')
    })
    .catch((err) => {
        console.log('db error'.err)
    })

app.use(express.json())
app.use('/upload/', express.static('upload'))

app.post('/auth/login', loginValidation, handleValidationsError, login)
app.post('/auth/register', registerValidation, handleValidationsError, register)
app.get('/auth/me', checkAuth, authMe)
app.post('/upload', checkAuth, handleValidationsError, upload.single('image'), (req, res) => {
    res.json({
        url: `/upload/${req.file.filename}`
    })
})
app.get('/post', getAllPosts)
app.get('/post/:id', getOne)
app.post('/post', checkAuth, postCreateValidation,  postCreate)
app.delete('/post/:id',checkAuth, deletePost)
app.patch('/post/:id', checkAuth, handleValidationsError, updatePost)

app.listen(4444, (e) => {
    if (e) return console.log(e)
    console.log('Server ok')
})