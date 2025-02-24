const multer = require('multer');

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    }
})

const upload = multer({ storage });

const saveImage = (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
}



module.exports = {upload, saveImage}