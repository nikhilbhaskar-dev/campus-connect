// DriverDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Navigation, CheckCircle, Clock } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { io } from "socket.io-client";

const socket = io("http://localhost:5001");

// --- MAP ICONS ---
const driverIcon = new L.DivIcon({
  html: `<div style="width: 20px; height: 20px; background-color: #1f4d3e; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;"><div style="width: 6px; height: 6px; background-color: #f4a23a; border-radius: 50%;"></div></div>`,
  iconSize: [20, 20], iconAnchor: [10, 10]
});

function MapAutoCenter({ coords }) {
  const map = useMap();
  useEffect(() => { if (coords) map.flyTo(coords, 15, { animate: true, duration: 1.5 }); }, [coords, map]);
  return null;
}

export default function DriverDashboard() {
  const [activeTab, setActiveTab] = useState('requests');
  const [isOnline, setIsOnline] = useState(false);
  const [user, setUser] = useState(null);
  const [driverCoords, setDriverCoords] = useState([29.865, 77.895]); 
  const [availableRides, setAvailableRides] = useState([]);
  const navigate = useNavigate();

  // REAL DATA STATES
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ totalRides: 0, totalAmount: 0 });

  useEffect(() => {
    const token = localStorage.getItem('campii_token');
    const userData = localStorage.getItem('campii_user');
    
    if (!token || !userData) {
      navigate('/driver/auth');
      return;
    } 
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Fetch initial history
    fetchHistory(parsedUser._id, token);

    socket.off("newRideRequest");

    socket.on("newRideRequest", (data) => {
      console.log("🔥 Incoming ride received on frontend:", data);
      const newRequest = {
        id: data.rideId,
        passengerName: "Passenger",
        pickup: data.pickupLocation,
        destination: data.destination,
        fare: data.fare,
        eta: "Just now",
        coords: driverCoords 
      };
      setAvailableRides(prev => [...prev, newRequest]);
    });

    return () => socket.off("newRideRequest");
  }, [navigate, driverCoords]);

  const fetchHistory = async (userId, token) => {
    try {
      const response = await fetch(`http://localhost:5001/api/rides/history/${userId}/driver`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setHistory(data.history);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching driver history:", error);
    }
  };

  const toggleOnlineStatus = () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    
    if (newStatus) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
            setDriverCoords([pos.coords.latitude, pos.coords.longitude]);
            socket.emit('driverOnline', { 
              driverId: user._id,
              coordinates: [pos.coords.longitude, pos.coords.latitude]
            });
          },
          (err) => console.error("Location error", err)
        );
      } else {
        socket.emit('driverOnline', { driverId: user._id });
      }
    } else {
      socket.emit('driverOffline', { driverId: user._id });
      setAvailableRides([]); 
    }
  };

  const handleAcceptRide = async (rideId) => {
    const token = localStorage.getItem('campii_token');
    try {
      const response = await fetch('http://localhost:5001/api/rides/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ rideId: rideId, driverId: user._id })
      });

      if (response.ok) {
        alert("Ride Accepted!");
        setAvailableRides(prev => prev.filter(req => req.id !== rideId));
        // Refresh history to show the newly accepted ride
        fetchHistory(user._id, token);
      } else {
        alert("Ride already taken by another driver.");
        setAvailableRides(prev => prev.filter(req => req.id !== rideId)); 
      }
    } catch (error) {
      console.error("Error accepting ride:", error);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pb-20 bg-paper">
      <nav className="flex items-center justify-between px-6 py-5 max-w-[1100px] mx-auto">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl text-ink">
          <span className="w-2.5 h-2.5 rounded-full bg-line"></span>Campii
        </Link>
        <button onClick={() => { localStorage.clear(); navigate('/'); }} className="w-9 h-9 flex items-center justify-center rounded-full border border-line-soft hover:bg-line hover:text-paper text-ink transition-all">
          <LogOut size={16} />
        </button>
      </nav>

      <header className="px-6 pt-6 pb-6 max-w-[1100px] mx-auto flex flex-wrap justify-between items-center gap-4 border-b border-line-soft mb-8">
        <div>
          <div className="font-mono text-[11px] font-semibold uppercase text-grey mb-2">Driver Control Center</div>
          <h1 className="font-display text-3xl font-bold text-ink">Hello, {user.firstName}</h1>
        </div>
        <button onClick={toggleOnlineStatus} className={`relative flex items-center w-36 h-12 rounded-full p-1 transition-colors ${isOnline ? 'bg-line' : 'bg-white border-2 border-line-soft'}`}>
          <div className={`absolute w-10 h-10 rounded-full flex items-center justify-center transition-transform ${isOnline ? 'translate-x-24 bg-white shadow-sm' : 'translate-x-0 bg-paper border border-line-soft'}`}>
            {isOnline ? <Navigation size={16} className="text-line" /> : <Clock size={16} className="text-grey" />}
          </div>
          <span className={`ml-12 font-display font-bold text-sm ${isOnline ? 'text-white' : 'text-grey ml-14'}`}>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
        </button>
      </header>

      <div className="px-6 pt-2 max-w-[1100px] mx-auto flex gap-2 mb-6">
        <button onClick={() => setActiveTab('requests')} className={`font-display font-semibold text-sm px-5 py-2.5 rounded-full border-2 ${activeTab === 'requests' ? 'bg-line border-line text-paper' : 'bg-white border-line-soft text-grey'}`}>Available Rides</button>
        <button onClick={() => setActiveTab('history')} className={`font-display font-semibold text-sm px-5 py-2.5 rounded-full border-2 ${activeTab === 'history' ? 'bg-line border-line text-paper' : 'bg-white border-line-soft text-grey'}`}>My History</button>
      </div>

      {activeTab === 'requests' ? (
        <div className="px-6 max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6">
          {!isOnline ? (
            <div className="col-span-2 text-center p-20 bg-white border border-line-soft rounded-[14px]">
              <Clock size={48} className="text-grey mx-auto mb-4" />
              <h3 className="font-display font-bold text-xl mb-2">Offline</h3>
              <p className="text-grey mb-6">Toggle your status to online to activate your radar and receive ride requests.</p>
              <button onClick={toggleOnlineStatus} className="bg-line text-paper py-3 px-8 rounded-full font-bold">Go Online Now</button>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center mb-2 px-1">
                  <h3 className="font-display font-bold text-lg text-ink">Incoming Requests</h3>
                  <span className="flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-amber">
                    <span className="w-2 h-2 rounded-full bg-amber animate-ping"></span> Radar Active
                  </span>
                </div>
                
                {availableRides.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-line-soft rounded-2xl">
                     <p className="text-grey font-mono text-sm uppercase tracking-widest">Searching map...</p>
                  </div>
                )}
                
                {availableRides.map((req) => (
                  <div key={req.id} className="bg-white border border-line-soft rounded-[14px] p-6 shadow-sm border-l-4 border-l-amber">
                    <div className="flex justify-between mb-6">
                      <div>
                        <div className="font-bold">{req.passengerName}</div>
                        <div className="text-xs text-grey">{req.eta} away</div>
                      </div>
                      <div className="text-right font-bold text-xl">₹{req.fare}</div>
                    </div>
                    <div className="relative pl-6 mb-6 text-sm">
                      <div className="absolute left-[3px] top-1 bottom-1 w-[2px] bg-line-soft"></div>
                      <div className="mb-4">{req.pickup}</div>
                      <div>{req.destination}</div>
                    </div>
                    <button onClick={() => handleAcceptRide(req.id)} className="w-full bg-line text-paper font-bold py-3 rounded-full hover:bg-[#163a2f] transition-colors flex justify-center items-center gap-2">
                      <CheckCircle size={18} /> Accept Ride
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="h-[500px] bg-white border border-line-soft rounded-[14px] p-2 sticky top-6">
                <MapContainer center={driverCoords} zoom={15} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                  <MapAutoCenter coords={driverCoords} />
                  <Marker position={driverCoords} icon={driverIcon} />
                </MapContainer>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="px-6 max-w-[800px] mx-auto space-y-6">
          <div className="bg-white border border-line-soft rounded-[20px] p-8">
            <h3 className="font-display font-bold text-xl mb-8">My Performance</h3>
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="border border-line-soft rounded-[14px] p-6">
                <div className="text-3xl font-bold">{stats.totalRides || 0}</div>
                <div className="text-sm text-grey">Total Rides Completed</div>
              </div>
              <div className="border border-line-soft rounded-[14px] p-6">
                <div className="text-3xl font-bold">₹{stats.totalAmount || 0}</div>
                <div className="text-sm text-grey">Total Earnings</div>
              </div>
            </div>

            <h3 className="font-display font-bold text-lg mb-4">Past Rides</h3>
            <div className="space-y-0 max-h-[400px] overflow-y-auto pr-2">
              {history.length === 0 && <p className="text-grey text-sm">No rides completed yet.</p>}
              {history.map((ride, index) => (
                <div key={ride._id} className={`flex justify-between items-center py-5 ${index !== history.length - 1 ? 'border-b border-line-soft' : ''}`}>
                  <div className="flex gap-4">
                    <div className="relative flex flex-col items-center mt-1.5">
                      <div className="w-2 h-2 rounded-full bg-amber"></div>
                      <div className="w-[1.5px] h-6 bg-line-soft my-1"></div>
                      <div className="w-2 h-2 rounded-sm bg-line"></div>
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-ink text-[1.05rem] mb-0.5">{ride.pickupLocation} → {ride.destination}</h4>
                      <div className="text-sm text-grey">{new Date(ride.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="text-right">
                     <div className="font-bold">₹{ride.fare}</div>
                     <span className={`font-mono text-[10px] tracking-[0.1em] uppercase ${ride.status === 'In Progress' ? 'text-amber' : 'text-line'}`}>
                      {ride.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}