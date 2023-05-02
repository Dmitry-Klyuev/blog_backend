import {validationResult} from "express-validator";

export default (req, res, next) => {
    //Проверяем поля пользователя на валидацию
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json(errors.array())
    }
    next()
}