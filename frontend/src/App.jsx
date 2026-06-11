import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PassengerAuth from './pages/PassengerAuth';
import PassengerDashboard from './pages/PassengerDashboard';

// Placeholder for your friend's work
const DriverAuth = () => <div className="p-8"><h2>Driver Auth (Friend's Area)</h2></div>;

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