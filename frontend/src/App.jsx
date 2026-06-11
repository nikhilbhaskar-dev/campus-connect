import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PassengerAuth from './pages/PassengerAuth';
import PassengerDashboard from './pages/PassengerDashboard';
import DriverAuth from './pages/DriverAuth';

// Temporary placeholder until we build the real dashboard
const DriverDashboard = () => <div className="p-8 text-center"><h2 className="text-2xl font-bold">Welcome Driver!</h2><p>Dashboard coming next.</p></div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Passenger Routes */}
        <Route path="/passenger/auth" element={<PassengerAuth />} />
        <Route path="/passenger/dashboard" element={<PassengerDashboard />} />
        
        {/* Driver Routes */}
        <Route path="/driver/auth" element={<DriverAuth />} />
        <Route path="/driver/dashboard" element={<DriverDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;