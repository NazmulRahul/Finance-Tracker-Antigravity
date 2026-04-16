import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { apiFetch } from '../utils/api';
import GlassCard from '../components/GlassCard';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    let timeout;
    const verify = async () => {
      try {
        const res = await apiFetch(`/auth/verify/${token}`);
        setStatus('success');
        setMessage(res.data.message);
        
        // Auto-redirect to login after 3 seconds on success
        timeout = setTimeout(() => {
          navigate('/login?verified=true');
        }, 3000);
      } catch (err) {
        setStatus('error');
        setMessage(err.message || 'Verification failed. The link may be invalid or expired.');
      }
    };
    
    verify();
    return () => clearTimeout(timeout);
  }, [token, navigate]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
      <div className="w-full max-w-[500px] flex flex-col items-center">
        <GlassCard className="p-10 w-full text-center">
          {status === 'verifying' && (
            <div className="space-y-6">
              <Loader2 size={64} className="mx-auto text-brandPrimary animate-spin" />
              <h2 className="text-2xl font-bold">Verifying your account</h2>
              <p className="text-textMuted">Please wait while we validate your email address...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-6">
              <CheckCircle size={64} className="mx-auto text-income" />
              <h2 className="text-2xl font-bold text-income">Success!</h2>
              <p className="text-textMuted">{message}</p>
              <p className="text-xs text-textMuted pt-4 italic">Redirecting you to the Sign In page...</p>
              <Link 
                to="/login" 
                className="inline-flex items-center gap-2 px-8 py-3 bg-income text-darkBg font-bold rounded-xl hover:opacity-90 transition-all active:scale-95 mt-4"
              >
                Sign In Now <ArrowRight size={18} />
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-6">
              <XCircle size={64} className="mx-auto text-expense" />
              <h2 className="text-2xl font-bold text-expense">Verification Failed</h2>
              <p className="text-textMuted">{message}</p>
              <div className="flex flex-col gap-3 pt-4">
                <Link 
                  to="/login" 
                  className="px-8 py-3 bg-brandPrimary text-darkBg font-bold rounded-xl hover:opacity-90 transition-all"
                >
                  Go to Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="px-8 py-3 bg-white/5 border border-borderDark text-textMain font-bold rounded-xl hover:bg-white/10 transition-all"
                >
                  Try Registering Again
                </Link>
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

export default VerifyEmail;
