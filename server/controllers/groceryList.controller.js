const groceryListService = require('../services/groceryList.service');

exports.createGroceryList = async (req, res) => {
  try {
    const result = await groceryListService.createGroceryList(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getGroceryList = async (req, res) => {
  try {
    const result = await groceryListService.getGroceryList(req.params.groceryListId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
