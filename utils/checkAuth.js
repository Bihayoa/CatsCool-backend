const jwt = require('jsonwebtoken');

const checkToken = (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');  //Токен отправляется вместе с надписью Bearer и мы её здесь убираем
    if (token){
        try{
            const decoded = jwt.verify(token, 'VeRySeCrEt');

            req.userId = decoded._id;
            
            next();
        }catch(err){
            res.status(403).json({
                message: "You haven't the access"
            })
        }
    } else {
        res.status(403).json({message: "Доступа нет "});
    }
}











module.exports = {checkToken};