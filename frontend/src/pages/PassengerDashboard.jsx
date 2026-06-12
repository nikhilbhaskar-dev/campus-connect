import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, LocateFixed } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const activeRideMock = {
  pickupLocation: "Hostel C Gate", destination: "Main Library", distance: "1.3 km", eta: "4 min", status: "In Progress", fare: 22, rideType: "Standard",
  driver: { name: "Rohan M.", initials: "RM", vehicle: "Bike", plate: "UK07 AB 1234", rating: "4.9" }
};
const historyMock = [
  { id: 1, pickup: "Hostel C", destination: "Library", driverName: "Rohan M.", date: "Today", status: "In Progress" },
  { id: 2, pickup: "Library", destination: "Cafeteria", driverName: "Priya K.", date: "Yesterday", status: "Completed" },
  { id: 3, pickup: "Main Gate", destination: "Hostel A", driverName: "Sahil V.", date: "Oct 12", status: "Completed" }
];
const statsMock = { totalRides: 38, totalSpent: 612 };


function LiveRideCard({ ride }) {
  if (!ride) return null;
  return (
    <div className="bg-white border-[1.5px] border-line-soft rounded-[14px] p-6 shadow-sm relative overflow-hidden flex-1">
      <div className="font-mono text-[10px] font-bold tracking-[0.15em] uppercase text-grey flex items-center gap-2 mb-6">
        <span className="w-6 h-[2px] bg-amber inline-block"></span>LIVE RIDE PREVIEW
      </div>
      <div className="relative pl-8 mb-8">
        <div className="absolute left-[7px] top-[14px] bottom-[14px] w-[2px] bg-line-soft"></div>
        <div className="relative mb-6">
          <div className="absolute -left-8 top-1.5 w-4 h-4 rounded-full bg-amber border-4 border-white shadow-sm"></div>
          <h4 className="font-display font-bold text-lg text-ink leading-none mb-1">{ride.pickupLocation}</h4>
          <span className="text-sm text-grey">Pickup · Now</span>
        </div>
        <div className="relative">
          <div className="absolute -left-8 top-1.5 w-4 h-4 rounded-full border-[3.5px] border-line bg-white shadow-sm"></div>
          <h4 className="font-display font-bold text-lg text-ink leading-none mb-1">{ride.destination}</h4>
          <span className="text-sm text-grey">Destination · {ride.distance}</span>
        </div>
      </div>
      <hr className="border-line-soft mb-5" />
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-line text-paper flex items-center justify-center font-display font-bold">{ride.driver.initials}</div>
          <div>
            <div className="font-display font-bold text-ink">{ride.driver.name}</div>
            <div className="text-sm text-grey">{ride.driver.vehicle} · {ride.driver.plate} · ★ {ride.driver.rating}</div>
          </div>
        </div>
        <div className="font-mono text-xs font-semibold tracking-widest text-[#a85d00] bg-amber-soft px-3 py-1.5 rounded-full">ETA {ride.eta}</div>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-mono text-[10px] tracking-[0.1em] uppercase bg-[#e3eef0] text-[#1f5d6e] px-3 py-1.5 rounded-full font-bold">{ride.status}</span>
        <span className="font-mono text-sm text-grey">₹{ride.fare} · {ride.rideType}</span>
      </div>
    </div>
  );
}

function RideHistoryWidget({ stats, history }) {
  return (
    <div className="bg-white border-[1.5px] border-line-soft rounded-[14px] p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-display font-bold text-lg text-ink">My rides this month</h3>
        <span className="font-mono text-[10px] tracking-[0.1em] uppercase bg-[#e6f0e9] text-[#1f4d3e] px-3 py-1.5 rounded-full font-bold">History</span>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="border-[1.5px] border-line-soft rounded-[14px] p-5 relative overflow-hidden">
          <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-amber rounded-r-full"></div>
          <div className="font-display font-bold text-3xl text-ink mb-1">{stats.totalRides}</div>
          <div className="text-sm text-grey">Rides taken</div>
        </div>
        <div className="border-[1.5px] border-line-soft rounded-[14px] p-5 relative overflow-hidden">
          <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-line rounded-r-full"></div>
          <div className="font-display font-bold text-3xl text-ink mb-1">₹{stats.totalSpent}</div>
          <div className="text-sm text-grey">Spent</div>
        </div>
      </div>
      <div className="space-y-0">
        {history.map((ride, index) => (
          <div key={ride.id} className={`flex justify-between items-center py-5 ${index !== history.length - 1 ? 'border-b border-line-soft' : ''}`}>
            <div className="flex gap-4">
              <div className="relative flex flex-col items-center mt-1.5">
                <div className="w-2 h-2 rounded-full bg-amber"></div>
                <div className="w-[1.5px] h-6 bg-line-soft my-1"></div>
                <div className="w-2 h-2 rounded-sm bg-line"></div>
              </div>
              <div>
                <h4 className="font-display font-bold text-ink text-[1.05rem] mb-0.5">{ride.pickup} → {ride.destination}</h4>
                <div className="text-sm text-grey">{ride.driverName} · {ride.date}</div>
              </div>
            </div>
            <div>
              <span className={`font-mono text-[10px] tracking-[0.1em] uppercase px-3 py-1.5 rounded-full font-bold ${ride.status === 'In Progress' ? 'bg-[#e3eef0] text-[#1f5d6e]' : 'bg-[#e6f0e9] text-[#1f4d3e]'}`}>
                {ride.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const pickupIcon = new L.DivIcon({
  html: `<div style="width: 16px; height: 16px; background-color: #f4a23a; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
  className: 'custom-leaflet-icon',
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

function MapAutoCenter({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 16);
    }
  }, [coords, map]);
  return null;
}

export default function PassengerDashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  
  const defaultCoords = [29.865, 77.895];
  const [gpsCoords, setGpsCoords] = useState(null);

  const isFormValid = pickup.trim().length > 0 && destination.trim().length > 0;

  useEffect(() => {
    const token = localStorage.getItem('campii_token');
    const userData = localStorage.getItem('campii_user');
    if (!token || !userData) navigate('/passenger/auth');
    else setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('campii_token');
    localStorage.removeItem('campii_user');
    navigate('/');
  };

  const handleFindDriver = async () => {
  console.log("--- STARTING RIDE REQUEST ---");
  console.log("1. Form Valid?", isFormValid);
  console.log("Pickup:", pickup, "| Destination:", destination);

  if (!isFormValid) {
    alert("Please fill in both pickup and destination.");
    return;
  }

  const userString = localStorage.getItem('campii_user');
  if (!userString) {
    alert("Error: No user found in local storage. Try logging in again.");
    return;
  }

  const userData = JSON.parse(userString);
  // Support both _id (MongoDB default) and id
  const userId = userData._id || userData.id; 
  console.log("2. User ID found:", userId);

  if (!userId) {
    alert("Error: User ID is missing from your profile data.");
    return;
  }

  try {
    console.log("3. Sending request to backend on port 5001...");
    
    // Changed 127.0.0.1 to localhost to match typical CORS setups
    const response = await fetch('http://localhost:5001/api/rides', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('campii_token')}` 
      },
      body: JSON.stringify({
        passengerId: userId,
        pickupLocation: pickup,
        destination: destination,
        fare: 22 
      })
    });

    console.log("4. Backend responded with status:", response.status);

    if (response.ok) {
      alert("✅ Request sent! Searching for drivers...");
    } else {
      const data = await response.json();
      console.error("Backend Error Data:", data);
      alert("❌ Failed: " + (data.message || "Server rejected request"));
    }
  } catch (error) {
    console.error("🔥 CRITICAL FETCH ERROR:", error);
    alert("Cannot connect to server. Is your backend running on 5001?");
  }
};

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported.");
    
    navigator.geolocation.getCurrentPosition((position) => {
      setGpsCoords([position.coords.latitude, position.coords.longitude]);
      if (pickup === '') {
        setPickup("My Current Location");
      }
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pb-20">
      <nav className="flex items-center justify-between px-6 py-5 max-w-[1100px] mx-auto animate-fade-in-up opacity-0">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl tracking-tight text-ink group">
          <span className="w-2.5 h-2.5 rounded-full bg-amber group-hover:scale-125 transition-transform"></span>Campii
        </Link>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[11px] tracking-widest uppercase bg-line text-paper px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse"></span>Passenger
          </span>
          <button onClick={handleLogout} className="w-9 h-9 flex items-center justify-center rounded-full border border-line-soft hover:border-line hover:bg-line hover:text-paper transition-all text-ink">
            <LogOut size={16} />
          </button>
        </div>
      </nav>

      <header className="px-6 pt-6 pb-6 max-w-[1100px] mx-auto flex flex-wrap justify-between items-end gap-4 animate-fade-in-up-delayed opacity-0 border-b border-line-soft mb-8">
        <div>
          <div className="font-mono text-[11px] font-semibold tracking-[0.2em] uppercase text-grey mb-2">Passenger Dashboard</div>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-ink">Where to, {user.firstName}?</h1>
        </div>
      </header>

      <div className="px-6 pt-2 max-w-[1100px] mx-auto flex gap-2 mb-6 animate-fade-in-up-delayed opacity-0">
        <button onClick={() => setActiveTab('home')} className={`font-display font-semibold text-sm px-5 py-2.5 rounded-full border-2 transition-all ${activeTab === 'home' ? 'bg-line border-line text-paper' : 'bg-white border-line-soft text-grey hover:border-line hover:text-ink'}`}>Home</button>
        <button onClick={() => setActiveTab('dashboard')} className={`font-display font-semibold text-sm px-5 py-2.5 rounded-full border-2 transition-all ${activeTab === 'dashboard' ? 'bg-line border-line text-paper' : 'bg-white border-line-soft text-grey hover:border-line hover:text-ink'}`}>My Rides</button>
      </div>

      {activeTab === 'home' && (
        <div className="px-6 max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6 animate-fade-in-up-slow opacity-0">
          
          <div className="flex flex-col gap-6">
            <div className="bg-white border-[1.5px] border-line-soft rounded-[14px] p-6 shadow-sm">
              <h3 className="font-display font-bold text-lg text-ink mb-5">Request a ride</h3>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                
                {/* Text Input: Pickup */}
                <div className="relative">
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5 ml-8 text-ink">
                    Pickup location
                  </label>
                  <div className="absolute left-2.5 top-[28px] w-2.5 h-2.5 rounded-full bg-amber"></div>
                  
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      placeholder="e.g. Main Gate" 
                      className="w-full pl-9 pr-4 py-3 border-2 border-line-soft rounded-lg bg-paper focus:bg-white focus:outline-none focus:border-line transition-colors" 
                    />
                    <button type="button" onClick={handleUseMyLocation} title="Use My Location" className="px-3 border-2 border-line-soft rounded-lg bg-paper hover:bg-white hover:border-line transition-all text-grey hover:text-line flex items-center justify-center">
                      <LocateFixed size={18} />
                    </button>
                  </div>
                </div>

                {/* Text Input: Destination */}
                <div className="relative">
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5 ml-8 text-ink">
                    Destination
                  </label>
                  <div className="absolute left-2.5 top-[28px] w-2.5 h-2.5 rounded-sm bg-line"></div>
                  <input 
                    type="text" 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Library" 
                    className="w-full pl-9 pr-4 py-3 border-2 border-line-soft rounded-lg bg-paper focus:bg-white focus:outline-none focus:border-line transition-colors" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5 text-ink">When</label>
                    <select className="w-full p-3 border-2 border-line-soft rounded-lg bg-paper focus:bg-white focus:border-line focus:outline-none transition-colors appearance-none">
                      <option>Now</option><option>Schedule for later</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5 text-ink">Ride type</label>
                    <select className="w-full p-3 border-2 border-line-soft rounded-lg bg-paper focus:bg-white focus:border-line focus:outline-none transition-colors appearance-none">
                      <option>Standard</option><option>Shared</option>
                    </select>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={handleFindDriver}
                  disabled={!isFormValid}
                  className={`w-full text-ink font-display font-bold py-3.5 rounded-full transition-all mt-4 ${isFormValid ? 'bg-amber hover:brightness-105 hover:-translate-y-0.5 hover:shadow-card' : 'bg-line-soft cursor-not-allowed opacity-50'}`}
                >
                  {isFormValid ? 'Find a driver' : 'Enter route to continue'}
                </button>
              </form>
            </div>
            <RideHistoryWidget stats={statsMock} history={historyMock} />
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white border-[1.5px] border-line-soft rounded-[14px] p-6 shadow-sm flex flex-col h-[380px]">
               <div className="flex justify-between items-center mb-4">
                <h3 className="font-display font-bold text-lg text-ink">Campus Map</h3>
              </div>
              
              <div className="flex-1 rounded-lg border-2 border-line-soft overflow-hidden relative z-0">
                <MapContainer center={gpsCoords || defaultCoords} zoom={15} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" attribution='&copy; OSM' />
                  
                  <MapAutoCenter coords={gpsCoords} />
                  
                  {gpsCoords && (
                    <Marker position={gpsCoords} icon={pickupIcon}>
                      <Popup>Your Location</Popup>
                    </Marker>
                  )}
                </MapContainer>
              </div>
            </div>
            <LiveRideCard ride={activeRideMock} />
          </div>
        </div>
      )}

      {activeTab === 'dashboard' && (
        <div className="px-6 max-w-[1100px] mx-auto animate-fade-in-up-slow opacity-0">
          <RideHistoryWidget stats={statsMock} history={historyMock} />
        </div>
      )}
    </div>
  );
}