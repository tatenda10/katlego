const pool = require('../config/database');

exports.getUsers = async (req, res) => {
  try {
    const [users] = await pool.query('SELECT * FROM users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
