# 🚖 Campii - Campus Ride Platform

A real-time campus ride management system that connects passengers and drivers within a university campus environment.

Campii enables students and staff to request rides, while registered campus drivers can accept and complete rides efficiently. The platform uses geospatial matching, WebSockets, and real-time ride tracking to provide a seamless transportation experience.

---

## 📌 Problem Statement

Campus transportation often suffers from:

- Difficulty finding nearby rides
- Lack of real-time driver availability
- Inefficient ride assignment
- Ride request conflicts
- Poor synchronization between passengers and drivers

Campii solves these challenges through:

- Real-time driver discovery
- Smart ride dispatching
- Live ride status updates
- Atomic ride assignment
- Driver analytics and ride history

---

# 🏗️ System Architecture

The application follows a MERN Stack architecture with Socket.IO for real-time communication.

```text
Frontend (React + Vite)
        │
        │ REST API + WebSocket
        ▼
Backend (Node.js + Express)
        │
        ▼
MongoDB Database
```

### Components

#### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- Socket.IO Client
- React Leaflet

#### Backend
- Node.js
- Express.js
- Socket.IO
- JWT Authentication
- Mongoose ODM

#### Database
- MongoDB
- GeoJSON Location Storage
- 2dsphere Indexing

---

# 🛠️ Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Socket.IO Client
- React Leaflet
- OpenStreetMap

## Backend

- Node.js
- Express.js
- Socket.IO
- JWT
- BcryptJS
- Mongoose
- Dotenv
- CORS

## Database

- MongoDB Atlas / MongoDB Community

---

# 📂 Project Structure

```text
campus-ride-platform
│
├── backend
│   ├── src
│   │   ├── controllers
│   │   │   ├── authController.js
│   │   │   └── rideController.js
│   │   │
│   │   ├── middlewares
│   │   │
│   │   ├── models
│   │   │   ├── User.js
│   │   │   └── Ride.js
│   │   │
│   │   ├── routes
│   │   │   ├── authRoutes.js
│   │   │   └── rideRoutes.js
│   │   │
│   │   ├── sockets
│   │   │
│   │   ├── utils
│   │   │
│   │   └── server.js
│   │
│   ├── .env
│   └── package.json
│
├── frontend
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   │   ├── LiveRideCard.jsx
│   │   │   └── RideHistoryWidget.jsx
│   │   │
│   │   ├── pages
│   │   │   ├── Home.jsx
│   │   │   ├── PassengerAuth.jsx
│   │   │   ├── DriverAuth.jsx
│   │   │   ├── PassengerDashboard.jsx
│   │   │   └── DriverDashboard.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
└── README.md
```

---

# ✨ Features

## Authentication

- Passenger Registration
- Driver Registration
- Login System
- JWT Authentication
- Secure Password Hashing

## Driver Management

- Driver Online / Offline Toggle
- Vehicle Information
- Driver Availability Tracking
- Real-Time Driver Presence

## Ride Management

### Passenger

- Create Ride Request
- Select Pickup Location
- Select Destination
- View Active Ride
- Cancel Ride
- Ride History

### Driver

- Receive Nearby Ride Requests
- Accept Ride
- Complete Ride
- View Ride History
- Track Earnings

## Real-Time Features

Powered by Socket.IO

- Live Ride Notifications
- Driver Availability Updates
- Ride Status Synchronization
- Instant Assignment Updates
- Active Ride Persistence

## Geospatial Matching

MongoDB Geospatial Queries are used to:

- Store Driver Coordinates
- Find Nearest Drivers
- Match Nearby Drivers First
- Reduce Passenger Wait Time

## Driver Dashboard

Provides:

- Total Rides Completed
- Active Ride Count
- Ride History
- Total Earnings
- Performance Insights

---

# 🗄️ Database Schema

## User Collection

```javascript
{
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  role: "passenger" | "driver",

  vehicle: String,
  plate: String,

  isOnline: Boolean,

  socketId: String,

  location: {
    type: "Point",
    coordinates: [longitude, latitude]
  }
}
```

