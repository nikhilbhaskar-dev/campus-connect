const Ride = require('../models/Ride');

exports.getMyRides = async (req, res) => {
  try {
    
    const passengerId = req.headers.userid; 

    
    const rides = await Ride.find({ passenger: passengerId })
      .sort({ createdAt: -1 })
      .populate('driver', 'firstName lastName vehicleType plateNumber'); 

    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching rides', error: error.message });
  }
};