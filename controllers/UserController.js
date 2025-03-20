const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const {userAdd, getUserIdByLogin, findUserByEmail, findUserByLogin, getUserById} = require('../database/dbAccAct');
const { tokenKey } = require('../config/server.config');

const register = async (req, res) => {
    try{
    //Хэшируем пароль
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const password_Hash = await bcrypt.hash(password, salt); 

    const user = {
        name: req.body.name,
        login: req.body.login,
        passwordHash: password_Hash,
        email: req.body.email,
        avatar_url: req.body.avatarURL,
    }

    if(await findUserByEmail(user.email) || await findUserByLogin(user.login)){
        return res.status(400).json({error: "Пользователь с таким логином/почтой уже существует"});
    }

    await userAdd(user.name, user.login, user.passwordHash, user.email, user.avatar_url);
    
    const id = await getUserIdByLogin(user.login);
    const token = jwt.sign(
        {
            _id: id
        },
        tokenKey,
        {
            expiresIn: "30d"
        });
        
        const {passwordHash, ...userData} = user;
        
        res.json({
            ...userData,
            token
        });



 } catch (err){
    console.log(err);
     res.json({message: "Something went wrong, try again later"});
}
};

const login = async (req, res) => {
    try{
        const user = await findUserByEmail(req.body.email);
        if (!user){
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user.pass_hash);

        if (!isValidPass) {
            return res.status(404).json({
                message: 'Неверный логин или пароль',
            }); 
        }

        const token = jwt.sign(
            {_id: user.id},
                tokenKey,
            {expiresIn: "30d"}
        );

            const {pass_hash, ...userData} = user;
            res.json({
                ...userData,
                token,
            });

    } catch (err){
        console.log(err);
        res.status(500).json({
            msg: 'Не удалось авторизоваться',
        });
    }
};

const getMe = async (req,res) => {
    try{
        const user = await getUserById(req.userId);

        if (!user){
            return res.status(404).json({
                message: "Пользователь не найден"
            });

        }
        const {pass_hash, ...userData} = user;
        res.json(userData);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: 'Нет доступа',
        });
    }
};







module.exports = {register, login, getMe};