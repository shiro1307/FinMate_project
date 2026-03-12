import { motion } from 'framer-motion';

interface DayData {
  date: string;
  amount: number;
}

interface HeatmapCalendarProps {
  data: DayData[];
  totalDays?: number;
}

export default function HeatmapCalendar({ data, totalDays = 365 }: HeatmapCalendarProps) {
  const maxAmount = Math.max(...data.map(d => d.amount));
  
  const getIntensity = (amount: number) => {
    if (amount === 0) return 0;
    return Math.ceil((amount / maxAmount) * 4);
  };

  const getColor = (intensity: number) => {
    const colors = [
      'bg-gray-800',
      'bg-green-900/50',
      'bg-green-700/70',
      'bg-green-500/80',
      'bg-green-400'
    ];
    return colors[intensity] || colors[0];
  };

  // Generate grid for specified number of days
  const generateDays = () => {
    const daysList = [];
    const today = new Date();
    
    for (let i = totalDays - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayData = data.find(d => d.date === dateStr);
      const amount = dayData?.amount || 0;
      
      daysList.push({
        date: dateStr,
        amount,
        intensity: getIntensity(amount),
        day: date.getDay(),
        week: Math.floor(i / 7)
      });
    }
    
    return daysList;
  };

  const daysList = generateDays();
  const weeks = Math.ceil(daysList.length / 7);

  return (
    <div className="glass-card p-6 rounded-lg border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Spending Heatmap</h3>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className={`w-3 h-3 rounded-sm ${getColor(i)}`} />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="grid grid-cols-53 gap-1 min-w-max">
          {Array.from({ length: weeks }, (_, weekIndex) => (
            <div key={weekIndex} className="grid grid-rows-7 gap-1">
              {Array.from({ length: 7 }, (_, dayIndex) => {
                const dayData = daysList[weekIndex * 7 + dayIndex];
                if (!dayData) return <div key={dayIndex} className="w-3 h-3" />;
                
                return (
                  <motion.div
                    key={dayData.date}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: weekIndex * 0.01 }}
                    whileHover={{ scale: 1.2 }}
                    className={`w-3 h-3 rounded-sm cursor-pointer ${getColor(dayData.intensity)}`}
                    title={`${dayData.date}: $${dayData.amount.toFixed(2)}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-400">
        {data.length} days of spending data • Total: ${data.reduce((sum, d) => sum + d.amount, 0).toFixed(2)}
      </div>
    </div>
  );
}