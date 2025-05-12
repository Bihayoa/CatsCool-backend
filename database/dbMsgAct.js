const {pool} = require('../db');

const messageSend = async(content, image_urls, chat_id, sender_id) => {
    try{
        const res = await pool.query('INSERT INTO message(content, image_urls, chat_id, sender_id) VALUES($1, $2, $3, $4)', [content, image_urls, chat_id, sender_id]);
        if (!res){
            return res.status(400).json({msg:"Аватарка не загрузилась"});
        }
        return res.rows[0];
    }catch(err){
        console.log("ERROR AT SENDING MESSAGE:  ", err);
    }
}

const dialogCreate = async(members, title) => {
    try{
        const res = await pool.query('INSERT INTO chat(members, chat_name) VALUES($1, $2) RETURNING chat_id', [members, title]);
        const newChatID = res.rows[0].chat_id;
        const update = await pool.query('UPDATE account SET chat = array_append(chat, $1) WHERE id IN (SELECT unnest($2::int[]))', [newChatID, members]);
        if(!res){
            return res.status(400).json({msg: "Создать чат не удалось"});
        }
        return res.rows[0];
    }catch(err){
        console.log("Ошибка во время попытки создать чат: ", err);
    }
}

const getAllChats = async(user_id) => {
    try{
        const chats_id = await pool.query('SELECT chat FROM account WHERE id = $1', [user_id]);
        const res = await pool.query('SELECT * FROM chat WHERE chat_id in (SELECT unnest($1::int[]))', [chats_id.rows[0].chat]);
        if(!res){
            return res.status(400).json({msg: "Ошибка во время получения чатов"});
        }
        return res.rows;
    }catch(err){
        console.log("ERROR AT GETTING ALL CHATS 0w0: ", err);
    }
}



module.exports = {messageSend, dialogCreate, getAllChats};