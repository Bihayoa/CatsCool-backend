const {pool} = require('../db');

const sendMessage = async(senderId, receiveId, content) => {
    try{
        const res = await pool.query('INSERT INTO message(sender_id, receiver_id, content) VALUES($1, $3, $3)', [senderId, receiveId, content])
        return res.rows[0];
    }catch(err){
        console.log("ERROR AT SENDING MESSAGE:  ", err)
    }
}


module.exports = {sendMessage};