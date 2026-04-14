import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import { apiFetch } from '../utils/api';
import GlassCard from '../components/GlassCard';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
      <div className="w-full max-w-[450px] flex flex-col items-center">
        <div className="mb-8 text-center text-textMain">
           <div className="w-16 h-16 bg-income/10 text-income rounded-2xl flex items-center justify-center mx-auto mb-4">
             {success ? <CheckCircle size={32} /> : <UserPlus size={32} />}
           </div>
           <h1 className="text-3xl font-black bg-gradient-to-r from-brandPrimary to-income bg-clip-text text-transparent italic">
             {success ? 'CHECK EMAIL' : 'JOIN THE FUTURE'}
           </h1>
           <p className="text-textMuted mt-2">
             {success ? 'One more step to go' : 'Take control of your finances today'}
           </p>
        </div>

        <GlassCard className={`p-8 w-full border-t-4 ${success ? 'border-t-income' : 'border-t-income'}`}>
          {success ? (
            <div className="text-center space-y-6">
              <h2 className="text-2xl font-bold">Registration Successful!</h2>
              <p className="text-textMuted">We have sent a verification link to <span className="text-textMain font-medium">{email}</span>. Please verify your email to activate your account.</p>
              <div className="pt-4">
                <Link 
                  to="/login" 
                  className="inline-flex items-center gap-2 text-brandPrimary hover:underline font-bold"
                >
                  <ArrowLeft size={18} /> Back to Login
                </Link>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-6">Create Account</h2>
              {error && <p className="bg-expense/10 text-expense p-3 rounded-lg text-sm text-center mb-6 border border-expense/20">{error}</p>}
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs text-textMuted font-medium uppercase tracking-wider ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" size={18} />
                    <input 
                      type="text" 
                      placeholder="John Doe" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      required 
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-borderDark bg-black/20 text-textMain outline-none focus:border-brandPrimary transition-all placeholder:text-textMuted/40"
                    />
                  </div>
                </div>

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
                  className="w-full py-4 bg-income hover:opacity-90 text-darkBg font-black rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-income/20 mt-4"
                >
                  CREATE ACCOUNT
                </button>
              </form>

              <div className="mt-8 text-center text-sm text-textMuted">
                Already have an account? <Link to="/login" className="text-brandPrimary hover:text-brandPrimaryHover font-bold">Login here</Link>
              </div>
            </>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

export default Register;
