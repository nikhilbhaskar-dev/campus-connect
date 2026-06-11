import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PassengerAuth from './pages/PassengerAuth';

// Placeholders for your friend's work and your dashboard
const DriverAuth = () => <div className="p-8"><h2>Driver Auth (Friend's Area)</h2></div>;
const PassengerDashboard = () => <div className="p-8"><h2>Passenger Dashboard (Next up)</h2></div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/passenger/auth" element={<PassengerAuth />} />
        <Route path="/passenger/dashboard" element={<PassengerDashboard />} />
        
        {/* Your friend will update this later */}
        <Route path="/driver/auth" element={<DriverAuth />} />
      </Routes>
    </Router>
  );
}

export default App;