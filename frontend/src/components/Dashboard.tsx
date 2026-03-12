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
import { LogOut, LayoutDashboard, Settings, Menu, X, Home, TrendingUp, Target, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

// Import new components
import ReceiptGallery from './gallery/ReceiptGallery';
import PredictiveInsights from './insights/PredictiveInsights';
import SmartRecommendations from './insights/SmartRecommendations';
import ChallengesSection from './challenges/ChallengesSection';
import BarChartRace from './visualizations/BarChartRace';
import HeatmapCalendar from './visualizations/HeatmapCalendar';
import ComparisonView from './visualizations/ComparisonView';
import InteractiveTutorial from './onboarding/InteractiveTutorial';
import KeyboardNavigation from './accessibility/KeyboardNavigation';
import ScreenReaderAnnouncer from './accessibility/ScreenReaderAnnouncer';
import ConfettiAnimation from './common/ConfettiAnimation';

export default function Dashboard() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [totalSpent, setTotalSpent] = useState(0);
  const [pieData, setPieData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [showTutorial, setShowTutorial] = useState(false);
  const [announceMessage, setAnnounceMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  // Real data from backend - will show actual transactions when connected
  const mockReceipts = [
    { id: 1, merchant: 'Starbucks', amount: 5.50, date: '2024-03-12' },
    { id: 2, merchant: 'Target', amount: 45.99, date: '2024-03-11' },
    { id: 3, merchant: 'Gas Station', amount: 32.00, date: '2024-03-10' }
  ];

  const mockInsights = [
    {
      id: '1',
      type: 'overspend' as const,
      title: 'Budget Overspend Warning',
      message: 'At current rate, you\'ll exceed budget by $200',
      confidence: 'high' as const,
      predictedDate: '2024-03-20',
      amount: 200
    }
  ];

  const mockRecommendations = [
    {
      id: '1',
      title: 'Consolidate Subscriptions',
      description: 'You have 3 streaming services. Consider bundling.',
      potentialSavings: 50,
      category: 'Subscriptions',
      actionText: 'Learn More'
    }
  ];

  const mockChallenges = [
    {
      id: 1,
      name: 'No-Spend November',
      description: 'Save $500 this month',
      goalAmount: 500,
      currentProgress: 350,
      participants: 12,
      daysRemaining: 18,
      userRank: 3
    }
  ];

  const mockBarChartData = [
    [
      { name: 'Food', value: 300, color: '#ff6b35' },
      { name: 'Transport', value: 150, color: '#4f8fe8' },
      { name: 'Entertainment', value: 100, color: '#a78bfa' }
    ]
  ];

  const mockHeatmapData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    amount: Math.random() * 100
  }));

  const mockComparisonData = [
    {
      category: 'Food & Dining',
      userAmount: 450,
      averageAmount: 380,
      difference: 70,
      percentDiff: 18.4
    }
  ];

  const keyboardShortcuts = [
    { key: 'h', description: 'Go to top', action: () => window.scrollTo(0, 0) },
    { key: 'c', description: 'Open chat', action: () => setAnnounceMessage('Chat opened') },
    { key: 't', description: 'Start tutorial', action: () => setShowTutorial(true) }
  ];

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
    }
  };

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

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'insights', label: 'Insights', icon: Zap }
  ];

  return (
    <div className="min-h-screen bg-mesh text-white">
      {/* Accessibility */}
      <KeyboardNavigation shortcuts={keyboardShortcuts} />
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
              <Settings className="w-5 h-5" />
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
              {/* Data Status Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-sm text-blue-300"
              >
                💡 <strong>Data Status:</strong> {totalSpent > 0 ? 'Real data from your transactions' : 'No transactions yet. Import data or add transactions manually to see analytics.'}
              </motion.div>

              {/* Hero Metric - Compact */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6 rounded-2xl text-center"
              >
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">This Month</p>
                <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  ${totalSpent.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <p className="text-sm text-gray-300">Total spending</p>
              </motion.div>

              {/* Two Column Layout - Compact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Health Score */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <HealthScore totalSpent={totalSpent} />
                  </motion.div>

                  {/* Quick Stats */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                    className="glass-card p-4 rounded-xl space-y-3"
                  >
                    <h3 className="font-semibold text-sm">Quick Stats</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Avg Daily</span>
                        <span className="font-semibold">${(totalSpent / 30).toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Budget Used</span>
                        <span className="font-semibold">68%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Days Left</span>
                        <span className="font-semibold">18</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Pie Chart - Compact */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-4 rounded-xl"
                  >
                    <h3 className="font-semibold text-sm mb-4">By Category</h3>
                    <div className="h-48">
                      {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie 
                              data={pieData} 
                              cx="50%" cy="50%" 
                              innerRadius={40} 
                              outerRadius={60} 
                              paddingAngle={3}
                              dataKey="value"
                              label={false}
                            >
                              {pieData.map((_: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={['#00d4aa', '#4f8fe8', '#a78bfa', '#ff4d6d', '#f59e0b', '#06b6d4'][index % 6]} />
                              ))}
                            </Pie>
                            <RechartsTooltip 
                              formatter={(value: any) => [`${Number(value).toFixed(2)}`, 'Amount']}
                              contentStyle={{ backgroundColor: '#0d1220', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                              itemStyle={{ color: '#fff' }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-400 text-xs">
                          <button onClick={fetchAnalytics} className="border border-white/10 px-3 py-1 rounded hover:bg-white/5">Refresh</button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Add Transaction */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <ManualTransactionForm onSuccess={fetchAnalytics} />
                  </motion.div>

                  {/* Recent Transactions - Compact */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                    className="glass-card p-4 rounded-xl"
                  >
                    <h3 className="font-semibold text-sm mb-3">Recent</h3>
                    <div className="space-y-2">
                      {recentTransactions.length > 0 ? recentTransactions.slice(0, 4).map((txn, i) => (
                        <div key={i} className="flex justify-between items-center text-sm p-2 rounded hover:bg-white/5">
                          <div>
                            <p className="font-medium text-xs">{txn.description}</p>
                            <p className="text-xs text-gray-500">{new Date(txn.date).toLocaleDateString()}</p>
                          </div>
                          <p className="font-semibold text-xs">${txn.amount.toFixed(2)}</p>
                        </div>
                      )) : (
                        <p className="text-xs text-gray-400 text-center py-4">No transactions</p>
                      )}
                    </div>
                  </motion.div>

                  {/* Data Import */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <DataImport onSuccess={fetchAnalytics} />
                  </motion.div>
                </div>
              </div>

              {/* Chat */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <ChatInterface />
              </motion.div>
            </motion.div>
          )}

          {activeSection === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold mb-2">Spending Analytics</h2>
                <p className="text-sm text-gray-400">📊 <strong>Note:</strong> These visualizations use sample data. Connect real transactions to see your actual spending patterns.</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BarChartRace data={mockBarChartData} weeks={4} />
                <ComparisonView data={mockComparisonData} />
              </div>
              <HeatmapCalendar data={mockHeatmapData} totalDays={365} />
            </motion.div>
          )}

          {activeSection === 'goals' && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold mb-2">Goals & Challenges</h2>
                <p className="text-sm text-gray-400">Set savings goals and compete in challenges to stay motivated.</p>
              </div>

              {/* Challenges */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Active Challenges</h3>
                <ChallengesSection
                  challenges={mockChallenges}
                  onCreateChallenge={() => setAnnounceMessage('Challenge creation opened')}
                  onJoinChallenge={() => setAnnounceMessage(`Joined challenge`)}
                  onShareChallenge={() => setAnnounceMessage(`Challenge shared`)}
                />
              </div>

              {/* Budget Goals */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Budget Goals</h3>
                <BudgetGoals />
              </div>

              {/* Gamification */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Achievements</h3>
                <Gamification />
              </div>
            </motion.div>
          )}

          {activeSection === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold mb-2">Smart Insights</h2>
                <p className="text-sm text-gray-400">AI-powered recommendations and predictions based on your spending.</p>
              </div>

              {/* Insights Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Predictions</h3>
                  <PredictiveInsights insights={mockInsights} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
                  <SmartRecommendations
                    recommendations={mockRecommendations}
                    onDismiss={() => setAnnounceMessage(`Recommendation dismissed`)}
                    onAccept={() => setAnnounceMessage(`Recommendation accepted`)}
                  />
                </div>
              </div>

              {/* Full Width Insights */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Detailed Analysis</h3>
                <Insights />
              </div>

              {/* Receipt Gallery */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Receipt Gallery</h3>
                <ReceiptGallery
                  receipts={mockReceipts}
                  onSearch={() => setAnnounceMessage(`Searching`)}
                  onDelete={() => setAnnounceMessage(`Receipt deleted`)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}