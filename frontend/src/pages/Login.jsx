import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import { apiFetch } from '../utils/api';
import GlassCard from '../components/GlassCard';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
      <div className="w-full max-w-[450px] flex flex-col items-center">
        <div className="mb-8 text-center">
           <div className="w-16 h-16 bg-brandPrimary/10 text-brandPrimary rounded-2xl flex items-center justify-center mx-auto mb-4">
             <LogIn size={32} />
           </div>
           <h1 className="text-3xl font-black bg-gradient-to-r from-brandPrimary to-income bg-clip-text text-transparent italic">FINANCE TRACKER</h1>
           <p className="text-textMuted mt-2">Manage your wealth with precision</p>
        </div>

        <GlassCard className="p-8 w-full border-t-4 border-t-brandPrimary">
          <h2 className="text-2xl font-bold mb-6">Welcome Back</h2>
          {error && <p className="bg-expense/10 text-expense p-3 rounded-lg text-sm text-center mb-6 border border-expense/20">{error}</p>}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs text-textMuted font-medium uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" size={18} />
                <input 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-borderDark bg-black/20 text-textMain outline-none focus:border-brandPrimary transition-all placeholder:text-textMuted/40"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-textMuted font-medium uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-borderDark bg-black/20 text-textMain outline-none focus:border-brandPrimary transition-all placeholder:text-textMuted/40"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-brandPrimary hover:bg-brandPrimaryHover text-darkBg font-black rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-brandPrimary/20 mt-4 flex items-center justify-center"
            >
              {loading ? 'AUTHENTICATING...' : 'SIGN IN'}
            </button>
            
            <div className="text-right">
              <Link to="/forgot-password" size={14} className="text-textMuted hover:text-brandPrimary text-xs transition-colors">
                Forgot Password?
              </Link>
            </div>
          </form>

          <div className="mt-8 text-center text-sm text-textMuted">
            New to the platform? <Link to="/register" className="text-brandPrimary hover:text-brandPrimaryHover font-bold">Create an account</Link>
          </div>
        </GlassCard>
        
        <p className="mt-12 text-[10px] text-textMuted/30 uppercase tracking-[0.2em] font-medium text-center">Secured by AES-256 Encryption</p>
      </div>
    </div>
  );
};

export default Login;
