const express = require('express');
const router = express.Router();
const groceryListController = require('../controllers/groceryList.controller');

router.post('/', groceryListController.createGroceryList);
router.get('/:groceryListId', groceryListController.getGroceryList);

module.exports = router;
