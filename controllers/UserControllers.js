import {validationResult} from "express-validator";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        //Проверяем поля пользователя на валидацию
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json(errors.array())
        }
        //Достаем пароль и хешируем его для хранения в БД
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        // Создаем новый документ на основе введенных данных
        const doc = new UserModel({
            email: req.body.email,
            passwordHash: hash,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl
        })
        // Сохраняем пользователя в БД
        const user = await doc.save()

        // создаем токен для отправки пользователю
        const token = jwt.sign({
                _id: user._id
            },
            'Panda99928383',
            {
                expiresIn: '30d'
            }
        )

        const {passwordHash, ...userData} = user._doc;
        res.json({
            ...userData,
            token
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Не удалось зарегистрироваться',
        })
    }
}

export const login = async (req, res) => {
    try {
        //Поиск пользователя в базе данных
        const user = await UserModel.findOne({
            email: req.body.email
        })
        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }
        //Проверка пароля в базе данных
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)
        if (!isValidPass) {
            return res.status(400).json({
                message: 'Неверный логин или пароль'
            })
        }
        //Если есть пользователь и пароль совпадает, то создаем токен
        const token = jwt.sign({
                _id: user._id
            },
            'Panda99928383',
            {
                expiresIn: '30d'
            }
        )
        // Отправляем пользователю токен и данные
        const {passwordHash, ...userData} = user._doc;
        res.json({
            ...userData,
            token
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Не удалось авторизоваться',
        })
    }
}

export const authMe = async (req, res) => {
    try {
        //Находим пользователя по id
        const user = await UserModel.findById(req.userId)
        if (!user){
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }
        const {passwordHash, ...userData} = user._doc;
        res.json({userData})
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Не удалось авторизоваться',
        })
    }
}