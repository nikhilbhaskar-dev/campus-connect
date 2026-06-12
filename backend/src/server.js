const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); 
const { Server } = require('socket.io'); 
require('dotenv').config();

// Route Imports
const authRoutes = require('./routes/authRoutes');
const rideRoutes = require('./routes/rideRoutes'); 

// CRITICAL FIX: Import the User model so Socket events don't crash
const User = require('./models/User'); 

const app = express();
const server = http.createServer(app); 

// Initialize Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Inject 'io' into the request object so controllers can use it
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);

// Hardcoded to 5001 to match your frontend requests
const PORT = process.env.PORT || 5001;

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('🔥 MongoDB Connected successfully');
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
  });

// Socket.io Real-time Logic
io.on('connection', (socket) => {
  console.log('🔌 New socket connection:', socket.id);

  // When driver clicks "Go Online"
  socket.on('driverOnline', async ({ driverId }) => {
    if (!driverId) return console.log("❌ ERROR: No driverId provided to socket");
    
    try {
      const updatedUser = await User.findByIdAndUpdate(
        driverId, 
        { isOnline: true, socketId: socket.id },
        { new: true }
      );
      if (updatedUser) {
        console.log(`🟢 SUCCESS: ${updatedUser.firstName} is ONLINE! (Role: ${updatedUser.role})`);
      }
    } catch (err) { 
      console.error("🔥 Database error setting driver online:", err.message); 
    }
  });

  // When driver clicks "Go Offline"
  socket.on('driverOffline', async ({ driverId }) => {
    if (!driverId) return;

    try {
      await User.findByIdAndUpdate(driverId, { isOnline: false, socketId: null });
      console.log(`🔴 Driver ${driverId} went offline.`);
    } catch (err) { 
      console.error("🔥 Database error setting driver offline:", err.message); 
    }
  });

  // If driver closes the tab or loses internet
  socket.on('disconnect', async () => {
    try {
      const user = await User.findOneAndUpdate(
        { socketId: socket.id }, 
        { isOnline: false, socketId: null }
      );
      if (user) {
        console.log(`❌ Socket disconnected: ${user.firstName} went offline.`);
      }
    } catch (err) { 
      console.error(err); 
    }
  });
});