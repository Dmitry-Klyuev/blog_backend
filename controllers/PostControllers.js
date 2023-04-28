import PostModel from '../models/Post.js'

export const postCreate = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        })
        const post = await doc.save()
        res.json(post)
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Не удалось создать статью',
        })
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const allPost = await PostModel.find().populate('user').exec()
        res.json(allPost)
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Не удалось прочитать статьи',
        })
    }
}
export const getOne = async (req, res) => {
    try {
        const postId = await req.params.id
        PostModel.findByIdAndUpdate({
                _id: postId
            },
            {
                $inc: {viewCount: 1}
            },
            {
                new: true
            }
        )
            .then(doc => {
                if (!doc){
                    return res.status(404).json({
                        message: 'Статья не найдена'
                    })
                }
                return res.json(doc)
            })
            .catch(e=>{
                console.log(e)
                res.status(500).json({
                    message: 'Не удалось прочитать статью',
                })
            })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Ошибка сервера',
        })
    }
}
export const deletePost = async (req, res) => {
    try{
        const postId = req.params.id
        PostModel.findByIdAndDelete(
            {_id: postId})
            .then((data) => {
                if (!data){
                    return res.status(404).json({
                        message: 'Статья не найдена'
                    })
                }
                res.status(200).json({
                    message: 'Статья удалена'
                })
            })
            .catch(e=>{
                console.log(e)
                res.status(500).json({
                    message: 'Не удалось удалить статью',
                })
            })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Не удалось удалить статью',
        })
    }
}
export const updatePost = async (req, res) => {

}