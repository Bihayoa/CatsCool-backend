const {pool} = require('../db');

const addPost = async (title, text, imageUrls, tags, user) => {
    const query = 'INSERT INTO post (title, text, image_urls, tags, user_id) VALUES ($1, $2, $3, $4, $5);';
    try {
        await pool.query(query, [title, text, imageUrls, tags, user]);  
      } catch (err) {
        console.error('Ошибка при добавлении поста в бд', err);
      }

}

const findAllUserPosts = async (userId) => {
  try{
    const res = await pool.query('SELECT * FROM post WHERE user_id = $1', [userId]);
    return res
  } catch(err){
      console.error(`Ошибка выполнения запроса при попытке найти все посты юзера с айди: ${userId}`, err);
  }
}

const showAllPosts = async () => {
  const query = 'SELECT * FROM post';
  try {
    return (await pool.query(query)).rows;
  } catch (err) {
    console.log("Ошибка при попытке вывода постов: ", err);
  }

};

const getPostWithUser = async() => {
  try{
    const query = `
      SELECT p.*, a.*
      FROM post p
      JOIN account a ON p."user_id" = a.id;
    `;
    return (await pool.query(query)).rows;
  }catch(err){
    console.log("Ошибка при попытке вывода юзера и пост: ", err);
  }
}

const getPostById = async (post_id) => {
  try{
    await pool.query('UPDATE post SET views = views + 1 WHERE post_id = $1', [post_id]);
    const res = await pool.query('SELECT * FROM post WHERE post_id = $1', [post_id]);
    return res.rows[0];
  } catch(err) {
    console.error('Ошибка выполнения запроса', err);
  }
}

const deletePostById = async(post_id) => {
  try{
      await pool.query('DELETE FROM post WHERE post_id = $1', [post_id]);
        //console.log(`user with ID : ${id} was deleted `);
      } catch (err) {
        console.log('Ошибка при попытке удаления поста', err);
      }
    }

const updatePost = async(title, text, imageURL, tags, id) => {
  try{
    const query = `
      UPDATE post
      SET title = $1, text = $2, image_url = $3, tags = $4
      WHERE post_id = $5
    `;

    const values = [title, text, imageURL, tags, id];
    await pool.query(query, values);
  } catch(err){
    console.log('Ошибка при попытке обновления поста', err);
  }
}





module.exports = {addPost, findAllUserPosts,showAllPosts, getPostWithUser, getPostById, deletePostById, updatePost};