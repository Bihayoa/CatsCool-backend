const {messageSend, dialogCreate, getAllChats} = require('../database/dbMsgAct')

const sendMessage = async(req,res) => {
    try{
        const message = {
            chat_id: req.body.chat_id,
            content: req.body.content,
            imageUrls: req.files.map(file => file.path),
            sender_id: req.userId,
        }

        const messageResponse = await messageSend(message.content, message.imageUrls, message.chat_id, message.sender_id);
        res.json(messageResponse);
    }catch(err){
        console.log("Error AT SENDING MESSAGE: ", err);
    }
}

const createDialog = async(req, res) => {
    try{
        const dialogData = {
            title: req.body.chat_name,
            members: req.body.members,
        }

        const response = await dialogCreate(dialogData.members, dialogData.title);
        res.json(response);
    }catch(err){
        console.log("Create dialog error at msg controller", err);
    }
}


const getChats = async(req, res) => {
    try{
        const data = {
            user_id: req.userId,
        }

        const response = await getAllChats(data.user_id);
        res.json(response);
    }catch(err){
        console.log("Ошибка во время получения чатов: ", err)
    }
}


module.exports = { sendMessage, createDialog, getChats };