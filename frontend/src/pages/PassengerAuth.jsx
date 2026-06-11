import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

export default function PassengerAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Initialize react-hook-form
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');

    // Determine which endpoint to hit based on the toggle state
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    // If registering, force the role to passenger
    const payload = isLogin ? data : { ...data, role: 'passenger' };

    try {
      const response = await fetch(`http://127.0.0.1:5001${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong');
      }

      // Success! Store the token in local storage
      localStorage.setItem('campii_token', result.token);
      localStorage.setItem('campii_user', JSON.stringify(result));

      console.log('Authentication successful:', result);
      navigate('/passenger/dashboard');

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = (mode) => {
    setIsLogin(mode);
    setError('');
    reset(); // Clear the form when switching between login/register
  };

  return (
    <div className="min-h-screen">
      <nav className="flex items-center justify-between px-6 py-5 max-w-[1100px] mx-auto">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl tracking-tight text-ink">
          <span className="w-2.5 h-2.5 rounded-full bg-amber"></span>Campii
        </Link>
        <span className="font-mono text-[11px] tracking-widest uppercase bg-line text-paper px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber"></span>Passenger
        </span>
      </nav>

      <div className="max-w-[420px] mx-auto mt-16 p-9 bg-white border-2 border-line-soft rounded-2xl shadow-card">
        <div className="font-mono text-[11px] tracking-widest uppercase text-amber flex items-center gap-2 mb-3">
          <span className="w-4 h-[2px] bg-amber inline-block"></span>Step 02 — Account
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        {isLogin ? (
          /* ----- LOGIN PANEL ----- */
          <div>
            <h2 className="font-display text-2xl font-bold mb-1">Welcome back</h2>
            <div className="text-sm text-grey mb-7">Sign in to continue your route.</div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5">Email</label>
                <input 
                  type="email" 
                  {...register("email", { required: true })}
                  placeholder="you@university.edu" 
                  className="w-full p-3 border-2 border-line-soft rounded-lg bg-paper focus:bg-white focus:border-line focus:outline-none transition-colors" 
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5">Password</label>
                <input 
                  type="password" 
                  {...register("password", { required: true })}
                  placeholder="••••••••" 
                  className="w-full p-3 border-2 border-line-soft rounded-lg bg-paper focus:bg-white focus:border-line focus:outline-none transition-colors" 
                />
              </div>
              <button disabled={isLoading} type="submit" className="w-full bg-line text-paper font-display font-bold py-3.5 rounded-full hover:bg-[#163a2f] hover:-translate-y-0.5 hover:shadow-card transition-all mt-2 disabled:opacity-50">
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
            <div className="text-center mt-6 text-sm text-grey">
              New to Campii? <button onClick={() => toggleMode(false)} className="text-line font-semibold hover:underline">Create an account</button>
            </div>
          </div>
        ) : (
          /* ----- REGISTER PANEL ----- */
          <div>
            <h2 className="font-display text-2xl font-bold mb-1">Create your account</h2>
            <div className="text-sm text-grey mb-7">Set up your passenger profile.</div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5">First name</label>
                  <input 
                    type="text" 
                    {...register("firstName", { required: true })}
                    placeholder="Aanya" 
                    className="w-full p-3 border-2 border-line-soft rounded-lg bg-paper focus:bg-white focus:border-line focus:outline-none transition-colors" 
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5">Last name</label>
                  <input 
                    type="text" 
                    {...register("lastName", { required: true })}
                    placeholder="Sharma" 
                    className="w-full p-3 border-2 border-line-soft rounded-lg bg-paper focus:bg-white focus:border-line focus:outline-none transition-colors" 
                  />
                </div>
              </div>
              <div>
                <label className="block font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5">Email</label>
                <input 
                  type="email" 
                  {...register("email", { required: true })}
                  placeholder="you@university.edu" 
                  className="w-full p-3 border-2 border-line-soft rounded-lg bg-paper focus:bg-white focus:border-line focus:outline-none transition-colors" 
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5">Password</label>
                <input 
                  type="password" 
                  {...register("password", { required: true })}
                  placeholder="Create a password" 
                  className="w-full p-3 border-2 border-line-soft rounded-lg bg-paper focus:bg-white focus:border-line focus:outline-none transition-colors" 
                />
              </div>
              <button disabled={isLoading} type="submit" className="w-full bg-line text-paper font-display font-bold py-3.5 rounded-full hover:bg-[#163a2f] hover:-translate-y-0.5 hover:shadow-card transition-all mt-2 disabled:opacity-50">
                {isLoading ? 'Creating...' : 'Create account'}
              </button>
            </form>
            <div className="text-center mt-6 text-sm text-grey">
              Already have an account? <button onClick={() => toggleMode(true)} className="text-line font-semibold hover:underline">Sign in</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}