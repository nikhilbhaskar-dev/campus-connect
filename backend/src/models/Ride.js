const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  passenger: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  driver: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
    // This is optional initially, as it's null when the ride is first 'Requested'
  },
  pickupLocation: { type: String, required: true },
  destination: { type: String, required: true },
  distance: { type: String }, // e.g., "1.3 km"
  eta: { type: String },      // e.g., "4 min"
  fare: { type: Number },
  rideType: { 
    type: String, 
    enum: ['Standard', 'Shared'], 
    default: 'Standard' 
  },
  status: { 
    type: String, 
    enum: ['Requested', 'Accepted', 'In Progress', 'Completed', 'Cancelled'], 
    default: 'Requested' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Ride', rideSchema);