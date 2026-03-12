import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, Zap, PieChart, ShieldCheck, Mic, Brain } from 'lucide-react';

const features = [
  {
    icon: Brain,
    color: '#00d4aa',
    title: 'Gemini AI Advisor',
    desc: 'Get personalized financial advice powered by Google Gemini. Ask anything in natural language.'
  },
  {
    icon: PieChart,
    color: '#4f8fe8',
    title: 'Spending Insights',
    desc: 'Beautiful charts break down your spending by category with real-time analysis.'
  },
  {
    icon: Zap,
    color: '#a78bfa',
    title: 'Receipt Scanning',
    desc: 'Snap a photo of any receipt and AI extracts the merchant, amount, and category instantly.'
  },
  {
    icon: Mic,
    color: '#f59e0b',
    title: 'Voice Input',
    desc: 'Talk to your financial assistant hands-free using the built-in voice dictation.'
  },
  {
    icon: ShieldCheck,
    color: '#00d4aa',
    title: 'Health Score',
    desc: 'Get a real-time financial wellness score based on your spending patterns.'
  },
  {
    icon: Wallet,
    color: '#ff4d6d',
    title: 'Action Engine',
    desc: 'Ask FinMate to draft cancellation emails, bill negotiations and more — it takes action for you.'
  }
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-mesh text-white overflow-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[--color-accent-green] to-[--color-accent-blue] flex items-center justify-center glow-green">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">FinMate</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm text-[--color-text-secondary] hover:text-white transition-colors">Sign In</Link>
          <Link to="/signup" className="btn-primary text-sm">Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-8 pt-24 pb-32 text-center relative">
        {/* Background blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[--color-accent-green] opacity-[0.07] blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-16 right-1/4 w-96 h-96 bg-[--color-accent-blue] opacity-[0.07] blur-[120px] rounded-full pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-[--color-text-secondary] mb-8">
            <Zap className="w-3 h-3 text-[--color-accent-green]" />
            Powered by Google Gemini AI
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6">
            Your finances,<br />
            <span className="gradient-text">finally understood.</span>
          </h1>
          <p className="text-xl text-[--color-text-secondary] max-w-2xl mx-auto mb-12 leading-relaxed">
            FinMate combines AI conversation, receipt scanning, and intelligent dashboards to give you a complete picture of your financial health — and the advice to improve it.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="btn-primary text-base px-8 py-3 h-12 flex items-center justify-center leading-none">
              Start for Free →
            </Link>
            <Link to="/login" className="px-8 py-3 rounded-xl border border-white/10 text-base hover:bg-white/5 transition-colors h-12 flex items-center justify-center leading-none">
              Already have an account
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-6xl mx-auto px-8 pb-32">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Everything you need to win financially</h2>
          <p className="text-[--color-text-secondary]">Built for a generation that deserves better financial tools.</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-6 hover:scale-[1.02] transition-transform duration-200"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: f.color + '22', border: `1px solid ${f.color}44` }}>
                <f.icon className="w-5 h-5" style={{ color: f.color }} />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-[--color-text-secondary] leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-3xl mx-auto px-8 pb-24 text-center">
        <div className="glass-card p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[--color-accent-green-glow] to-transparent pointer-events-none"></div>
          <Wallet className="w-12 h-12 text-[--color-accent-green] mx-auto mb-6 glow-green" />
          <h2 className="text-4xl font-bold mb-4">Ready to take control?</h2>
          <p className="text-[--color-text-secondary] mb-8">Join FinMate and let AI be your financial copilot.</p>
          <Link to="/signup" className="btn-primary text-base px-10 py-3 glow-green">
            Create Your Free Account →
          </Link>
        </div>
      </section>

      <footer className="text-center text-xs text-[--color-text-muted] pb-8">
        © 2026 FinMate · Built with Google Gemini AI · All rights reserved
      </footer>
    </div>
  );
}
