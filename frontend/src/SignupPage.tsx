import { useState } from 'react';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Account created successfully! Redirecting to login...');
    navigate('/login');
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
            Create an <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] to-[#ec4899]">Account</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm">
            Start preventing SLA breaches today with DelayGuard.
          </p>
          
          <form className="space-y-5 relative z-10" onSubmit={handleSignup}>
            
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300 block">Full Name</label>
              <input 
                type="text" 
                id="name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe" 
                className="w-full bg-gray-50 dark:bg-[#0a0c10]/50 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-600 focus:outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/50 transition-all"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 block">Email</label>
              <input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@company.com" 
                className="w-full bg-gray-50 dark:bg-[#0a0c10]/50 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-600 focus:outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/50 transition-all"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300 block">Password</label>
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
              Sign Up
              <UserPlus size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400 relative z-10">
            Already have an account?{' '}
            <Link to="/login" className="text-fuchsia-600 dark:text-fuchsia-400 hover:underline font-medium">
              Log in
            </Link>
          </div>
        </div>
      </div>
      
    </div>
  );
}
