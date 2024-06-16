const pool = require('../config/database');

exports.getRecipes = async () => {
  const [recipes] = await pool.query('SELECT * FROM recipes');
  return recipes;
};

exports.createMealPlan = async ({ userId, name, recipes }) => {
  const [result] = await pool.query('INSERT INTO meal_plans (user_id, name) VALUES (?, ?)', [userId, name]);
  const mealPlanId = result.insertId;

  for (const recipeId of recipes) {
    await pool.query('INSERT INTO meal_plan_recipes (meal_plan_id, recipe_id) VALUES (?, ?)', [mealPlanId, recipeId]);
  }

  return { message: 'Meal plan created successfully', mealPlanId };
};
