const multer = require('multer');
const pool = require('../config/database');

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

// Initialize multer with the storage configuration
const upload = multer({ storage });

// Get all meals
exports.getMeals = async (req, res) => {
  try {
    const [meals] = await pool.query('SELECT * FROM meals');
    const mealsWithIngredients = await Promise.all(
      meals.map(async (meal) => {
        const [ingredients] = await pool.query('SELECT * FROM ingredients WHERE meal_id = ?', [meal.id]);
        return { ...meal, ingredients };
      })
    );
    res.json(mealsWithIngredients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get meal by ID
exports.getMealById = async (req, res) => {
  const { id } = req.params;
  try {
    const [meals] = await pool.query('SELECT * FROM meals WHERE id = ?', [id]);
    if (meals.length === 0) return res.status(404).json({ error: 'Meal not found' });
    const [ingredients] = await pool.query('SELECT * FROM ingredients WHERE meal_id = ?', [id]);
    res.json({ meal: meals[0], ingredients });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new meal
exports.createMeal = [
  upload.single('image'), // Use multer to handle file upload
  async (req, res) => {
    const { name, recipe, ingredients } = req.body;
    const imagePath = req.file ? `/images/${req.file.filename}` : null;

    try {
      console.log("Request body:", req.body);
      console.log("Name:", name);
      console.log("Recipe:", recipe);
      console.log("Ingredients:", ingredients);
      console.log("Image Path:", imagePath);

      const [mealResult] = await pool.query('INSERT INTO meals (name, image, recipe) VALUES (?, ?, ?)', [name, imagePath, recipe]);
      const mealId = mealResult.insertId;

      // Parse the ingredients list and insert each ingredient into the ingredients table
      const ingredientList = JSON.parse(ingredients);
      for (const { item, cost } of ingredientList) {
        await pool.query('INSERT INTO ingredients (meal_id, item, cost) VALUES (?, ?, ?)', [mealId, item, cost]);
      }

      res.status(201).json({ message: 'Meal created successfully', mealId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
];

// Create a meal plan
exports.createMealPlan = [
  upload.none(), // Use none() for parsing form-data without expecting files
  async (req, res) => {
    const { name, userId, meals } = req.body;

    console.log("Received body:", req.body); // Debug log
    console.log("Received meals:", meals); // Debug log

    try {
      const mealList = JSON.parse(meals); // Try parsing the JSON string
      if (!Array.isArray(mealList)) {
        throw new Error('Meals should be a JSON array');
      }

      const [mealPlanResult] = await pool.query('INSERT INTO meal_plans (name, user_id) VALUES (?, ?)', [name, userId]);
      const mealPlanId = mealPlanResult.insertId;

      for (const mealId of mealList) {
        await pool.query('INSERT INTO meal_plan_meals (meal_plan_id, meal_id) VALUES (?, ?)', [mealPlanId, mealId]);
      }

      res.status(201).json({ message: 'Meal plan created successfully', mealPlanId });
    } catch (error) {
      if (error instanceof SyntaxError) {
        res.status(400).json({ error: 'Invalid JSON format in meals field' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
];

// Get all meal plans
exports.getMealPlans = async (req, res) => {
  try {
    const [mealPlans] = await pool.query('SELECT * FROM meal_plans');
    
    for (let mealPlan of mealPlans) {
      const [meals] = await pool.query(`
        SELECT meals.* 
        FROM meals 
        JOIN meal_plan_meals ON meals.id = meal_plan_meals.meal_id 
        WHERE meal_plan_meals.meal_plan_id = ?
      `, [mealPlan.id]);

      mealPlan.meals = meals;
    }
    
    res.json(mealPlans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get meal plans by user
exports.getMealPlansByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const [mealPlans] = await pool.query('SELECT * FROM meal_plans WHERE user_id = ?', [userId]);
    
    for (let mealPlan of mealPlans) {
      const [meals] = await pool.query(`
        SELECT meals.* 
        FROM meals 
        JOIN meal_plan_meals ON meals.id = meal_plan_meals.meal_id 
        WHERE meal_plan_meals.meal_plan_id = ?
      `, [mealPlan.id]);

      for (let meal of meals) {
        const [ingredients] = await pool.query('SELECT * FROM ingredients WHERE meal_id = ?', [meal.id]);
        meal.ingredients = ingredients;
      }

      mealPlan.meals = meals;
    }
    
    res.json(mealPlans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Create an order
exports.createOrder = async (req, res) => {
  const { userId, meals } = req.body;
  try {
    let totalCost = 0;
    for (const mealId of meals) {
      const [ingredients] = await pool.query('SELECT cost FROM ingredients WHERE meal_id = ?', [mealId]);
      for (const ingredient of ingredients) {
        totalCost += parseFloat(ingredient.cost);
      }
    }

    const [orderResult] = await pool.query('INSERT INTO orders (user_id, total_cost) VALUES (?, ?)', [userId, totalCost]);
    const orderId = orderResult.insertId;

    for (const mealId of meals) {
      await pool.query('INSERT INTO order_meals (order_id, meal_id) VALUES (?, ?)', [orderId, mealId]);
    }

    res.status(201).json({ message: 'Order created successfully', orderId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders');
    
    const ordersWithDetails = await Promise.all(orders.map(async order => {
      const [orderMeals] = await pool.query('SELECT meal_id FROM order_meals WHERE order_id = ?', [order.id]);
      
      const meals = await Promise.all(orderMeals.map(async orderMeal => {
        const [mealDetails] = await pool.query('SELECT * FROM meals WHERE id = ?', [orderMeal.meal_id]);
        const [ingredients] = await pool.query('SELECT * FROM ingredients WHERE meal_id = ?', [orderMeal.meal_id]);
        return {
          meal: mealDetails[0],
          ingredients: ingredients
        };
      }));
      
      return {
        ...order,
        meals: meals
      };
    }));

    res.json(ordersWithDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get orders by user
exports.getOrdersByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    // Fetch orders for the given user
    const [orders] = await pool.query('SELECT * FROM orders WHERE user_id = ?', [userId]);
    
    // For each order, fetch the associated meals and their ingredients
    const ordersWithDetails = await Promise.all(orders.map(async order => {
      // Fetch meal IDs associated with the current order
      const [orderMeals] = await pool.query('SELECT meal_id FROM order_meals WHERE order_id = ?', [order.id]);
      
      // For each meal, fetch the meal details and ingredients
      const meals = await Promise.all(orderMeals.map(async orderMeal => {
        // Fetch meal details
        const [mealDetails] = await pool.query('SELECT * FROM meals WHERE id = ?', [orderMeal.meal_id]);
        
        // Fetch ingredients for the meal
        const [ingredients] = await pool.query('SELECT * FROM ingredients WHERE meal_id = ?', [orderMeal.meal_id]);
        
        return {
          meal: mealDetails[0],
          ingredients: ingredients
        };
      }));
      
      return {
        ...order,
        meals: meals
      };
    }));

    // Return the detailed orders
    res.json(ordersWithDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
