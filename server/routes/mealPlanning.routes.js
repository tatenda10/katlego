const express = require('express');
const router = express.Router();
const mealPlanningController = require('../controllers/mealPlanning.controller');
const multer = require('multer');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage });


// Routes for meals
router.get('/meals', mealPlanningController.getMeals);
router.get('/meals/:id', mealPlanningController.getMealById);
router.post('/meals',  mealPlanningController.createMeal);

// Routes for meal plans
router.get('/meal-plans', mealPlanningController.getMealPlans);
router.post('/meal-plans', mealPlanningController.createMealPlan);
router.get('/meal-plans/user/:userId', mealPlanningController.getMealPlansByUser);

// Routes for orders
router.post('/orders', mealPlanningController.createOrder);
router.get('/orders', mealPlanningController.getOrders);
router.get('/orders/user/:userId', mealPlanningController.getOrdersByUser);

module.exports = router;
