//SYSTEM IMPORTS
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io')

//SERVER IMPORTS

const {registerValidation, loginValidation, postCreateValidation, messageValidation, descriptionValidation} = require('./validations.js');
const {checkToken} = require('./utils/checkAuth.js');
const {handleValidErr} = require('./utils/handleValidationErros.js');

const { login, getMe, register, getUserByLog, changeDescription} = require('./controllers/UserController.js');
const {createPost, removePost, update, getPostByIDWithUserLoginAndAvatarURL, getFeedPosts, putLike, getPostsByID} = require('./controllers/PostController.js');
const {saveImageForAvatar, upload} = require('./utils/saveImages.js');
const {hostname, port, io_port} = require('./config/server.config.js');
const { getUserByIdUNIQUE } = require('./database/dbAccAct.js');

const {sendMessage, createDialog, getChats} = require('./controllers/MessageController.js')

//SETTING
const app = express();
app.use(express.json());                                //FOR JSON READ
app.use(cors());                                        //FOR CONNECT FRONTEND WITH BACKEND
app.use('/uploads', express.static('uploads'));         //FOR UPLOADS USE



//------ WEBSOKET -----
const server = http.createServer(app);




//----------------------

// app.get('/', (req, res)=>{
//     res.send("hello world");
// })


//-----------------API-----------------------------------

//auth
app.post('/auth/register', registerValidation, handleValidErr, register);
app.post('/auth/login', loginValidation, handleValidErr , login);
app.get('/auth/me',checkToken, getMe);

//unique
app.get('/user/:id', getUserByIdUNIQUE);


//get user by login
app.get('/api/user/:login', getUserByLog);


//SETTINGS REQUESTS
app.post('/upload/images', checkToken, upload.array('images', 1), saveImageForAvatar);
app.patch('/setting/description', checkToken, descriptionValidation, handleValidErr, changeDescription);


//POSTS
app.post('/posts', checkToken, upload.array('images', 5), postCreateValidation, handleValidErr, createPost);
app.delete('/posts/:id', checkToken, removePost);
app.patch('/posts/:id', checkToken, postCreateValidation, handleValidErr, update);
app.post('/posts/putlike/:id', checkToken, putLike);


//FOR FEED
app.get('/api/posts', getFeedPosts)
app.get('/posts/:id', getPostByIDWithUserLoginAndAvatarURL);
app.get('/posts.by.id', getPostsByID);


//MESSENGER
app.post('/chat', checkToken, createDialog);
app.get('/chat', checkToken, getChats)


app.post('/message',checkToken, upload.array('images', 5),  messageValidation, handleValidErr, sendMessage);















//SERVER LISTEN
app.listen(port, () => {
    console.log(`Server listening on port: ${hostname}:${port}...`);
})

// WEBSOKET LISTEN
server.listen(io_port, () => {
    console.log(`WebSoket running on port: ${io_port}`)
})