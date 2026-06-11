import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navigation, LogOut } from 'lucide-react';
import LiveRideCard from '../components/LiveRideCard';
import RideHistoryWidget from '../components/RideHistoryWidget';

export default function PassengerDashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Mock data to feed the new components
  const activeRideMock = {
    pickupLocation: "Hostel C Gate",
    destination: "Main Library",
    distance: "1.3 km",
    eta: "4 min",
    status: "In Progress",
    fare: 22,
    rideType: "Standard",
    driver: { name: "Rohan M.", initials: "RM", vehicle: "Bike", plate: "UK07 AB 1234", rating: "4.9" }
  };

  const historyMock = [
    { id: 1, pickup: "Hostel C", destination: "Library", driverName: "Rohan M.", date: "Today", status: "In Progress" },
    { id: 2, pickup: "Library", destination: "Cafeteria", driverName: "Priya K.", date: "Yesterday", status: "Completed" }
  ];

  const statsMock = { totalRides: 38, totalSpent: 612 };

  // Protect the route: Check for user on load
  useEffect(() => {
    const token = localStorage.getItem('campii_token');
    const userData = localStorage.getItem('campii_user');
    
    if (!token || !userData) {
      navigate('/passenger/auth');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('campii_token');
    localStorage.removeItem('campii_user');
    navigate('/');
  };

  if (!user) return null; // Prevent flash of content before redirect

  return (
    <div className="min-h-screen pb-20">
      {/* Navbar */}
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

      {/* Page Header */}
      <header className="px-6 pt-6 pb-2 max-w-[1100px] mx-auto flex flex-wrap justify-between items-end gap-4 animate-fade-in-up-delayed opacity-0">
        <div>
          <div className="font-mono text-[11px] font-semibold tracking-[0.2em] uppercase text-grey mb-2">Passenger Dashboard</div>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-ink">
            Where to, {user.firstName}?
          </h1>
        </div>
        <span className="font-mono text-[11px] tracking-widest uppercase bg-[#e3eef0] text-[#1f5d6e] px-3 py-1.5 rounded-full">
          1 active ride
        </span>
      </header>

      {/* Tabs */}
      <div className="px-6 pt-6 max-w-[1100px] mx-auto flex gap-2 animate-fade-in-up-delayed opacity-0">
        <button 
          onClick={() => setActiveTab('home')}
          className={`font-display font-semibold text-sm px-5 py-2.5 rounded-full border-2 transition-all ${activeTab === 'home' ? 'bg-line border-line text-paper' : 'bg-white border-line-soft text-grey hover:border-line hover:text-ink'}`}
        >
          Home
        </button>
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`font-display font-semibold text-sm px-5 py-2.5 rounded-full border-2 transition-all ${activeTab === 'dashboard' ? 'bg-line border-line text-paper' : 'bg-white border-line-soft text-grey hover:border-line hover:text-ink'}`}
        >
          My Rides
        </button>
      </div>

      {/* ---- TAB CONTENT: HOME ---- */}
      {activeTab === 'home' && (
        <div className="px-6 pt-6 max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-5 animate-fade-in-up-slow opacity-0">
          
          {/* Request Form Card */}
          <div className="bg-white border-[1.5px] border-line-soft rounded-[14px] p-6 shadow-sm hover:border-line transition-colors self-start">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-display font-bold text-lg text-ink">Request a ride</h3>
              <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-grey">New trip</span>
            </div>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <label className="block font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5 ml-8 text-ink">Pickup location</label>
                <div className="absolute left-2.5 top-[28px] w-2.5 h-2.5 rounded-full bg-amber"></div>
                <input type="text" placeholder="e.g. Hostel C Gate" className="w-full pl-9 pr-4 py-3 border-2 border-line-soft rounded-lg bg-paper focus:bg-white focus:border-line focus:outline-none transition-colors" />
              </div>
              <div className="relative">
                <label className="block font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5 ml-8 text-ink">Destination</label>
                <div className="absolute left-2.5 top-[28px] w-2.5 h-2.5 rounded-sm bg-line"></div>
                <input type="text" placeholder="e.g. Main Library" className="w-full pl-9 pr-4 py-3 border-2 border-line-soft rounded-lg bg-paper focus:bg-white focus:border-line focus:outline-none transition-colors" />
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5 text-ink">When</label>
                  <select className="w-full p-3 border-2 border-line-soft rounded-lg bg-paper focus:bg-white focus:border-line focus:outline-none transition-colors appearance-none">
                    <option>Now</option>
                    <option>Schedule for later</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5 text-ink">Ride type</label>
                  <select className="w-full p-3 border-2 border-line-soft rounded-lg bg-paper focus:bg-white focus:border-line focus:outline-none transition-colors appearance-none">
                    <option>Standard</option>
                    <option>Shared</option>
                  </select>
                </div>
              </div>
              <button className="w-full bg-amber text-ink font-display font-bold py-3.5 rounded-full hover:brightness-105 hover:-translate-y-0.5 hover:shadow-card transition-all mt-4">
                Find a driver
              </button>
            </form>
          </div>

          {/* Right Column: Map & Live Status Card */}
          <div className="flex flex-col gap-5">
            <div className="bg-white border-[1.5px] border-line-soft rounded-[14px] p-6 shadow-sm flex flex-col">
               <div className="flex justify-between items-center mb-4">
                <h3 className="font-display font-bold text-lg text-ink">Live Map</h3>
              </div>
              <div className="min-h-[200px] rounded-lg border-2 border-dashed border-line-soft bg-paper flex flex-col items-center justify-center text-grey gap-2 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#1f4d3e 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                <Navigation size={24} className="text-amber animate-pulse" />
                <span className="font-mono text-[11px] tracking-widest z-10">MAP INTEGRATION PENDING</span>
              </div>
            </div>
            
            {/* New Live Ride Preview Card sits right below the Map */}
            <LiveRideCard ride={activeRideMock} />
          </div>
        </div>
      )}

      {/* ---- TAB CONTENT: MY RIDES (DASHBOARD) ---- */}
      {activeTab === 'dashboard' && (
        <div className="px-6 pt-6 max-w-[1100px] mx-auto animate-fade-in-up-slow opacity-0">
          <RideHistoryWidget stats={statsMock} history={historyMock} />
        </div>
      )}
    </div>
  );
}