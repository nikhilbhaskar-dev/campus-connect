const express = require('express');
const router = express.Router();
const rideController = require('../controllers/rideController');

router.post('/', rideController.createRide);
router.post('/accept', rideController.acceptRide);
router.get('/history/:userId/:role', rideController.getHistory);
router.get('/active/:userId/:role', rideController.getActiveRide);
router.put('/:id/status', rideController.updateRideStatus);

module.exports = router;