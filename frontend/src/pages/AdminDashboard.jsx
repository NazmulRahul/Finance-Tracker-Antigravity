import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Trash2, 
  Key, 
  LogOut, 
  ShieldCheck, 
  Search,
  X,
  AlertTriangle
} from 'lucide-react';
import { apiFetch } from '../utils/api';
import GlassCard from '../components/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Note: We need to use adminToken here
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      } else {
        throw new Error(data.data.message);
      }
    } catch (err) {
      console.error(err);
      if (err.message.includes('Not authorized')) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${selectedUser._id}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password: newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Password updated successfully');
        setIsPasswordModalOpen(false);
        setNewPassword('');
      } else {
        alert(data.data.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${selectedUser._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.filter(u => u._id !== selectedUser._id));
        setIsDeleteModalOpen(false);
      } else {
        alert(data.data.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin');
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-textMain p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex justify-between items-center bg-red-500/5 p-6 rounded-3xl backdrop-blur-xl border border-red-500/10 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/10 rounded-2xl text-red-500 border border-red-500/20">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black italic tracking-tighter text-white">
                ADMINISTRATION LAYER
              </h1>
              <p className="text-textMuted text-xs font-bold uppercase tracking-widest">Global User Control</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 text-textMuted hover:text-white transition-all font-black text-xs tracking-widest"
          >
            <LogOut size={18} />
            TERMINATE SESSION
          </button>
        </header>

        {/* User Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-6 border-l-4 border-l-brandPrimary bg-brandPrimary/5">
             <div className="flex justify-between items-center">
                <div>
                    <p className="text-textMuted text-xs font-bold uppercase tracking-widest">Total Users</p>
                    <h2 className="text-4xl font-black mt-1">{users.length}</h2>
                </div>
                <Users size={40} className="text-brandPrimary/20" />
             </div>
          </GlassCard>
        </div>

        {/* User Management Section */}
        <GlassCard className="p-0 overflow-hidden border border-white/5 shadow-2xl">
          <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.02]">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                  <Users size={18} />
               </div>
               <h3 className="text-lg font-bold">User Directory</h3>
            </div>
            
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" size={18} />
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm outline-none focus:border-red-500/50 transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/[0.01] text-[10px] uppercase tracking-[0.2em] font-black text-textMuted border-b border-white/5">
                  <th className="px-6 py-4">User Identity</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created On</th>
                  <th className="px-6 py-4 text-right">Operational Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr><td colSpan="4" className="text-center py-20 text-textMuted font-bold italic">RETRIVING DATA...</td></tr>
                ) : filteredUsers.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-20 text-textMuted">No users found.</td></tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brandPrimary/20 to-income/20 flex items-center justify-center font-bold text-brandPrimary border border-white/5">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-sm tracking-tight">{user.name}</p>
                            <p className="text-xs text-textMuted">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${user.isVerified ? 'bg-income/10 text-income border border-income/20' : 'bg-expense/10 text-expense border border-expense/20'}`}>
                          {user.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-xs text-textMuted font-medium">
                        {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => { setSelectedUser(user); setIsPasswordModalOpen(true); }}
                            className="p-2 hover:bg-brandPrimary/10 text-textMuted hover:text-brandPrimary rounded-lg transition-all border border-transparent hover:border-brandPrimary/20"
                            title="Reset Password"
                          >
                            <Key size={18} />
                          </button>
                          <button 
                            onClick={() => { setSelectedUser(user); setIsDeleteModalOpen(true); }}
                            className="p-2 hover:bg-red-500/10 text-textMuted hover:text-red-500 rounded-lg transition-all border border-transparent hover:border-red-500/20"
                            title="Delete User"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      {/* Password Reset Modal */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPasswordModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-[#121214] border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Key className="text-brandPrimary" /> Override User Password
              </h3>
              <p className="text-sm text-textMuted mb-6">Changing password for <span className="text-white font-bold">{selectedUser?.email}</span></p>
              
              <form onSubmit={handleUpdatePassword} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-textMuted font-black uppercase tracking-widest ml-1">New System Password</label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-brandPrimary transition-all"
                    required
                    placeholder="Enter new password..."
                  />
                </div>
                <div className="flex gap-4">
                    <button 
                        type="button"
                        onClick={() => setIsPasswordModalOpen(false)}
                        className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-textMuted font-bold rounded-xl transition-all"
                    >
                        CANCEL
                    </button>
                    <button 
                        type="submit" 
                        className="flex-1 py-4 bg-brandPrimary hover:bg-brandPrimaryHover text-darkBg font-black rounded-xl transition-all shadow-lg"
                    >
                        UPDATE
                    </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-[#121214] border border-red-500/20 rounded-3xl p-8 shadow-2xl"
            >
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                 <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-center">Irreversible Action</h3>
              <p className="text-sm text-textMuted text-center mb-8">
                Are you absolutely sure you want to delete <span className="text-white font-bold">{selectedUser?.email}</span>? 
                This will purge all transaction data associated with this account.
              </p>
              
              <div className="flex gap-4">
                <button 
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-textMuted font-bold rounded-xl transition-all"
                >
                    BACK
                </button>
                <button 
                    onClick={handleDeleteUser}
                    className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl transition-all shadow-lg shadow-red-600/20"
                >
                    PURGE USER
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
