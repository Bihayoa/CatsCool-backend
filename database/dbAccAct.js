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

/*const showUsers = async () => {
    const query = 'SELECT * FROM account';
    try {
      console.log(await pool.query(query));
    } catch (err) {
      console.log("Ошибка при попытке вывода юзеров: ", err);
    }

};
*/

async function getUserIdByLogin(login) {
  try {
      const res = await pool.query('SELECT id FROM account WHERE login = $1', [login]);
      
      /*if (res.rows.length > 0) {
          console.log('ID пользователя:', res.rows[0].id);
      } else {
          console.log('Пользователь не найден');
      }
*/
      return res.rows[0].id;
  } catch (err) {
      console.error('Ошибка выполнения запроса', err);
  } /*finally {
      await client.end(); // Закрываем подключение
  } */
}

async function findUserByEmail(email){
  try{
    const res = await pool.query('SELECT * FROM account WHERE email = $1', [email]);
/*    if (res.rows.length > 0) {
      //console.log('email пользователя:', res.rows[0].email);
  } else {
      //console.log('Пользователь не найден');
  }
*/
  return res.rows[0];
  }   catch(err){
    console.error('Ошибка выполнения запроса', err);
  }
}

async function getUserById(id){
  try{
    const res = await pool.query('SELECT * FROM account WHERE id = $1', [id]);
/*    if (res.rows.length > 0) {
      //console.log('email пользователя:', res.rows[0].email);
  } else {
      //console.log('Пользователь не найден');
  }
*/
  return res.rows[0];
  }   catch(err){
    console.error('Ошибка выполнения запроса', err);
  }
}

async function findUserByLogin(login){
  try{
    const res = await pool.query('SELECT * FROM account WHERE login = $1', [login]);
    /*if (res.rows.length > 0) {
      console.log('login пользователя:', res.rows[0].login);
  } else {
      console.log('Пользователь не найден');
  }*/

  return res.rows[0];
  }   catch(err){
    console.error('Ошибка выполнения запроса', err);
  }
}

/*async function getLastUser(){
  try{
    const res = await pool.query('SELECT * FROM account ORDER BY id DESC LIMIT 1;');
    return res.rows[0];
  }catch(err){
    console.error('Ошибка выполнения запроса', err);
  }
}*/
module.exports = {userAdd, userDeleteByID, getUserIdByLogin, findUserByEmail, findUserByLogin, getUserById};