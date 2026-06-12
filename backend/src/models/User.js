const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['passenger', 'driver'], default: 'passenger' },
  
  isOnline: { type: Boolean, default: false },
  socketId: { type: String, default: null },
  
  vehicleType: { type: String, enum: ['Bike', 'Auto-rickshaw', 'Car', 'Shuttle'] },
  plateNumber: { type: String },
  driverVerificationId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);