const pool = require('../config/database');

exports.getUsers = async () => {
  const [users] = await pool.query('SELECT * FROM users');
  return users;
};

exports.getUserById = async (userId) => {
  const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
  if (user.length === 0) {
    throw new Error('User not found');
  }
  return user[0];
};
