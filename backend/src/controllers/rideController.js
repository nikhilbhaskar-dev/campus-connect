const Ride = require('../models/Ride');
const User = require('../models/User'); 

// Broadcast helper: Find 5 NEAREST drivers, wait 60s, repeat
const broadcastToDrivers = async (ride, pickupCoords, attempt, io) => {
  console.log(`\n📡 --- BROADCAST INITIATED (Attempt ${attempt}) ---`);

  try {
    // ✅ FIXED: Querying online drivers sorted by distance using $near
    const drivers = await User.find({ 
      role: 'driver', 
      isOnline: true,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: pickupCoords // Passenger's [lng, lat]
          }
        }
      }
    })
    .skip(attempt * 5)
    .limit(5);

    console.log(`👀 Found ${drivers.length} online drivers nearby.`);

    if (drivers.length === 0) {
      console.log("⚠️ No online drivers available to notify right now.");
      return; 
    }

    drivers.forEach(driver => {
      console.log(`📤 Sending ride request to driver: ${driver.firstName}`);
      io.to(driver.socketId).emit('newRideRequest', { 
        rideId: ride._id,
        pickupLocation: ride.pickupLocation,
        destination: ride.destination,
        fare: ride.fare
      });
    });

    // Schedule next batch
    setTimeout(async () => {
      const currentRide = await Ride.findById(ride._id);
      if (currentRide && currentRide.status === 'Requested') {
        console.log(`⏱️ Ride ${ride._id} still not accepted. Broadcasting to next 5 nearest...`);
        broadcastToDrivers(currentRide, pickupCoords, attempt + 1, io);
      }
    }, 60000); // 60,000ms = 1 minute

  } catch (err) {
    console.error("🔥 Error in broadcast logic:", err.message);
  }
};

exports.createRide = async (req, res) => {
  try {
    // Extract pickupCoords from request body
    const { passengerId, pickupLocation, destination, fare, pickupCoords } = req.body;
    
    if (!pickupCoords) {
      return res.status(400).json({ message: "Coordinates are required to find drivers" });
    }

    const newRide = await Ride.create({ 
      passenger: passengerId, 
      pickupLocation, 
      destination, 
      fare, 
      status: 'Requested' 
    });

    console.log(`✅ Ride ${newRide._id} saved to DB. Starting broadcast...`);

    // Pass the pickupCoords into the broadcast function
    broadcastToDrivers(newRide, pickupCoords, 0, req.io);

    res.status(201).json(newRide);
  } catch (error) {
    console.error("Error creating ride:", error);
    res.status(500).json({ message: 'Error creating ride', error: error.message });
  }
};

exports.acceptRide = async (req, res) => {
  try {
    const { rideId, driverId } = req.body;

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

exports.getHistory = async (req, res) => {
  try {
    const { userId, role } = req.params;
    const query = role === 'driver' ? { driver: userId } : { passenger: userId };
    
    // Fetch completed/past rides
    const rides = await Ride.find(query).sort({ createdAt: -1 }).populate('driver passenger', 'firstName lastName');
    
    // Calculate Stats
    const totalRides = rides.length;
    const totalAmount = rides.reduce((sum, ride) => sum + (ride.fare || 0), 0);

    res.json({ history: rides, stats: { totalRides, totalAmount } });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history', error: error.message });
  }
};

// Get Active Ride (if any)
exports.getActiveRide = async (req, res) => {
  try {
    const { userId, role } = req.params;
    const query = role === 'driver' 
      ? { driver: userId, status: { $in: ['Accepted', 'In Progress'] } }
      : { passenger: userId, status: { $in: ['Requested', 'Accepted', 'In Progress'] } };

   
    const activeRide = await Ride.findOne(query)
      .sort({ createdAt: -1 })
      .populate('driver', 'firstName vehicle plate rating');
    
    res.json({ activeRide });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching active ride', error: error.message });
  }
};
exports.updateRideStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; 

    const ride = await Ride.findByIdAndUpdate(id, { status }, { returnDocument: 'after' })
      .populate('passenger', 'socketId _id')
      .populate('driver', 'socketId firstName vehicle plate rating');

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    console.log(`🔄 Ride ${id} status updated to: ${status}`);

    // ✅ THE GHOST BUSTER: If a ride is cancelled, wipe out ALL other stuck 'Requested' rides for this user
    if (status === 'Cancelled' && ride.passenger) {
      const wiped = await Ride.updateMany(
        { passenger: ride.passenger._id, status: 'Requested' },
        { status: 'Cancelled' }
      );
      if (wiped.modifiedCount > 0) {
        console.log(`🧹 Wiped out ${wiped.modifiedCount} old ghost rides!`);
      }
    }

    if (ride.passenger && ride.passenger.socketId) {
      req.io.to(ride.passenger.socketId).emit('rideStatusUpdated', ride);
    }
    
    if (ride.driver && ride.driver.socketId) {
      req.io.to(ride.driver.socketId).emit('rideStatusUpdated', ride);
    }

    res.json(ride);
  } catch (error) {
    console.error("Error updating ride status:", error);
    res.status(500).json({ message: 'Error updating ride status', error: error.message });
  }
};