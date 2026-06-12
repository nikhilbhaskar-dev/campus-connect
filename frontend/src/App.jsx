import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PassengerAuth from './pages/PassengerAuth';
import PassengerDashboard from './pages/PassengerDashboard';
import DriverAuth from './pages/DriverAuth';
import DriverDashboard from './pages/DriverDashboard'; // <-- Import the new file

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        
       
        <Route path="/passenger/auth" element={<PassengerAuth />} />
        <Route path="/passenger/dashboard" element={<PassengerDashboard />} />
        
       
        <Route path="/driver/auth" element={<DriverAuth />} />
        <Route path="/driver/dashboard" element={<DriverDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;