const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['passenger', 'driver'], required: true },
  
  // Real-time tracking fields
  isOnline: { type: Boolean, default: false },
  socketId: { type: String, default: null },
  
  // ✅ FIXED: GeoJSON structure required for $near queries
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] } // [longitude, latitude]
  }
}, { timestamps: true });

// ✅ CRITICAL: This index allows MongoDB to calculate distances!
userSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('User', userSchema);