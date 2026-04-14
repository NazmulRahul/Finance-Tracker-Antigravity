import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowLeft, Loader2, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { apiFetch } from '../utils/api';
import GlassCard from '../components/GlassCard';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    setLoading(true);
    setError('');
    try {
      await apiFetch(`/auth/reset-password/${token}`, {
        method: 'POST',
        body: JSON.stringify({ password }),
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
      <div className="w-full max-w-[450px] flex flex-col items-center">
        <div className="mb-8 text-center text-textMain">
           <div className="w-16 h-16 bg-expense/10 text-expense rounded-2xl flex items-center justify-center mx-auto mb-4">
             <Lock size={32} />
           </div>
           <h1 className="text-3xl font-black italic">NEW PASSWORD</h1>
           <p className="text-textMuted mt-2">Secure your account with a new pass</p>
        </div>

        <GlassCard className="p-8 w-full border-t-4 border-t-expense">
          {success ? (
            <div className="text-center space-y-6">
              <CheckCircle size={64} className="mx-auto text-income" />
              <h2 className="text-2xl font-bold">Password Updated</h2>
              <p className="text-textMuted">Your password has been reset successfully. Redirecting you to login...</p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
              {error && <p className="bg-expense/10 text-expense p-3 rounded-lg text-sm text-center mb-6 border border-expense/20">{error}</p>}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs text-textMuted font-medium uppercase tracking-wider ml-1">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" size={18} />
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="••••••••" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                      className="w-full pl-12 pr-12 py-4 rounded-xl border border-borderDark bg-black/20 text-textMain outline-none focus:border-brandPrimary transition-all"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-textMuted hover:text-textMain transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-textMuted font-medium uppercase tracking-wider ml-1">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" size={18} />
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="••••••••" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      required 
                      className="w-full pl-12 pr-12 py-4 rounded-xl border border-borderDark bg-black/20 text-textMain outline-none focus:border-brandPrimary transition-all"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 bg-expense hover:opacity-90 text-darkBg font-black rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-expense/20 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : 'UPDATE PASSWORD'}
                </button>
              </form>

              <div className="mt-8 text-center">
                <Link to="/login" className="text-textMuted hover:text-textMain text-sm inline-flex items-center gap-2 transition-colors">
                  <ArrowLeft size={16} /> Back to Login
                </Link>
              </div>
            </>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

export default ResetPassword;
