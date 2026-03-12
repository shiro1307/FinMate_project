import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { API_URL } from '../apiConfig';
import DataImport from './DataImport';
import ManualTransactionForm from './ManualTransactionForm';
import { LogOut, LayoutDashboard, HelpCircle, Menu, X, Home, List, HeartPulse, TrendingUp, DollarSign, MessageCircle, Repeat } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import new components
import InteractiveTutorial from './onboarding/InteractiveTutorial';
import ScreenReaderAnnouncer from './accessibility/ScreenReaderAnnouncer';
import ConfettiAnimation from './common/ConfettiAnimation';
import TransactionsList from './TransactionsList';
import SubscriptionsSuspectsPanel from './SubscriptionsSuspectsPage';
import PredictionPanel from './PredictionPage';
import CoachPanel from './CoachPage';

export default function Dashboard() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [totalSpent, setTotalSpent] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [monthOffset, setMonthOffset] = useState<0 | -1>(0);
  const [overview, setOverview] = useState<any>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [announceMessage, setAnnounceMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  const fetchAnalytics = async () => {
    try {
      const [analyticsRes, overviewRes] = await Promise.all([
        axios.get(`${API_URL}/analytics`, {
          headers: { Authorization: `Bearer ${auth?.token}` }
        }),
        axios.get(`${API_URL}/analytics/overview`, {
          params: { month_offset: monthOffset },
          headers: { Authorization: `Bearer ${auth?.token}` }
        }),
      ]);
      
      setTotalSpent(analyticsRes.data.total_spent);
      setRecentTransactions(analyticsRes.data.recent_transactions);
      setOverview(overviewRes.data);
    } catch (err) {
      console.error('Analytics fetch failed:', err);
    }
  };

  useEffect(() => {
    if (auth?.token) fetchAnalytics();
  }, [auth?.token, monthOffset]);

  if (!auth?.user || !auth?.token) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'transactions', label: 'Transactions', icon: List },
    { id: 'subscriptions', label: 'Subscriptions', icon: Repeat },
    { id: 'prediction', label: 'Prediction', icon: DollarSign },
    { id: 'coach', label: 'Coach', icon: MessageCircle }
  ];

  return (
    <div className="min-h-screen bg-mesh text-white">
      {/* Accessibility */}
      <ScreenReaderAnnouncer message={announceMessage} />
      <ConfettiAnimation trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
      <InteractiveTutorial
        isVisible={showTutorial}
        onComplete={() => {
          setShowTutorial(false);
          setShowConfetti(true);
          setAnnounceMessage('Tutorial completed!');
        }}
        onSkip={() => setShowTutorial(false)}
      />

      {/* Sleek Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-40 glass-card border-b border-white/10 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
              <LayoutDashboard className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">FinMate</h1>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 hidden sm:inline">{auth.user.full_name}</span>
            <button 
              onClick={() => setShowTutorial(true)}
              className="text-gray-400 hover:text-white transition"
              aria-label="Help"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button 
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-400 transition"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/10 bg-white/5"
            >
              <div className="px-6 py-4 space-y-2">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                      activeSection === item.id
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeSection === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-sm text-blue-300"
                >
                  Focus: import transactions, then explore insights and trends.
                </motion.div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMonthOffset(0)}
                    className={`px-3 py-2 rounded-lg text-sm border transition ${
                      monthOffset === 0
                        ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-200'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    This month
                  </button>
                  <button
                    onClick={() => setMonthOffset(-1)}
                    className={`px-3 py-2 rounded-lg text-sm border transition ${
                      monthOffset === -1
                        ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-200'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    Last month
                  </button>
                </div>
              </div>

              {overview && (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <div className="glass-card p-5 rounded-xl border border-white/10 lg:col-span-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-gray-400">Financial Health Score</p>
                        <p className="text-3xl font-bold mt-1 flex items-center gap-2">
                          <HeartPulse className="w-5 h-5 text-cyan-300" />
                          {overview.health_score?.score ?? 0}/100
                        </p>
                        <p className="text-sm text-gray-400 mt-1">{overview.health_score?.label ?? '—'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Spent</p>
                        <p className="text-lg font-semibold">
                          {auth?.user?.currency_symbol || '$'}
                          {Number(overview.total_spent || 0).toFixed(0)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {overview.window?.start} → {overview.window?.end}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-4 gap-2">
                      {(overview.weekly || []).map((w: any) => (
                        <div key={w.start} className="bg-white/5 border border-white/10 rounded-lg p-2">
                          <p className="text-[10px] text-gray-400">{w.start.slice(5)}–{w.end.slice(5)}</p>
                          <p className="text-sm font-semibold">
                            {auth?.user?.currency_symbol || '$'}
                            {Number(w.total || 0).toFixed(0)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card p-5 rounded-xl border border-white/10">
                    <p className="text-xs text-gray-400">Biggest category</p>
                    <p className="text-lg font-semibold mt-1 capitalize">
                      {overview.takeaways?.biggest_category?.category ?? '—'}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {auth?.user?.currency_symbol || '$'}
                      {Number(overview.takeaways?.biggest_category?.amount || 0).toFixed(0)}
                    </p>
                  </div>

                  <div className="glass-card p-5 rounded-xl border border-white/10">
                    <p className="text-xs text-gray-400">Biggest merchant</p>
                    <p className="text-lg font-semibold mt-1 truncate">
                      {overview.takeaways?.biggest_merchant?.merchant ?? '—'}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {auth?.user?.currency_symbol || '$'}
                      {Number(overview.takeaways?.biggest_merchant?.amount || 0).toFixed(0)}
                    </p>
                  </div>

                  <div className="glass-card p-5 rounded-xl border border-white/10 lg:col-span-4">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <TrendingUp className="w-4 h-4 text-purple-300" />
                        <span>Spending vs last month</span>
                      </div>
                      <div className="text-sm font-semibold">
                        {auth?.user?.currency_symbol || '$'}
                        {Number(overview.delta_vs_last_month?.amount || 0).toFixed(0)}
                        {typeof overview.delta_vs_last_month?.percent === 'number' && (
                          <span className="text-gray-400 ml-2">
                            ({overview.delta_vs_last_month.percent > 0 ? '+' : ''}{overview.delta_vs_last_month.percent}%)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ManualTransactionForm onSuccess={fetchAnalytics} />
                <DataImport onSuccess={fetchAnalytics} />
              </div>

              <div className="glass-card p-4 rounded-xl">
                <h3 className="font-semibold text-sm mb-3">Recent charges</h3>
                <div className="space-y-2">
                  {recentTransactions.length > 0 ? recentTransactions.slice(0, 6).map((txn, i) => (
                    <div key={i} className="flex justify-between items-center text-sm p-2 rounded hover:bg-white/5">
                      <div className="min-w-0">
                        <p className="font-medium text-xs truncate">{txn.description}</p>
                        <p className="text-xs text-gray-500">{new Date(txn.date).toLocaleDateString()}</p>
                      </div>
                      <p className="font-semibold text-xs shrink-0">{auth?.user?.currency_symbol || '$'}{txn.amount.toFixed(2)}</p>
                    </div>
                  )) : (
                    <p className="text-xs text-gray-400 text-center py-4">No transactions</p>
                  )}
                </div>
                {totalSpent > 0 && (
                  <div className="mt-3 text-xs text-gray-500">
                    Total spending (all time): {auth?.user?.currency_symbol || '$'}{totalSpent.toFixed(0)}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeSection === 'transactions' && (
            <motion.div
              key="transactions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="mb-2 text-2xl font-bold">All Transactions</h2>
                <p className="text-sm text-gray-400">View, edit, and manage your transaction history.</p>
              </div>
              <TransactionsList />
            </motion.div>
          )}

          {activeSection === 'subscriptions' && (
            <motion.div
              key="subscriptions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <SubscriptionsSuspectsPanel />
            </motion.div>
          )}

          {activeSection === 'prediction' && (
            <motion.div
              key="prediction"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <PredictionPanel />
            </motion.div>
          )}

          {activeSection === 'coach' && (
            <motion.div
              key="coach"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <CoachPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}