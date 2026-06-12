const Ride = require('../models/Ride');
const User = require('../models/User'); // Assuming Driver is in User model

// Broadcast helper: Find 5 drivers, wait 60s, repeat
const broadcastToDrivers = async (ride, attempt, io) => {
  console.log(`\n📡 --- BROADCAST INITIATED (Attempt ${attempt}) ---`);

  // 1. Find online drivers
  const drivers = await User.find({ role: 'driver', isOnline: true })
    .skip(attempt * 5)
    .limit(5);

  console.log(`👀 Found ${drivers.length} online drivers in database.`);

  if (drivers.length === 0) {
    console.log("⚠️ No online drivers available to notify right now.");
    return; // Stop if no one is online
  }

  // 2. Send the FULL ride details to each driver
  drivers.forEach(driver => {
    console.log(`📤 Sending ride request to driver socket: ${driver.socketId}`);
    
    // CRITICAL FIX: Send all the data the frontend needs to render the card!
    io.to(driver.socketId).emit('newRideRequest', { 
      rideId: ride._id,
      pickupLocation: ride.pickupLocation,
      destination: ride.destination,
      fare: ride.fare
    });
  });

  // 3. Schedule next batch
  setTimeout(async () => {
    const currentRide = await Ride.findById(ride._id);
    if (currentRide && currentRide.status === 'Requested') {
      console.log(`⏱️ Ride ${ride._id} still not accepted. Broadcasting to next batch...`);
      broadcastToDrivers(currentRide, attempt + 1, io);
    }
  }, 60000); // 60,000ms = 1 minute
};

exports.createRide = async (req, res) => {
  try {
    const { passengerId, pickupLocation, destination, fare } = req.body;
    
    const newRide = await Ride.create({ 
      passenger: passengerId, 
      pickupLocation, 
      destination, 
      fare, 
      status: 'Requested' 
    });

    console.log(`✅ Ride ${newRide._id} saved to DB. Starting broadcast...`);

    // CRITICAL FIX: Pass the whole 'newRide' object, not just the ID
    broadcastToDrivers(newRide, 0, req.io);

    res.status(201).json(newRide);
  } catch (error) {
    console.error("Error creating ride:", error);
    res.status(500).json({ message: 'Error creating ride', error: error.message });
  }
};

exports.acceptRide = async (req, res) => {
  try {
    const { rideId, driverId } = req.body;

    // ATOMIC UPDATE: Only updates if status is still 'Requested'
    const ride = await Ride.findOneAndUpdate(
      { _id: rideId, status: 'Requested' },
      { status: 'Accepted', driver: driverId },
      { new: true }
    );

    if (!ride) {
      return res.status(400).json({ message: 'Ride already accepted by another driver' });
    }

    console.log(`🎉 Ride ${rideId} accepted by driver ${driverId}`);
    res.json({ message: 'Ride accepted successfully', ride });
  } catch (error) {
    console.error("Error accepting ride:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};