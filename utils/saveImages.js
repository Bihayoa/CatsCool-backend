const multer = require('multer');
const path = require('path')
const {randomUUID} = require('crypto');

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
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.webp' ){
            return cb(new Error('Только изображения с разрешением .png, .jpg, .jpeg, .webp допустимы'), false)
        }
        cb(null, true)
    },
    limits:{fileSize: 8 * 1024 * 1024}


});

const saveImage = (req, res) => {
    try{
        console.log(req.files);
    }catch(err){
        res.status(500).send("Ошибка загрузки фоток")
    }
}



module.exports = {upload, saveImage}