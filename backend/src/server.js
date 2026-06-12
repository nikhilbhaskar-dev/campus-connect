const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); 
const { Server } = require('socket.io'); 
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const rideRoutes = require('./routes/rideRoutes'); 
const User = require('./models/User'); 

const app = express();
const server = http.createServer(app); 

const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);

const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('🔥 MongoDB Connected successfully');
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
  });

io.on('connection', (socket) => {
  console.log('🔌 New socket connection:', socket.id);

  // DRIVER SOCKETS
  socket.on('driverOnline', async ({ driverId, coordinates }) => {
    if (!driverId) return;
    try {
      const updatePayload = { isOnline: true, socketId: socket.id };
      if (coordinates) {
        updatePayload.location = {
          type: 'Point',
          coordinates: coordinates 
        };
      }
      const updatedUser = await User.findByIdAndUpdate(driverId, updatePayload, { new: true });
      if (updatedUser) console.log(`🟢 SUCCESS: ${updatedUser.firstName} is ONLINE!`);
    } catch (err) { 
      console.error("🔥 Database error setting driver online:", err.message); 
    }
  });

  socket.on('driverOffline', async ({ driverId }) => {
    if (!driverId) return;
    try {
      await User.findByIdAndUpdate(driverId, { isOnline: false, socketId: null });
      console.log(`🔴 Driver ${driverId} went offline.`);
    } catch (err) { 
      console.error(err.message); 
    }
  });

  // PASSENGER SOCKETS
  socket.on('passengerOnline', async ({ passengerId }) => {
    if (!passengerId) return;
    try {
      await User.findByIdAndUpdate(passengerId, { socketId: socket.id });
      console.log(`👤 Passenger ${passengerId} connected to socket.`);
    } catch (err) {
      console.error("Error setting passenger socket:", err.message);
    }
  });

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