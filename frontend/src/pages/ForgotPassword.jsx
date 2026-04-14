import { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { apiFetch } from '../utils/api';
import GlassCard from '../components/GlassCard';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await apiFetch('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setSuccess(true);
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
             <KeyRound size={32} />
           </div>
           <h1 className="text-3xl font-black text-textMain italic">RESET PASSWORD</h1>
           <p className="text-textMuted mt-2">Recover access to your account</p>
        </div>

        <GlassCard className="p-8 w-full">
          {success ? (
            <div className="text-center space-y-6">
              <CheckCircle size={64} className="mx-auto text-income" />
              <h2 className="text-2xl font-bold">Check your email</h2>
              <p className="text-textMuted">We have sent a password reset link to <span className="text-textMain font-medium">{email}</span></p>
              <Link 
                to="/login" 
                className="inline-flex items-center gap-2 text-brandPrimary hover:underline font-bold"
              >
                <ArrowLeft size={18} /> Back to Login
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-6">Forgot Password?</h2>
              <p className="text-textMuted mb-6 text-sm text-center">Enter the email address associated with your account and we&apos;ll send you a link to reset your password.</p>
              
              {error && <p className="bg-expense/10 text-expense p-3 rounded-lg text-sm text-center mb-6 border border-expense/20">{error}</p>}
              
              <form onSubmit={handleSubmit} className="space-y-6">
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
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-borderDark bg-black/20 text-textMain outline-none focus:border-brandPrimary transition-all placeholder:text-textMuted/40"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 bg-brandPrimary hover:bg-brandPrimaryHover text-darkBg font-black rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-brandPrimary/20 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : 'SEND RESET LINK'}
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

export default ForgotPassword;
