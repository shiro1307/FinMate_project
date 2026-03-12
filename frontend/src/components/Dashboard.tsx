import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import DataImport from './DataImport';
import ChatInterface from './ChatInterface';
import ManualTransactionForm from './ManualTransactionForm';
import HealthScore from './HealthScore';
import BudgetGoals from './BudgetGoals';
import Gamification from './Gamification';
import Insights from './Insights';
import { LogOut, LayoutDashboard, Settings, ArrowRight, TrendingDown, Target, Flame, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

type TabType = 'overview' | 'goals' | 'insights' | 'gamification';

export default function Dashboard() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [totalSpent, setTotalSpent] = useState(0);
  const [pieData, setPieData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [coffeeSlider, setCoffeeSlider] = useState(0);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/analytics', {
        headers: { Authorization: `Bearer ${auth?.token}` }
      });
      setTotalSpent(res.data.total_spent);
      setPieData(res.data.pie_data);
      setRecentTransactions(res.data.recent_transactions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Allow re-fetch manually if needed
  useEffect(() => {
    if (auth?.token) fetchAnalytics();
  }, [auth?.token]);

  if (!auth?.user || !auth?.token) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-mesh text-white p-6">
      {/* Top Navigation */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card flex items-center justify-between p-4 mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
            <LayoutDashboard className="text-white w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">FinMate</h1>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-sm text-gray-400 hidden sm:inline">
            Hello, <span className="text-white font-medium">{auth.user.full_name}</span>
          </span>
          <button className="text-gray-400 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </motion.nav>

      {/* Tab Navigation */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card p-2 mb-8 flex gap-2 overflow-x-auto"
      >
        {[
          { id: 'overview' as TabType, label: 'Overview', icon: LayoutDashboard },
          { id: 'goals' as TabType, label: 'Goals', icon: Target },
          { id: 'insights' as TabType, label: 'Insights', icon: Lightbulb },
          { id: 'gamification' as TabType, label: 'Gamification', icon: Flame }
        ].map(tab => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        key={activeTab}
      >
        {activeTab === 'overview' && (
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Overview */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
          >
            <div>
                <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">Total Monthly Spending</h2>
                <div className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent pb-2">
                ${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
            </div>
            
            {/* The Time Travel Simulator */}
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl w-full md:w-96">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium flex items-center gap-1.5"><TrendingDown className="w-4 h-4 text-emerald-400"/> Time Travel Simulator</span>
                    <span className="text-xs text-emerald-400 font-bold">+${(coffeeSlider * 5 * 30 * 12).toLocaleString()} / yr</span>
                </div>
                <p className="text-xs text-gray-400 mb-4">What if I cut out <strong>{coffeeSlider}</strong> daily $5 coffees?</p>
                <input 
                    type="range" 
                    min="0" max="5" 
                    value={coffeeSlider} 
                    onChange={(e) => setCoffeeSlider(Number(e.target.value))}
                    className="w-full accent-emerald-400"
                />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Charts */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6"
            >
                <h3 className="font-semibold mb-6 flex items-center justify-between">
                    Spending by Category
                    {loading && <div className="w-3 h-3 border-2 border-[--color-accent-blue] border-t-transparent rounded-full animate-spin"></div>}
                </h3>
                <div className="h-64">
                    {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={pieData} 
                                    cx="50%" cy="50%" 
                                    innerRadius={55} 
                                    outerRadius={80} 
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                                    labelLine={false}
                                >
                                    {pieData.map((_: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={['#00d4aa', '#4f8fe8', '#a78bfa', '#ff4d6d', '#f59e0b', '#06b6d4'][index % 6]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip 
                                    formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Amount']}
                                    contentStyle={{ backgroundColor: '#0d1220', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-[--color-text-muted] text-sm gap-2">
                            <span>No data yet.</span>
                            <button onClick={fetchAnalytics} className="border border-white/10 px-3 py-1 rounded-lg hover:bg-white/5 transition">Refresh</button>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Recent Transactions List */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6"
            >
                <h3 className="font-semibold mb-6 flex items-center justify-between">
                    Recent Activity
                    <button onClick={fetchAnalytics} className="text-xs text-[--color-accent-blue] hover:underline flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></button>
                </h3>
                <div className="space-y-4">
                    {recentTransactions.length > 0 ? recentTransactions.map((txn, i) => (
                        <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
                            <div>
                                <p className="font-medium text-sm">{txn.description}</p>
                                <p className="text-xs text-[--color-text-secondary] capitalize">{txn.category} • {new Date(txn.date).toLocaleDateString()}</p>
                            </div>
                            <div className="font-semibold">
                                ${txn.amount.toFixed(2)}
                            </div>
                        </div>
                    )) : (
                        <p className="text-center text-[--color-text-muted] text-sm italic mt-12">Waiting for first import...</p>
                    )}
                </div>
            </motion.div>
          </div>
        </div>

        {/* Right Col: Actions & Import & Chat */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <HealthScore totalSpent={totalSpent} />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <ManualTransactionForm onSuccess={fetchAnalytics} />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <DataImport onSuccess={fetchAnalytics} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
          >
            <ChatInterface />
          </motion.div>
        </div>
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="max-w-7xl mx-auto">
            <BudgetGoals />
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="max-w-7xl mx-auto">
            <Insights />
          </div>
        )}

        {activeTab === 'gamification' && (
          <div className="max-w-7xl mx-auto">
            <Gamification />
          </div>
        )}
      </motion.div>
    </div>
  );
}
