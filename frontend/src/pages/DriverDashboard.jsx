import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, MapPin, Navigation, Star, CheckCircle, Clock } from 'lucide-react';

// ==========================================
// MOCK DATA (Will be replaced by API later)
// ==========================================
const availableRidesMock = [
  { id: 101, passengerName: "Aanya S.", pickup: "Main Library", destination: "Hostel C Gate", distance: "1.3 km", fare: 22, eta: "2 min away" },
  { id: 102, passengerName: "Kabir D.", pickup: "Cafeteria", destination: "Main Gate", distance: "2.1 km", fare: 35, eta: "5 min away" }
];

const historyMock = [
  { id: 1, passengerName: "Riya M.", pickup: "Hostel A", destination: "Sports Complex", date: "Today, 2:30 PM", status: "Completed", earnings: 25 },
  { id: 2, passengerName: "Aman K.", pickup: "Main Gate", destination: "Library", date: "Yesterday", status: "Completed", earnings: 30 },
  { id: 3, passengerName: "Neha P.", pickup: "Hostel C", destination: "Cafeteria", date: "Oct 12", status: "Completed", earnings: 15 }
];

const statsMock = { totalRides: 142, totalEarnings: 3450, avgRating: 4.9 };

// ==========================================
// SUB-COMPONENTS
// ==========================================

function RideRequestCard({ request }) {
  return (
    <div className="bg-white border-[1.5px] border-line-soft rounded-[14px] p-6 shadow-sm hover:border-line transition-colors mb-4">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-paper text-line border-2 border-line-soft flex items-center justify-center font-display font-bold">
            {request.passengerName.charAt(0)}
          </div>
          <div>
            <div className="font-display font-bold text-ink">{request.passengerName}</div>
            <div className="text-xs text-grey flex items-center gap-1"><Clock size={12}/> {request.eta}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-display font-bold text-2xl text-ink">₹{request.fare}</div>
          <div className="text-xs text-grey font-mono uppercase tracking-widest">{request.distance}</div>
        </div>
      </div>

      <div className="relative pl-8 mb-6">
        <div className="absolute left-[7px] top-[14px] bottom-[14px] w-[2px] bg-line-soft"></div>
        <div className="relative mb-4">
          <div className="absolute -left-8 top-1.5 w-4 h-4 rounded-full bg-amber border-4 border-white shadow-sm"></div>
          <h4 className="font-display font-bold text-md text-ink leading-none mb-1">{request.pickup}</h4>
          <span className="text-xs text-grey">Pickup</span>
        </div>
        <div className="relative">
          <div className="absolute -left-8 top-1.5 w-4 h-4 rounded-full border-[3.5px] border-line bg-white shadow-sm"></div>
          <h4 className="font-display font-bold text-md text-ink leading-none mb-1">{request.destination}</h4>
          <span className="text-xs text-grey">Drop-off</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="flex-1 bg-line text-paper font-display font-bold py-3.5 rounded-full hover:bg-[#163a2f] hover:-translate-y-0.5 hover:shadow-card transition-all flex justify-center items-center gap-2">
          <CheckCircle size={18} /> Accept Ride
        </button>
      </div>
    </div>
  );
}

