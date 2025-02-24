const {Pool} = require('pg');
const pool = new Pool({
    user: "postgres",
    password: 'lolkek',
    host: "localhost",
    port: 5432,
    database: "node_postgres"
});

pool.connect()
    .then(() => console.log('Connecting to db success!'))
    .catch((err)=> console.log('connect failed', err));


module.exports = {pool};