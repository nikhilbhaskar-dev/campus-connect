import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen pb-12 overflow-hidden">
      {/* Navbar - Fades in immediately */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-[1100px] mx-auto animate-fade-in-up opacity-0">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl tracking-tight text-ink group">
          <span className="w-2.5 h-2.5 rounded-full bg-amber group-hover:scale-125 transition-transform"></span>Campii
        </Link>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] tracking-widest uppercase bg-line text-paper px-3.5 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse"></span>Campus Network · Live
          </span>
        </div>
      </nav>

      {/* Hero Section - Staggered fade in */}
      <header className="px-6 pt-12 pb-10 max-w-[1100px] mx-auto text-center">
        <div className="font-mono text-[11px] font-semibold tracking-[0.2em] uppercase text-grey mb-5 animate-fade-in-up opacity-0">
          Campus Ride Network
        </div>
        
        {/* Tighter tracking and exact color matching for the headline */}
        <h1 className="font-display text-5xl md:text-[4.2rem] font-bold leading-[1.05] tracking-tight max-w-[800px] mx-auto mb-6 animate-fade-in-up opacity-0 text-ink">
          Get across campus, <br className="hidden md:block" />
          <em className="not-italic text-line">without the wait.</em>
        </h1>
        
        <p className="text-[#4b5d57] max-w-[540px] mx-auto mb-14 text-lg leading-relaxed animate-fade-in-up-delayed opacity-0">
          Campii connects students who need a ride with students already heading that way — live tracking, transparent ride history, and a dashboard for everything in between.
        </p>

        {/* Route Map SVG - With animated dashed line */}
        <div className="relative max-w-3xl mx-auto mb-16 py-8 px-6 animate-fade-in-up-delayed opacity-0">
          <svg className="w-full h-auto block" viewBox="0 0 760 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Added animate-draw-path to make the route look active */}
            <path className="animate-draw-path" d="M40 100 C 160 100, 160 40, 280 40 S 440 110, 540 70 S 680 30, 720 40" stroke="#1f4d3e" strokeWidth="2.5" strokeDasharray="1 10" strokeLinecap="round"/>
            <circle cx="40" cy="100" r="7" fill="#f4a23a"/>
            <circle cx="280" cy="40" r="5" fill="#1f4d3e"/>
            <circle cx="540" cy="70" r="5" fill="#1f4d3e"/>
            <circle cx="720" cy="40" r="7" fill="#1f4d3e"/>
            <text x="20" y="128" fontFamily="JetBrains Mono" fontSize="11" fill="#7c8b85" letterSpacing="0.05em">HOSTEL GATE</text>
            <text x="245" y="25" fontFamily="JetBrains Mono" fontSize="11" fill="#7c8b85" letterSpacing="0.05em">LIBRARY</text>
            <text x="500" y="95" fontFamily="JetBrains Mono" fontSize="11" fill="#7c8b85" letterSpacing="0.05em">CAFETERIA</text>
            <text x="660" y="25" fontFamily="JetBrains Mono" fontSize="11" fill="#7c8b85" letterSpacing="0.05em">MAIN GATE</text>
          </svg>
        </div>

        {/* Role Selection Cards - Final stagger */}
        <div className="animate-fade-in-up-slow opacity-0">
          <h2 className="font-display text-lg font-bold mb-5 tracking-tight text-ink">Continue as</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {/* Passenger Card */}
            <Link to="/passenger/auth" className="bg-white border-[1.5px] border-line-soft rounded-[14px] p-8 text-left hover:border-line hover:-translate-y-1.5 hover:shadow-card-hover transition-all duration-300 ease-out group cursor-pointer">
              <div className="font-mono text-[10px] font-bold tracking-[0.15em] uppercase text-amber flex items-center gap-2 mb-4">
                <span className="w-4 h-[2px] bg-amber inline-block"></span>STOP 01
              </div>
              <h3 className="font-display text-[1.6rem] font-bold mb-2.5 tracking-tight text-ink">Passenger</h3>
              <p className="text-grey mb-6 text-[0.95rem] leading-relaxed">Request rides across campus, track them live, and rate your trip when you arrive.</p>
              <div className="font-display font-semibold text-[0.95rem] text-line flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                Continue as passenger
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </Link>

            {/* Driver Card */}
            <Link to="/driver/auth" className="bg-white border-[1.5px] border-line-soft rounded-[14px] p-8 text-left hover:border-line hover:-translate-y-1.5 hover:shadow-card-hover transition-all duration-300 ease-out group cursor-pointer">
              <div className="font-mono text-[10px] font-bold tracking-[0.15em] uppercase text-amber flex items-center gap-2 mb-4">
                <span className="w-4 h-[2px] bg-amber inline-block"></span>STOP 02
              </div>
              <h3 className="font-display text-[1.6rem] font-bold mb-2.5 tracking-tight text-ink">Driver</h3>
              <p className="text-grey mb-6 text-[0.95rem] leading-relaxed">Go online, accept ride requests, and keep an eye on your stats from one dashboard.</p>
              <div className="font-display font-semibold text-[0.95rem] text-line flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                Continue as driver
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </Link>
          </div>

          <div className="mt-12 text-[0.85rem] text-grey">
            Already part of Campii? <Link to="/passenger/auth" className="text-line font-bold hover:underline">Sign in</Link>
          </div>
        </div>
      </header>
    </div>
  );
}