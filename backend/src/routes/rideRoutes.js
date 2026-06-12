const express = require('express');
const router = express.Router();
const rideController = require('../controllers/rideController');

router.post('/', rideController.createRide);
router.post('/accept', rideController.acceptRide);

module.exports = router;