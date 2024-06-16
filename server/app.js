
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const userRoutes = require('./routes/user.routes');
const mealPlanningRoutes = require('./routes/mealPlanning.routes');
const groceryListRoutes = require('./routes/groceryList.routes');
const authRoutes = require('./routes/auth.routes');
const app = express();
const path = require('path');

app.use(cors());
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/meal-planning', mealPlanningRoutes);
app.use('/api/grocery-lists', groceryListRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

module.exports = app;
