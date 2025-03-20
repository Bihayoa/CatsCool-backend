const {body} = require('express-validator');

const registerValidation = [
    body('name', 'Укажите имя, минимум 3 символа').isLength({min:3}),
    body('login', 'укажите логин минимум 3 символа').isLength({min: 3}),
    body('password', 'укажите пароль минимум 5 символов').isLength({min: 5}),
    body('email','Неверный формат почты').isEmail(),
    body('avatarURL', 'Неправильная ссылка на аватарку').optional().isURL(),
    
];

const loginValidation = [
    body('password', 'укажите пароль минимум 5 символов').isLength({min: 5}),
    body('email','Неверный формат почты').isEmail(),
];

const postCreateValidation = [
    body('title', 'Введи заголовок статьи').isLength({min: 3}).isString(),
    body('text', 'Введи текст статьи').optional().isString(),
    body('tags', 'Неверный формат тегов (нужен массив)').optional().isString(),
    // body('imageURL', 'Неверная ссылка на изображение').optional().isString(),

]


module.exports = {registerValidation, loginValidation, postCreateValidation};