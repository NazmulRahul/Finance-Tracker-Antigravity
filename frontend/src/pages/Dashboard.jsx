import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  LogOut, 
  History, 
  PieChart as PieIcon,
  BarChart3,
  Sun,
  Moon,
  Trash2,
  Edit2,
  X
} from 'lucide-react';
import { apiFetch } from '../utils/api';
import GlassCard from '../components/GlassCard';
import { BalanceHistoryChart, DistributionChart } from '../components/DashboardCharts';
import { formatCurrency } from '../utils/formatters';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('income');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  
  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editAmount, setEditAmount] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editType, setEditType] = useState('income');

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchTransactions();
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const fetchTransactions = async () => {
    try {
      const res = await apiFetch('/transactions');
      setTransactions(res.data);
    } catch (err) {
      if (err.message.includes('Not authorized')) {
        handleLogout();
      }
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!amount || !description) return;
    
    setLoading(true);
    try {
      setError('');
      await apiFetch('/transactions', {
        method: 'POST',
        body: JSON.stringify({ amount: Number(amount), type, description }),
      });
      setAmount('');
      setDescription('');
      fetchTransactions();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    
    try {
      await apiFetch(`/transactions/${id}`, { method: 'DELETE' });
      fetchTransactions();
    } catch (err) {
      alert(err.message);
    }
  };

  const openEditModal = (transaction) => {
    setEditingTransaction(transaction);
    setEditAmount(transaction.amount);
    setEditDescription(transaction.description);
    setEditType(transaction.type);
    setIsEditModalOpen(true);
  };

  const handleUpdateTransaction = async (e) => {
    e.preventDefault();
    try {
      await apiFetch(`/transactions/${editingTransaction._id}`, {
        method: 'PUT',
        body: JSON.stringify({ 
          amount: Number(editAmount), 
          description: editDescription, 
          type: editType 
        }),
      });
      setIsEditModalOpen(false);
      fetchTransactions();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-darkBg text-textMain p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex justify-between items-center bg-cardBg/50 p-4 rounded-3xl backdrop-blur-xl border border-borderDark/20 shadow-xl">
          <div>
            <h1 className="text-2xl md:text-3xl font-black italic bg-gradient-to-r from-brandPrimary to-income bg-clip-text text-transparent">
              FINANCE TRACKER
            </h1>
            <p className="text-textMuted text-xs md:text-sm font-medium">Wealth Insights for {user.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme}
              className="p-3 bg-white/5 border border-borderDark/30 rounded-2xl hover:bg-white/10 transition-all text-textMuted hover:text-brandPrimary"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-3 bg-expense/10 border border-expense/20 rounded-2xl hover:bg-expense text-expense hover:text-darkBg transition-all font-bold text-sm"
            >
              <LogOut size={18} />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-6 border-l-4 border-l-brandPrimary">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-textMuted text-sm font-medium">Available Balance</p>
                <h2 className="text-3xl font-black mt-1 leading-none">{formatCurrency(balance)}</h2>
              </div>
              <div className="p-3 bg-brandPrimary/10 rounded-2xl text-brandPrimary">
                <Wallet size={24} />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 border-l-4 border-l-income">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-textMuted text-sm font-medium">Total Income</p>
                <h2 className="text-3xl font-black mt-1 text-income leading-none">{formatCurrency(totalIncome)}</h2>
              </div>
              <div className="p-3 bg-income/10 rounded-2xl text-income">
                <TrendingUp size={24} />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 border-l-4 border-l-expense">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-textMuted text-sm font-medium">Total Expenses</p>
                <h2 className="text-3xl font-black mt-1 text-expense leading-none">{formatCurrency(totalExpense)}</h2>
              </div>
              <div className="p-3 bg-expense/10 rounded-2xl text-expense">
                <TrendingDown size={24} />
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart Area */}
          <div className="lg:col-span-2 space-y-8">
            <GlassCard className="p-6" delay={0.1}>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-brandPrimary/15 rounded-lg text-brandPrimary">
                    <BarChart3 size={18} />
                </div>
                <h3 className="text-lg font-bold">Balance Trend</h3>
              </div>
              <div className="h-[300px] w-full">
                <BalanceHistoryChart transactions={transactions} />
              </div>
            </GlassCard>

            {/* Recent Transactions */}
            <GlassCard className="p-6" delay={0.2}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-brandPrimary/15 rounded-lg text-brandPrimary">
                      <History size={18} />
                  </div>
                  <h3 className="text-lg font-bold">Transaction History</h3>
                </div>
              </div>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                  {transactions.length === 0 ? (
                    <div className="text-center py-12 bg-white/5 rounded-3xl border border-dashed border-borderDark/40">
                        <p className="text-textMuted">No transactions yet. Start by adding one!</p>
                    </div>
                  ) : (
                    transactions.map((t, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: idx * 0.05 }}
                        key={t._id} 
                        className="group flex justify-between items-center p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-borderDark/10"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${t.type === 'income' ? 'bg-income text-white' : 'bg-expense text-white shadow-lg shadow-expense/20'}`}>
                            {t.type === 'income' ? <Plus size={18} /> : <TrendingDown size={18} />}
                          </div>
                          <div>
                            <p className="font-bold text-sm md:text-base">{t.description}</p>
                            <p className="text-[10px] text-textMuted font-medium uppercase tracking-wider">{new Date(t.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                            <div className={`font-black text-right ${t.type === 'income' ? 'text-income' : 'text-expense'}`}>
                                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => openEditModal(t)}
                                    className="p-2 hover:bg-brandPrimary/20 hover:text-brandPrimary rounded-lg text-textMuted transition-all"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button 
                                    onClick={() => handleDeleteTransaction(t._id)}
                                    className="p-2 hover:bg-expense/20 hover:text-expense rounded-lg text-textMuted transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </GlassCard>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            {/* Add Transaction */}
            <GlassCard className="p-6" delay={0.15}>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-brandPrimary/15 rounded-lg text-brandPrimary">
                    <Plus size={18} />
                </div>
                <h3 className="text-lg font-bold">Add Funds</h3>
              </div>
              <form onSubmit={handleAddTransaction} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-textMuted font-bold ml-1">Details</label>
                  <input 
                    type="text" 
                    placeholder="E.g. Monthly Salary" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-4 rounded-xl border border-borderDark bg-black/10 text-textMain outline-none focus:border-brandPrimary transition-all placeholder:text-textMuted/40"
                  />
                </div>
                <div className="grid grid-cols-1 gap-5">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-textMuted font-bold ml-1">Amount</label>
                    <input 
                      type="number" 
                      placeholder="0.00" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full p-4 rounded-xl border border-borderDark bg-black/10 text-textMain outline-none focus:border-brandPrimary transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-textMuted font-bold ml-1">Transaction Type</label>
                    <div className="grid grid-cols-2 gap-2 bg-black/10 p-1 rounded-xl border border-borderDark">
                        <button 
                            type="button" 
                            onClick={() => setType('income')}
                            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${type === 'income' ? 'bg-income text-darkBg shadow-md' : 'text-textMuted hover:text-textMain'}`}
                        >
                            INCOME
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setType('expense')}
                            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${type === 'expense' ? 'bg-expense text-darkBg shadow-md' : 'text-textMuted hover:text-textMain'}`}
                        >
                            EXPENSE
                        </button>
                    </div>
                  </div>
                </div>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-4 bg-brandPrimary hover:bg-brandPrimaryHover text-darkBg font-black rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-brandPrimary/30 mt-2"
                >
                  {loading ? 'PROCESSING...' : 'RECORD ENTRY'}
                </button>
                {error && <p className="text-expense text-xs font-bold text-center mt-2">{error}</p>}
              </form>
            </GlassCard>

            {/* Distribution Chart */}
            <GlassCard className="p-6" delay={0.25}>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-brandPrimary/15 rounded-lg text-brandPrimary">
                    <PieIcon size={18} />
                </div>
                <h3 className="text-lg font-bold">Allocation</h3>
              </div>
              <div className="h-[250px] w-full">
                <DistributionChart transactions={transactions} />
              </div>
              <div className="flex justify-center gap-6 text-[10px] font-black uppercase tracking-widest">
                <div className="flex items-center gap-2 text-income">
                  <div className="w-3 h-3 bg-income rounded-full" />
                  <span>Credits</span>
                </div>
                <div className="flex items-center gap-2 text-expense">
                  <div className="w-3 h-3 bg-expense rounded-full" />
                  <span>Debits</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-darkBg border border-borderDark rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Edit Transaction</h3>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full text-textMuted hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleUpdateTransaction} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-xs text-textMuted font-bold uppercase ml-1">Description</label>
                  <input 
                    type="text" 
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full p-4 rounded-xl border border-borderDark bg-black/20 text-textMain outline-none focus:border-brandPrimary transition-all"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-textMuted font-bold uppercase ml-1">Amount</label>
                    <input 
                      type="number" 
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      className="w-full p-4 rounded-xl border border-borderDark bg-black/20 text-textMain outline-none focus:border-brandPrimary transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-textMuted font-bold uppercase ml-1">Type</label>
                    <select 
                      value={editType}
                      onChange={(e) => setEditType(e.target.value)}
                      className="w-full p-4 rounded-xl border border-borderDark bg-black/20 text-textMain outline-none focus:border-brandPrimary transition-all"
                    >
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="w-full py-4 bg-brandPrimary hover:bg-brandPrimaryHover text-darkBg font-black rounded-xl transition-all shadow-lg"
                >
                  SAVE CHANGES
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
