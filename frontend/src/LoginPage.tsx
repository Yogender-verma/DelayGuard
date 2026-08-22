import { useState } from 'react';
import { ArrowLeft, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const validEmails = ['admin@123', 'employee@123', 'citizen@123'];
    if (validEmails.includes(email) && password === '12345') {
      // Mock successful login
      alert(`Login successful as ${email.split('@')[0]}! Redirecting...`);
      navigate('/');
    } else {
      setError('Invalid email or password. Hint: admin@123, employee@123, or citizen@123 / 12345');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-[#0f0c29] dark:via-[#302b63] dark:to-[#24243e] text-gray-900 dark:text-gray-200 font-sans selection:bg-fuchsia-500/30 overflow-x-hidden flex items-center justify-center p-6">
      
      {/* Page Transition Entry Animation */}
      <div className="w-full max-w-md animate-hero-entry relative z-10">
        
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-colors mb-8 font-medium">
          <ArrowLeft size={18} />
          Back to Home
        </Link>
        
        <div className="bg-white/80 dark:bg-[#121524]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 md:p-10 shadow-xl dark:shadow-[0_0_80px_rgba(217,70,239,0.15)] relative overflow-hidden">
          {/* Subtle internal glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/10 blur-[80px] rounded-full pointer-events-none" />
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] to-[#ec4899]">Back</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm">
            Log in to access your DelayGuard dashboard and SLA predictions.
          </p>
          
          <form className="space-y-5 relative z-10" onSubmit={handleLogin}>
            {error && (
              <div className="p-3 rounded-xl bg-red-100 dark:bg-red-500/10 border border-red-300 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 block">Email</label>
              <input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@123, employee@123, citizen@123" 
                className="w-full bg-gray-50 dark:bg-[#0a0c10]/50 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-600 focus:outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/50 transition-all"
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center block">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <a href="#" className="text-xs text-fuchsia-600 dark:text-fuchsia-400 hover:underline">Forgot password?</a>
              </div>
              <input 
                type="password" 
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-gray-50 dark:bg-[#0a0c10]/50 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-600 focus:outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/50 transition-all"
                required
              />
            </div>
            
            <button type="submit" className="w-full bg-gradient-to-r from-[#d946ef] to-[#8b5cf6] hover:from-[#c026d3] hover:to-[#7c3aed] text-white font-semibold px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-fuchsia-500/25 mt-6 group">
              Sign In
              <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400 relative z-10">
            Don't have an account?{' '}
            <Link to="/signup" className="text-fuchsia-600 dark:text-fuchsia-400 hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      
    </div>
  );
}
