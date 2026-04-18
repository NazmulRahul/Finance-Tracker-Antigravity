import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Mail, Lock } from 'lucide-react';
import { apiFetch } from '../utils/api';
import GlassCard from '../components/GlassCard';

const AdminLogin = () => {
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
      const res = await apiFetch('/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('adminUser', JSON.stringify(res.data));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-20 bg-[#0a0a0c]">
      <div className="w-full max-w-[450px] flex flex-col items-center">
        <div className="mb-8 text-center">
           <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/20">
             <ShieldAlert size={32} />
           </div>
           <h1 className="text-3xl font-black bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent italic tracking-tighter">ADMIN CONSOLE</h1>
           <p className="text-textMuted mt-2 font-medium">Authorized Personnel Only</p>
        </div>

        <GlassCard className="p-8 w-full border-t-4 border-t-red-500 shadow-2xl shadow-red-500/5">
          <h2 className="text-2xl font-bold mb-6">System Authentication</h2>
          {error && <p className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm text-center mb-6 border border-red-500/20 font-bold">{error}</p>}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] text-textMuted font-black uppercase tracking-[0.2em] ml-1">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" size={18} />
                <input 
                  type="email" 
                  placeholder="admin@system.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-borderDark bg-black/40 text-textMain outline-none focus:border-red-500 transition-all placeholder:text-textMuted/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-textMuted font-black uppercase tracking-[0.2em] ml-1">Secure Token</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-borderDark bg-black/40 text-textMain outline-none focus:border-red-500 transition-all placeholder:text-textMuted/20"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-red-600/20 mt-4 flex items-center justify-center tracking-widest"
            >
              {loading ? 'VERIFYING...' : 'ACCESS SYSTEM'}
            </button>
          </form>
        </GlassCard>
        
        <p className="mt-12 text-[10px] text-textMuted/30 uppercase tracking-[0.3em] font-black text-center">Encrypted Administration Layer v2.0</p>
      </div>
    </div>
  );
};

export default AdminLogin;
