const multer = require('multer');
const path = require('path')
const {randomUUID} = require('crypto');
const { changeAvatar } = require('../database/dbAccAct');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, randomUUID().toString() + Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.webp' && ext !== '.gif' ){
            return cb(new Error('Только изображения с разрешением .png, .jpg, .jpeg, .webp допустимы'), false)
        }
        cb(null, true)
    },
    limits:{fileSize: 8 * 1024 * 1024}


});

const saveImageForAvatar = async (req, res) => {
    try{
        // console.log(req.file.path, req.userId);
        const image_url = req.files[0].path;
        await changeAvatar(req.userId, image_url);
        res.json({msg: "Avatar was loaded", avatar_url : image_url})
    }catch(err){
        res.status(500).send("Ошибка загрузки фоток")
    }
}



module.exports = {upload, saveImageForAvatar}