import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Placeholder components (You will move these to separate files in Phase 2)
const Home = () => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4">
    <h1 className="text-4xl font-bold text-blue-600 mb-8">Campus Ride Platform</h1>
    <div className="flex gap-4 border p-6 rounded-lg bg-white shadow-sm">
      <Link to="/passenger/login" className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
        I am a Passenger
      </Link>
      <Link to="/driver/login" className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
        I am a Driver
      </Link>
    </div>
  </div>
);

const PassengerLogin = () => <div className="p-8"><h2 className="text-2xl font-bold">Passenger Login (Your Area)</h2></div>;
const PassengerDashboard = () => <div className="p-8"><h2 className="text-2xl font-bold">Passenger Dashboard</h2></div>;

const DriverLogin = () => <div className="p-8"><h2 className="text-2xl font-bold">Driver Login (Friend's Area)</h2></div>;
const DriverDashboard = () => <div className="p-8"><h2 className="text-2xl font-bold">Driver Dashboard</h2></div>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Home />} />

        {/* Passenger Routes (You will build these) */}
        <Route path="/passenger/login" element={<PassengerLogin />} />
        <Route path="/passenger/dashboard" element={<PassengerDashboard />} />

        {/* Driver Routes (Your friend will build these) */}
        <Route path="/driver/login" element={<DriverLogin />} />
        <Route path="/driver/dashboard" element={<DriverDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;