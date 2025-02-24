const {addPost, findAllUserPosts, showAllPosts, getPostWithUser, getPostById, deletePostById, updatePost} = require('../database/dbPostAct');

const createPost = async (req,res) => {
    try{
        const post = {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        };
        await addPost(post.title, post.text, post.imageUrl, post.tags, post.user);
        
        res.json(post);

    }catch (err){
        console.log(err);
        res.status(500).json({message: "Ошибка при создании поста"});
    }
}

const getAllYourPosts = async (req, res) => {
    try{
        const posts = await findAllUserPosts(req.userId);
        res.json(posts);
    }catch (err){
        console.log(err);
        res.status(500).json({message: "Ошибка при получении постов юзера"});
    }
}

const getAllPosts = async(req, res) => {
    try{
        const posts = await showAllPosts();
        res.json(posts)
    }catch (err){
        console.log(err);
        res.status(500).json({message: "Ошибка при получении всех постов"});
    }
}

const getUserWithPost = async(req,res) => {
    try{
        const posts = await getPostWithUser();
        res.json(posts);
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Ошибка при получении всех постов"});
    }
}

const getPostByID = async(req, res) => {
    try{
        const post = await getPostById(req.params.id);

        if (!post){
            return res.status(404).json({msg:"Post not found"});
        }
        res.json(post);

    }catch(err){
        console.log(err);
        res.status(500).json({message: "Ошибка при получении поста по айди"});
    }
}

const removePost = async(req,res) =>{ 
    try{
        await deletePostById(req.params.id);
        res.json({msg:"post was deleted"});
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Ошибка при удалении поста"});
    }
}

const update = async(req,res) =>{ 
    try{
        const postId = (req.params.id);
        const post = {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
        };
        await updatePost(post.title,post.text,post.imageUrl,post.tags, postId);
        res.json({msg:"post was updated"});
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Ошибка при обновлении поста"});
    }
}



module.exports = {createPost, getAllYourPosts, getAllPosts, getUserWithPost,getPostByID, removePost, update};