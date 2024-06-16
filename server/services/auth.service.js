const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

exports.register = async ({ username, password, email }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await pool.query('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, hashedPassword, email]);
  return { message: 'User registered successfully', userId: result.insertId };
};

exports.login = async ({ email, password }) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  if (rows.length === 0) {
    throw new Error('User not found');
  }

  const user = rows[0];
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
  return { token, userId: user.id };
};

