const express = require('express');

const {registerValidation, loginValidation, postCreateValidation} = require('./validations.js');
const {checkToken} = require('./utils/checkAuth.js');
const {handleValidErr} = require('./utils/handleValidationErros.js');

const { login, getMe, register} = require('./controllers/UserController.js');
const {createPost, getUserWithPost,getPostByID, removePost, update} = require('./controllers/PostController.js');
const {saveImage, upload} = require('./utils/saveImages.js');

const PORT = process.env.PORT || 8080 ;

const app = express();

app.use(express.json());


app.get('/', (req, res)=>{
    res.send("hello world");
})


app.post('/auth/register', registerValidation, handleValidErr, register);
app.post('/auth/login', loginValidation, handleValidErr , login);
app.get('/auth/me',checkToken, getMe);

app.post('/upload', checkToken,upload.single('image'), saveImage);

app.use('/uploads', express.static('uploads'));

app.post('/posts', checkToken, postCreateValidation , handleValidErr, createPost);
app.get('/posts', getUserWithPost);
app.get('/posts/:id', checkToken, getPostByID);
app.delete('/posts/:id', checkToken, removePost);
app.patch('/posts/:id', checkToken, postCreateValidation, handleValidErr, update);


app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}...`);
})