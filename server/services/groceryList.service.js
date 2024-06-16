const pool = require('../config/database');

exports.createGroceryList = async ({ userId, mealPlanId, items }) => {
  const [result] = await pool.query('INSERT INTO grocery_lists (user_id, meal_plan_id) VALUES (?, ?)', [userId, mealPlanId]);
  const groceryListId = result.insertId;

  for (const item of items) {
    await pool.query('INSERT INTO grocery_list_items (grocery_list_id, item_name, quantity) VALUES (?, ?, ?)', [groceryListId, item.name, item.quantity]);
  }

  return { message: 'Grocery list created successfully', groceryListId };
};

exports.getGroceryList = async (groceryListId) => {
  const [rows] = await pool.query('SELECT * FROM grocery_lists WHERE id = ?', [groceryListId]);
  if (rows.length === 0) {
    throw new Error('Grocery list not found');
  }
  return rows[0];
};
