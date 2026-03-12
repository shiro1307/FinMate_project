import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { AlertCircle, TrendingUp, Lightbulb, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Insights() {
  const auth = useContext(AuthContext);
  const [anomalies, setAnomalies] = useState<any>(null);
  const [weeklyDigest, setWeeklyDigest] = useState<any>(null);
  const [optimization, setOptimization] = useState('');
  const [trends, setTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth?.token) {
      fetchInsights();
    }
  }, [auth?.token]);

  const fetchInsights = async () => {
    try {
      const [anomRes, digestRes, optRes, trendsRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/insights/anomalies', {
          headers: { Authorization: `Bearer ${auth?.token}` }
        }),
        axios.get('http://127.0.0.1:8000/insights/weekly-digest', {
          headers: { Authorization: `Bearer ${auth?.token}` }
        }),
        axios.get('http://127.0.0.1:8000/insights/budget-optimization', {
          headers: { Authorization: `Bearer ${auth?.token}` }
        }),
        axios.get('http://127.0.0.1:8000/analytics/trends', {
          headers: { Authorization: `Bearer ${auth?.token}` }
        })
      ]);

      setAnomalies(anomRes.data);
      setWeeklyDigest(digestRes.data);
      setOptimization(optRes.data.suggestions);
      setTrends(trendsRes.data.trends);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="glass-card p-6 text-center">Loading insights...</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Weekly Digest */}
      {weeklyDigest && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20"
        >
          <div className="flex items-start gap-4">
            <div className="mt-1">
              <Calendar className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">{weeklyDigest.title}</h3>
              <p className="text-gray-300 mb-4">{weeklyDigest.summary}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-3 rounded">
                  <p className="text-xs text-gray-400">Total Spent</p>
                  <p className="text-2xl font-bold text-cyan-400">${weeklyDigest.total_spent}</p>
                </div>
                <div className="bg-white/5 p-3 rounded">
                  <p className="text-xs text-gray-400">Transactions</p>
                  <p className="text-2xl font-bold text-blue-400">{weeklyDigest.transaction_count}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Unusual Expenses */}
      {anomalies?.unusual_expenses && anomalies.unusual_expenses.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-400" /> Unusual Spending
          </h3>
          <div className="space-y-3">
            <AnimatePresence>
              {anomalies.unusual_expenses.map((expense: any, idx: number) => (
                <motion.div
                  key={expense.transaction_id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-lg hover:border-orange-500/40 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{expense.description}</p>
                      <p className="text-sm text-gray-400 mt-1">{expense.reason}</p>
                    </div>
                    <span className="font-bold text-orange-400">${expense.amount.toFixed(2)}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Budget Optimization Suggestions */}
      {optimization && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" /> Smart Suggestions
          </h3>
          <div className="space-y-2 text-gray-300 whitespace-pre-wrap text-sm">{optimization}</div>
        </motion.div>
      )}

      {/* Spending Trends */}
      {trends.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" /> 13-Week Trend
          </h3>
          <div className="space-y-2">
            {trends.map((trend, idx) => {
              const maxAmount = Math.max(...trends.map(t => t.amount)) || 1;
              const percentage = (trend.amount / maxAmount) * 100;
              return (
                <motion.div
                  key={idx}
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: '100%', opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-xs font-semibold text-gray-400 w-12">{trend.week}</span>
                  <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 rounded-full"
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-300 w-20 text-right">${trend.amount.toFixed(0)}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
