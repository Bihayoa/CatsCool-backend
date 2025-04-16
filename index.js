//imports
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io')


const {registerValidation, loginValidation, postCreateValidation} = require('./validations.js');
const {checkToken} = require('./utils/checkAuth.js');
const {handleValidErr} = require('./utils/handleValidationErros.js');

const { login, getMe, register, getUserByLog} = require('./controllers/UserController.js');
const {createPost, removePost, update, getPostByIDWithUserLoginAndAvatarURL, getFeedPosts, putLike, getPostsByID} = require('./controllers/PostController.js');
const {saveImageForAvatar, upload} = require('./utils/saveImages.js');
const {hostname, port, io_port} = require('./config/server.config.js');
const { getUserByIdUNIQUE } = require('./database/dbAccAct.js');

//Code
const app = express();
app.use(express.json());
app.use(cors());


const server = http.createServer(app);

//WEB SOCKET -------------------------------------------
const io = new Server(server, {
    cors: {
        origin: `http://localhost:5050`,
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    // console.log(`User Connected ${socket.id}`);

    socket.on('join_room', (data) => {
        socket.join(data)
        // console.log(`User with ID: ${socket.id} joined room: ${data }`)
    })

    socket.on("disconnect", () => {
        // console.log("User Disconnected", socket.id);
    });                                     
    
    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data)
    });
});
    
//----------------------------------------------------------

app.get('/', (req, res)=>{
    res.send("hello world");
})

//auth
app.post('/auth/register', registerValidation, handleValidErr, register);
app.post('/auth/login', loginValidation, handleValidErr , login);
app.get('/auth/me',checkToken, getMe);

//unique
app.get('/user/:id', getUserByIdUNIQUE);

//get user by login
app.get('/api/user/:login', getUserByLog);

app.post('/upload/images', checkToken, upload.array('images', 1), saveImageForAvatar);
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
app.get('/posts.by.id', getPostsByID);



app.listen(port, () => {
    console.log(`Server listening on port: ${hostname}:${port}...`);
})

server.listen(io_port, () => {
    console.log(`WebSoket running on port: ${io_port}`)
})