function DriverHistoryWidget({ stats, history }) {
  return (
    <div className="bg-white border-[1.5px] border-line-soft rounded-[14px] p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-display font-bold text-lg text-ink">My Earnings</h3>
        <span className="font-mono text-[10px] tracking-[0.1em] uppercase bg-[#e3eef0] text-[#1f5d6e] px-3 py-1.5 rounded-full font-bold">This Month</span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="border-[1.5px] border-line-soft rounded-[14px] p-5 relative overflow-hidden">
          <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-line rounded-r-full"></div>
          <div className="font-display font-bold text-2xl lg:text-3xl text-ink mb-1">₹{stats.totalEarnings}</div>
          <div className="text-xs text-grey font-medium uppercase tracking-wider font-mono">Earnings</div>
        </div>
        <div className="border-[1.5px] border-line-soft rounded-[14px] p-5 relative overflow-hidden">
          <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-amber rounded-r-full"></div>
          <div className="font-display font-bold text-2xl lg:text-3xl text-ink mb-1">{stats.totalRides}</div>
          <div className="text-xs text-grey font-medium uppercase tracking-wider font-mono">Completed</div>
        </div>
        <div className="border-[1.5px] border-line-soft rounded-[14px] p-5 relative overflow-hidden">
          <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-[#1f5d6e] rounded-r-full"></div>
          <div className="font-display font-bold text-2xl lg:text-3xl text-ink mb-1 flex items-center gap-1">{stats.avgRating} <Star size={18} fill="currentColor"/></div>
          <div className="text-xs text-grey font-medium uppercase tracking-wider font-mono">Rating</div>
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
                <div className="text-sm text-grey">{ride.passengerName} · {ride.date}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-display font-bold text-lg text-line">+₹{ride.earnings}</div>
              <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-grey">Completed</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// MAIN DASHBOARD COMPONENT
// ==========================================

export default function DriverDashboard() {
  const [activeTab, setActiveTab] = useState('requests');
  const [isOnline, setIsOnline] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('campii_token');
    const userData = localStorage.getItem('campii_user');
    if (!token || !userData) navigate('/driver/auth');
    else setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('campii_token');
    localStorage.removeItem('campii_user');
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pb-20 bg-paper">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-[1100px] mx-auto animate-fade-in-up opacity-0">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl tracking-tight text-ink group">
          <span className="w-2.5 h-2.5 rounded-full bg-line group-hover:scale-125 transition-transform"></span>Campii
        </Link>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[11px] tracking-widest uppercase bg-line-soft text-ink px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
            <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-amber animate-pulse' : 'bg-grey'}`}></span>
            Driver
          </span>
          <button onClick={handleLogout} className="w-9 h-9 flex items-center justify-center rounded-full border border-line-soft hover:border-line hover:bg-line hover:text-paper transition-all text-ink">
            <LogOut size={16} />
          </button>
        </div>
      </nav>

      {/* Page Header */}
      <header className="px-6 pt-6 pb-6 max-w-[1100px] mx-auto flex flex-wrap justify-between items-center gap-4 animate-fade-in-up-delayed opacity-0 border-b border-line-soft mb-8">
        <div>
          <div className="font-mono text-[11px] font-semibold tracking-[0.2em] uppercase text-grey mb-2">Driver Control Center</div>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-ink">Hello, {user.firstName}</h1>
        </div>
        
        {/* Status Toggle Button */}
        <button 
          onClick={() => setIsOnline(!isOnline)}
          className={`relative flex items-center w-36 h-12 rounded-full p-1 transition-colors duration-300 ${isOnline ? 'bg-line' : 'bg-white border-2 border-line-soft'}`}
        >
          <div className={`absolute w-10 h-10 rounded-full transition-transform duration-300 flex items-center justify-center ${isOnline ? 'translate-x-24 bg-white' : 'translate-x-0 bg-paper border border-line-soft'}`}>
            {isOnline ? <Navigation size={16} className="text-line" /> : <Clock size={16} className="text-grey" />}
          </div>
          <span className={`ml-12 font-display font-bold text-sm tracking-wide transition-colors duration-300 ${isOnline ? 'text-white' : 'text-grey ml-14'}`}>
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </span>
        </button>
      </header>

      {/* Tabs */}
      <div className="px-6 pt-2 max-w-[1100px] mx-auto flex gap-2 mb-6 animate-fade-in-up-delayed opacity-0">
        <button onClick={() => setActiveTab('requests')} className={`font-display font-semibold text-sm px-5 py-2.5 rounded-full border-2 transition-all ${activeTab === 'requests' ? 'bg-line border-line text-paper' : 'bg-white border-line-soft text-grey hover:border-line hover:text-ink'}`}>Available Rides</button>
        <button onClick={() => setActiveTab('history')} className={`font-display font-semibold text-sm px-5 py-2.5 rounded-full border-2 transition-all ${activeTab === 'history' ? 'bg-line border-line text-paper' : 'bg-white border-line-soft text-grey hover:border-line hover:text-ink'}`}>My History</button>
      </div>

      {/* ---- TAB CONTENT: AVAILABLE RIDES ---- */}
      {activeTab === 'requests' && (
        <div className="px-6 max-w-[700px] mx-auto animate-fade-in-up-slow opacity-0">
          
          {!isOnline ? (
            <div className="bg-white border-[1.5px] border-line-soft rounded-[14px] p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-paper rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-line-soft">
                <Clock size={24} className="text-grey" />
              </div>
              <h3 className="font-display font-bold text-xl text-ink mb-2">You are currently offline</h3>
              <p className="text-grey mb-6">Toggle your status to online to start receiving ride requests.</p>
              <button onClick={() => setIsOnline(true)} className="bg-line text-paper font-display font-bold py-3 px-8 rounded-full hover:bg-[#163a2f] hover:-translate-y-0.5 hover:shadow-card transition-all">
                Go Online Now
              </button>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display font-bold text-lg text-ink">Searching for nearby riders...</h3>
                <span className="flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-amber">
                  <span className="w-2 h-2 rounded-full bg-amber animate-ping"></span> Radar Active
                </span>
              </div>
              
              {availableRidesMock.map((request) => (
                <RideRequestCard key={request.id} request={request} />
              ))}
            </div>
          )}

        </div>
      )}

      {/* ---- TAB CONTENT: MY HISTORY ---- */}
      {activeTab === 'history' && (
        <div className="px-6 max-w-[800px] mx-auto animate-fade-in-up-slow opacity-0">
          <DriverHistoryWidget stats={statsMock} history={historyMock} />
        </div>
      )}
    </div>
  );
}