const pool = require('../config/database');

exports.createDelivery = async ({ userId, address, items }) => {
  const [result] = await pool.query('INSERT INTO deliveries (user_id, address) VALUES (?, ?)', [userId, address]);
  const deliveryId = result.insertId;

  for (const item of items) {
    await pool.query('INSERT INTO delivery_items (delivery_id, item_name, quantity) VALUES (?, ?, ?)', [deliveryId, item.name, item.quantity]);
  }

  return { message: 'Delivery created successfully', deliveryId };
};

exports.trackDelivery = async (deliveryId) => {
  const [rows] = await pool.query('SELECT * FROM deliveries WHERE id = ?', [deliveryId]);
  if (rows.length === 0) {
    throw new Error('Delivery not found');
  }
  return rows[0];
};
