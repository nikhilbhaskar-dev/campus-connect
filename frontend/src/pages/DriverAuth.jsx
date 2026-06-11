import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

export default function DriverAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    // Force the role to 'driver' when registering
    const payload = isLogin ? data : { ...data, role: 'driver' };

    try {
      const response = await fetch(`http://127.0.0.1:5001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong');
      }

      // Store the token and navigate to the driver dashboard
      localStorage.setItem('campii_token', result.token);
      localStorage.setItem('campii_user', JSON.stringify(result));

      console.log('Driver auth successful:', result);
      navigate('/driver/dashboard');

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = (mode) => {
    setIsLogin(mode);
    setError('');
    reset();
  };

  return (
    <div className="min-h-screen">
      <nav className="flex items-center justify-between px-6 py-5 max-w-[1100px] mx-auto">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl tracking-tight text-ink">
          <span className="w-2.5 h-2.5 rounded-full bg-line"></span>Campii
        </Link>
        <span className="font-mono text-[11px] tracking-widest uppercase bg-line-soft text-ink px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-line"></span>Driver Portal
        </span>
      </nav>

      <div className="max-w-[480px] mx-auto mt-12 p-9 bg-white border-2 border-line-soft rounded-2xl shadow-card">
        <div className="font-mono text-[11px] tracking-widest uppercase text-line flex items-center gap-2 mb-3 font-bold">
          <span className="w-4 h-[2px] bg-line inline-block"></span>Partner Account
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        {isLogin ? (
          /* ----- LOGIN PANEL ----- */
          <div>
            <h2 className="font-display text-2xl font-bold mb-1">Driver Sign In</h2>
            <div className="text-sm text-grey mb-7">Ready to hit the road? Sign in below.</div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5">Email</label>
                <input type="email" {...register("email", { required: true })} placeholder="driver@university.edu" className="w-full p-3 border-2 border-line-soft rounded-lg bg-paper focus:bg-white focus:border-line focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5">Password</label>
                <input type="password" {...register("password", { required: true })} placeholder="••••••••" className="w-full p-3 border-2 border-line-soft rounded-lg bg-paper focus:bg-white focus:border-line focus:outline-none transition-colors" />
              </div>
              <button disabled={isLoading} type="submit" className="w-full bg-line text-paper font-display font-bold py-3.5 rounded-full hover:bg-[#163a2f] hover:-translate-y-0.5 hover:shadow-card transition-all mt-2 disabled:opacity-50">
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
            <div className="text-center mt-6 text-sm text-grey">
              Want to drive with us? <button onClick={() => toggleMode(false)} className="text-line font-semibold hover:underline">Apply here</button>
            </div>
          </div>
        ) : (
          /* ----- REGISTER PANEL ----- */
          <div>
            <h2 className="font-display text-2xl font-bold mb-1">Driver Application</h2>
            <div className="text-sm text-grey mb-7">Fill out your details to start earning.</div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5">First name</label>
                  <input type="text" {...register("firstName", { required: true })} placeholder="Rahul" className="w-full p-3 border-2 border-line-soft rounded-lg bg-paper focus:bg-white focus:border-line focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5">Last name</label>
                  <input type="text" {...register("lastName", { required: true })} placeholder="Verma" className="w-full p-3 border-2 border-line-soft rounded-lg bg-paper focus:bg-white focus:border-line focus:outline-none transition-colors" />
                </div>
              </div>
              
              <div>
                <label className="block font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5">Email</label>
                <input type="email" {...register("email", { required: true })} placeholder="driver@university.edu" className="w-full p-3 border-2 border-line-soft rounded-lg bg-paper focus:bg-white focus:border-line focus:outline-none transition-colors" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5">Vehicle Type</label>
                  <select {...register("vehicleType", { required: true })} className="w-full p-3 border-2 border-line-soft rounded-lg bg-paper focus:bg-white focus:border-line focus:outline-none transition-colors appearance-none">
                    <option value="Bike">Bike (2-Wheeler)</option>
                    <option value="Scooty">Scooty</option>
                    <option value="Car">Car</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5">Plate Number</label>
                  <input type="text" {...register("plateNumber", { required: true })} placeholder="UK07 AB 1234" className="w-full p-3 border-2 border-line-soft rounded-lg bg-paper focus:bg-white focus:border-line focus:outline-none transition-colors" />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5">University ID / License</label>
                <input type="text" {...register("driverVerificationId", { required: true })} placeholder="ID Number" className="w-full p-3 border-2 border-line-soft rounded-lg bg-paper focus:bg-white focus:border-line focus:outline-none transition-colors" />
              </div>

              <div>
                <label className="block font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5">Password</label>
                <input type="password" {...register("password", { required: true })} placeholder="Create a strong password" className="w-full p-3 border-2 border-line-soft rounded-lg bg-paper focus:bg-white focus:border-line focus:outline-none transition-colors" />
              </div>
              
              <button disabled={isLoading} type="submit" className="w-full bg-line text-paper font-display font-bold py-3.5 rounded-full hover:bg-[#163a2f] hover:-translate-y-0.5 hover:shadow-card transition-all mt-2 disabled:opacity-50">
                {isLoading ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
            <div className="text-center mt-6 text-sm text-grey">
              Already a partner? <button onClick={() => toggleMode(true)} className="text-line font-semibold hover:underline">Sign in</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}