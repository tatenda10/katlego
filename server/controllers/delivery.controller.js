const deliveryService = require('../services/delivery.service');

exports.createDelivery = async (req, res) => {
  try {
    const result = await deliveryService.createDelivery(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.trackDelivery = async (req, res) => {
  try {
    const result = await deliveryService.trackDelivery(req.params.deliveryId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
