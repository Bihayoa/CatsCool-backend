const {pool} = require('../db');

const userAdd = async (name, login, pass_hash, email, avatar_url) => {
  const query = 'INSERT INTO account (name, login, pass_hash, email, avatar_url) VALUES ($1, $2, $3, $4, $5)';
  try {
    await pool.query(query, [name, login, pass_hash, email, avatar_url]);  
    console.log(`Пользователь ${login} добавлен в таблицу`);
  } catch (err) {
    console.error('Ошибка при добавлении пользователя', err);
  }
};

const userDeleteByID = async(id) => {
  const query = 'DELETE FROM account WHERE id = ?';
  try {
    await pool.query(query, [id]);
    console.log(`user with ID : ${id} was deleted `);
  } catch (err) {
    console.log('Ошибка при попытке удаления юзера', err);
  }
}

async function getUserIdByLogin(login) {
  try {
      const res = await pool.query('SELECT id FROM account WHERE login = $1', [login]);
      return res.rows[0].id;
  } catch (err) {
      console.error('Ошибка выполнения запроса', err);
  }
}

async function findUserByEmail(email){
  try{
    const res = await pool.query('SELECT * FROM account WHERE email = $1', [email]);
  return res.rows[0];
  }   catch(err){
    console.error('Ошибка выполнения запроса', err);
  }
}

async function getUserById(id){
  try{
    const res = await pool.query('SELECT * FROM account WHERE id = $1', [id]);
  return res.rows[0];
  }   catch(err){
    console.error('Ошибка выполнения запроса', err);
  }
}

async function getUserByIdUNIQUE(req, res){
  try{
    const userID = await pool.query('SELECT * FROM account WHERE id = $1', [req.params.id]);
    if (!userID){
      return res.status(404).json({msg:"User not found"});
  }
  const {pass_hash, ...userData} = userID.rows[0];
  res.json(userData);  
  }   catch(err){
    console.error('Ошибка выполнения запроса', err);
  }
}

async function findUserByLogin(login){
  try{
    const res = await pool.query('SELECT * FROM account WHERE login = $1', [login]);
    if (!res){
      return res.status(404).json({msg:"User not found"});
  }
  return res.rows[0];
  }   catch(err){
    console.error('Ошибка выполнения запроса', err);
  }
}

async function changeAvatar(userID, image_url){
  try{
    const res = await pool.query('UPDATE account SET avatar_url = $1 WHERE id = $2', [image_url, userID])
    if (!res){
      return res.status(404).json({msg:"Аватарка не загрузилась"});
  }
    return res.rows[0];

  }catch(err){
    console.error('Ошибка выполнения запроса на обновление аватара', err);

  }
}


async function updateDescription(userID, description){
  try{
    const res = await pool.query('UPDATE account SET description = $1 WHERE id = $2', [description, userID]);
    return res.rows[0];
  }catch(err){
    console.error("Ошибка ВО ВРЕМЯ Обновления описания аккаунта: ", err);
  }
}

module.exports = {userAdd, userDeleteByID, getUserIdByLogin, findUserByEmail, findUserByLogin, getUserById, getUserByIdUNIQUE, changeAvatar, updateDescription};