import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function PassengerAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Wire this up to actual authentication later
    console.log("Form submitted, routing to dashboard...");
    navigate('/passenger/dashboard');
  };

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-[1100px] mx-auto">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl tracking-tight text-ink">
          <span className="w-2.5 h-2.5 rounded-full bg-amber"></span>Campii
        </Link>
        <span className="font-mono text-[11px] tracking-widest uppercase bg-line text-paper px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber"></span>Passenger
        </span>
      </nav>

      {/* Auth Container */}
      <div className="max-w-[420px] mx-auto mt-16 p-9 bg-white border-2 border-line-soft rounded-2xl shadow-card">
        <div className="font-mono text-[11px] tracking-widest uppercase text-amber flex items-center gap-2 mb-3">
          <span className="w-4 h-[2px] bg-amber inline-block"></span>Step 02 — Account
        </div>

        {isLogin ? (
          /* ----- LOGIN PANEL ----- */
          <div>
            <h2 className="font-display text-2xl font-bold mb-1">Welcome back</h2>
            <div className="text-sm text-grey mb-7">Sign in to continue your route.</div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5">Email</label>
                <input type="email" required placeholder="you@university.edu" className="w-full p-3 border-2 border-line-soft rounded-lg bg-paper focus:bg-white focus:border-line focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5">Password</label>
                <input type="password" required placeholder="••••••••" className="w-full p-3 border-2 border-line-soft rounded-lg bg-paper focus:bg-white focus:border-line focus:outline-none transition-colors" />
              </div>
              <button type="submit" className="w-full bg-line text-paper font-display font-bold py-3.5 rounded-full hover:bg-[#163a2f] hover:-translate-y-0.5 hover:shadow-card transition-all mt-2">
                Sign in
              </button>
            </form>
            <div className="text-center mt-6 text-sm text-grey">
              New to Campii? <button onClick={() => setIsLogin(false)} className="text-line font-semibold hover:underline">Create an account</button>
            </div>
          </div>
        ) : (
          /* ----- REGISTER PANEL ----- */
          <div>
            <h2 className="font-display text-2xl font-bold mb-1">Create your account</h2>
            <div className="text-sm text-grey mb-7">Set up your passenger profile.</div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5">First name</label>
                  <input type="text" required placeholder="Aanya" className="w-full p-3 border-2 border-line-soft rounded-lg bg-paper focus:bg-white focus:border-line focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5">Last name</label>
                  <input type="text" required placeholder="Sharma" className="w-full p-3 border-2 border-line-soft rounded-lg bg-paper focus:bg-white focus:border-line focus:outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="block font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5">Email</label>
                <input type="email" required placeholder="you@university.edu" className="w-full p-3 border-2 border-line-soft rounded-lg bg-paper focus:bg-white focus:border-line focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5">Password</label>
                <input type="password" required placeholder="Create a password" className="w-full p-3 border-2 border-line-soft rounded-lg bg-paper focus:bg-white focus:border-line focus:outline-none transition-colors" />
              </div>
              <button type="submit" className="w-full bg-line text-paper font-display font-bold py-3.5 rounded-full hover:bg-[#163a2f] hover:-translate-y-0.5 hover:shadow-card transition-all mt-2">
                Create account
              </button>
            </form>
            <div className="text-center mt-6 text-sm text-grey">
              Already have an account? <button onClick={() => setIsLogin(true)} className="text-line font-semibold hover:underline">Sign in</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}