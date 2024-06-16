const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/delivery.controller');

router.post('/', deliveryController.createDelivery);
router.get('/:deliveryId', deliveryController.trackDelivery);

module.exports = router;
