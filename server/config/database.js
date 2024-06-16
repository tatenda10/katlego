// config/database.js
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'aperwobb',
  password: 'cAT3NcLE39Ol',
  database: 'aperwobb_meal_planning',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool.promise();