## Ride Collection

```javascript
{
  passenger: ObjectId,
  driver: ObjectId,

  pickupLocation: String,
  destination: String,

  fare: Number,

  status:
    "Requested" |
    "Accepted" |
    "In Progress" |
    "Completed" |
    "Cancelled",

  createdAt: Date,
  updatedAt: Date
}
```

---

# 🔌 REST API Endpoints

## Authentication

### Register

```http
POST /api/auth/register
```

### Login

```http
POST /api/auth/login
```

## Ride APIs

### Create Ride

```http
POST /api/rides
```

### Accept Ride

```http
POST /api/rides/accept
```

### Update Ride Status

```http
PUT /api/rides/:id/status
```

### Get Active Ride

```http
GET /api/rides/active/:userId/:role
```

### Get Ride History

```http
GET /api/rides/history/:userId/:role
```

---

# ⚡ Socket.IO Events

## Driver Events

```javascript
driverOnline
driverOffline
```

## Passenger Events

```javascript
passengerOnline
```

## Ride Events

```javascript
newRideRequest
rideStatusUpdated
```

---

# 🚀 Key Design Decisions

## 1. Geospatial Driver Matching

Instead of notifying every driver:

- Passenger location is used
- MongoDB `$near` query finds closest drivers
- Top nearby drivers receive requests first
- Improves efficiency and reduces spam

## 2. Atomic Ride Acceptance

To prevent multiple drivers from accepting the same ride:

```javascript
findOneAndUpdate(
  {
    _id: rideId,
    status: "Requested"
  }
)
```

This guarantees:

- Only one driver gets assigned
- Eliminates race conditions

## 3. Ghost Ride Prevention

Before creating a new ride:

```javascript
updateMany(...)
```

Old pending rides are automatically cancelled.

Benefits:

- One active request per passenger
- Cleaner ride lifecycle
- No orphaned rides

## 4. Component-Based Frontend

Reusable React Components:

- LiveRideCard
- RideHistoryWidget
- Dashboard Widgets

Benefits:

- Maintainability
- Scalability
- Reusability

---

# ⚙️ Installation & Setup

## Clone Repository

```bash
git clone https://github.com/yourusername/campus-ride-platform.git

cd campus-ride-platform
```

## Backend Setup

```bash
cd backend

npm install
```

Create `.env`

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

CLIENT_URL=http://localhost:5173
```

Run Backend

```bash
npm start
```

or

```bash
nodemon src/server.js
```

## Frontend Setup

```bash
cd frontend

npm install
```

Run Frontend

```bash
npm run dev
```

---

# ▶️ Running the Application

### Backend

```bash
cd backend

npm start
```

Runs on:

```text
http://localhost:5000
```

### Frontend

```bash
cd frontend

npm run dev
```

Runs on:

```text
http://localhost:5173
```

---

# 📈 Future Enhancements

- Ride Scheduling
- Passenger Ratings & Feedback
- Driver Ratings
- UPI Payments
- QR Code Payments
- Push Notifications
- Demand Forecasting using Machine Learning
- Heatmaps for Ride Analytics
- Admin Dashboard
- Mobile Application

---

# 🧪 Testing Scenarios

### Passenger

- Register/Login
- Request Ride
- Cancel Ride
- View Ride History

### Driver

- Register/Login
- Go Online
- Accept Ride
- Complete Ride
- View Earnings

### Real-Time

- Driver Availability Updates
- Ride Acceptance Notifications
- Ride Completion Updates
- Socket Reconnection Handling

---

# 👨‍💻 Author

### Nikhil Bhaskar
### Rajat Arora
### Gaurav Yadav

Built using:

**MongoDB • Express.js • React.js • Node.js • Socket.IO • Tailwind CSS • Leaflet**

---

# 📄 License

This project is developed for educational and academic purposes.

MIT License © 2026