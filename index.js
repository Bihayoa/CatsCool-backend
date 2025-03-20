const express = require('express');
const cors = require('cors');

const {registerValidation, loginValidation, postCreateValidation} = require('./validations.js');
const {checkToken} = require('./utils/checkAuth.js');
const {handleValidErr} = require('./utils/handleValidationErros.js');

const { login, getMe, register} = require('./controllers/UserController.js');
const {createPost, removePost, update, getPostByIDWithUserLoginAndAvatarURL, getFeedPosts, putLike} = require('./controllers/PostController.js');
const {saveImage, upload} = require('./utils/saveImages.js');
const {hostname, port} = require('./config/server.config.js');
const { getUserByIdUNIQUE } = require('./database/dbAccAct.js');

const app = express();

app.use(express.json());
app.use(cors());


app.get('/', (req, res)=>{
    res.send("hello world");
})

//auth
app.post('/auth/register', registerValidation, handleValidErr, register);
app.post('/auth/login', loginValidation, handleValidErr , login);
app.get('/auth/me',checkToken, getMe);

//unique
app.get('/user/:id', getUserByIdUNIQUE);



app.post('/upload/images', checkToken, upload.array('images', 5), saveImage);
app.use('/uploads', express.static('uploads'));

//posts
app.post('/posts', checkToken, upload.array('images', 5), postCreateValidation, handleValidErr, createPost);
// app.get('/posts', getUserWithPost);
app.delete('/posts/:id', checkToken, removePost);
app.patch('/posts/:id', checkToken, postCreateValidation, handleValidErr, update);
app.post('/posts/putlike/:id', checkToken, putLike);

//Something like feed   
app.get('/api/posts', getFeedPosts)
app.get('/posts/:id', getPostByIDWithUserLoginAndAvatarURL);

app.listen(port, () => {
    console.log(`Server listening on port: ${hostname}:${port}...`);
})