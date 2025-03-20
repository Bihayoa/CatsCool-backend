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

const getPostByIdAndUserLoginWithAvatarURL = async (post_id) => {
  try{
    await pool.query('UPDATE post SET views = views + 1 WHERE post_id = $1', [post_id])
    const res = await pool.query(`SELECT p.*, a.login, a.avatar_url FROM post p JOIN account a ON p.user_id = a.id WHERE p.post_id = $1;`, [post_id])
    return res.rows[0];
  }catch(err){
    console.error('error во время получение ГПИАЭЮВАЮ: ', err);
  } 
}

const getPost = async(post_id, userId) => {
  const query = await pool.query('SELECT user_liked FROM post WHERE post_id = $1', [post_id]);
  if (query.rows[0] && query.rows[0] !== undefined) {
      const post = query.rows[0].user_liked;
      if (post !== null && post !== undefined) {
          if (post.includes(`${userId}`)) {
              await pool.query('UPDATE post SET user_liked = array_remove(user_liked, $1) WHERE post_id = $2', [userId, post_id]);
              return { likeCount: post.length - 1, liked: false }; 
          } else {
              await pool.query('UPDATE post SET user_liked = array_append(user_liked, $1) WHERE post_id = $2', [userId, post_id]);
          }
          return { likeCount: post.length + 1, liked: true }; 
      } else {
          await pool.query('UPDATE post SET user_liked = array_append(user_liked, $1) WHERE post_id = $2', [userId, post_id]);
          return { likeCount: 1, liked: true }; 
      }
  } else {
      return { likeCount: 0, liked: false }; // Возвращаем, если пост не найден
  }
};

const deletePostById = async(post_id) => {
  try{
      await pool.query('DELETE FROM post WHERE post_id = $1', [post_id]);
        //console.log(`post with ID : ${id} was deleted `);
      } catch (err) {
        console.log('Ошибка при попытке удаления поста', err);
      }
    }

const updatePost = async(title, text, imageURL, tags, id) => {
  try{
    const query = `UPDATE post SET title = $1, text = $2, image_url = $3, tags = $4 WHERE post_id = $5`;

    const values = [title, text, imageURL, tags, id];
    await pool.query(query, values);
  } catch(err){
    console.log('Ошибка при попытке обновления поста', err);
  }
}


const feedPosts = async (offset, limit) => {
  try {
    await pool.query('UPDATE post SET views = views + 1 WHERE post_id IN (SELECT post_id FROM post ORDER BY post_id DESC LIMIT $1 OFFSET $2)', [limit, offset]);

    const res = await pool.query(`SELECT p.*, a.login, a.avatar_url FROM post p JOIN account a ON p.user_id = a.id ORDER BY p.post_id DESC LIMIT $1 OFFSET $2`, [limit, offset ]);
    return res.rows;
  } catch (err) {
    console.error("error fetching feedPosts", err);
  }
};



module.exports = {addPost, getPost, findAllUserPosts,showAllPosts, getPostWithUser, getPostById, deletePostById, updatePost, feedPosts, getPostByIdAndUserLoginWithAvatarURL};