# Quick Start: Using the New Components

## 🚀 Getting Started

### 1. Import Styles
Add to your main `main.tsx`:
```typescript
import '../styles/colors.css';
import '../styles/animations.css';
import '../styles/accessibility.css';
```

### 2. Import Components
```typescript
import HeroMetric from './components/dashboard/HeroMetric';
import AlertsSection from './components/dashboard/AlertsSection';
import ReceiptGallery from './components/gallery/ReceiptGallery';
import PredictiveInsights from './components/insights/PredictiveInsights';
import SmartRecommendations from './components/insights/SmartRecommendations';
import ChallengesSection from './components/challenges/ChallengesSection';
import PersonalityQuiz from './components/onboarding/PersonalityQuiz';
import ExportMenu from './components/export/ExportMenu';
```

---

## 📋 Common Use Cases

### Display Spending Metric
```typescript
<HeroMetric
  value={1234.56}
  label="Total Monthly Spending"
  comparison={{
    value: 15,
    trend: 'down',
    period: 'last month'
  }}
/>
```

### Show Budget Alerts
```typescript
const [alerts, setAlerts] = useState([
  {
    id: '1',
    type: 'warning',
    title: 'Budget Alert',
    message: 'You\'re 80% through your budget',
    action: 'View Details'
  }
]);

<AlertsSection
  alerts={alerts}
  onDismiss={(id) => setAlerts(alerts.filter(a => a.id !== id))}
/>
```

### Display Receipt Gallery
```typescript
const [receipts, setReceipts] = useState([
  { id: 1, merchant: 'Starbucks', amount: 5.50, date: '2024-03-12' },
  { id: 2, merchant: 'Whole Foods', amount: 45.23, date: '2024-03-11' }
]);

<ReceiptGallery
  receipts={receipts}
  onDelete={(id) => setReceipts(receipts.filter(r => r.id !== id))}
/>
```

### Show Predictive Insights
```typescript
const insights = [
  {
    id: '1',
    type: 'overspend',
    title: 'Budget Overspend Warning',
    message: 'At current rate, you\'ll exceed budget by $200',
    confidence: 'high',
    predictedDate: '2024-03-20',
    amount: 200
  }
];

<PredictiveInsights insights={insights} />
```

### Display Recommendations
```typescript
const recommendations = [
  {
    id: '1',
    title: 'Consolidate Subscriptions',
    description: 'You have 3 streaming services',
    potentialSavings: 50,
    category: 'Subscriptions'
  }
];

<SmartRecommendations
  recommendations={recommendations}
  onDismiss={(id) => console.log('Dismissed:', id)}
  onAccept={(id) => console.log('Accepted:', id)}
/>
```

### Show Challenges
```typescript
const challenges = [
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

<ChallengesSection
  challenges={challenges}
  onCreateChallenge={() => console.log('Create')}
  onJoinChallenge={(id) => console.log('Join:', id)}
/>
```

### Run Personality Quiz
```typescript
<PersonalityQuiz
  onComplete={(personality) => {
    console.log('User is a:', personality); // 'Saver' | 'Spender' | 'Investor'
    // Save to user preferences
  }}
/>
```

### Export Menu
```typescript
<ExportMenu
  onExportPDF={() => generatePDF()}
  onExportCSV={() => generateCSV()}
  onExportYearInReview={() => generateYearInReview()}
  onShareAchievement={() => shareToSocial()}
/>
```

---

## 🎨 Styling

### Use Color Variables
```css
.my-element {
  color: var(--color-success-primary); /* #00D4AA */
  background: var(--color-warning-primary); /* #FF6B35 */
  border-color: var(--color-premium-primary); /* #6B4CE6 */
}
```

### Apply Animations
```typescript
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Animated content
</motion.div>
```

### Use Glass Card Style
```typescript
<div className="glass-card p-6 rounded-lg border border-white/10">
  Content
</div>
```

---

## ♿ Accessibility

### Add ARIA Labels
```typescript
<button aria-label="Close menu">✕</button>
<div aria-live="polite" role="status">
  {dynamicContent}
</div>
```

### Keyboard Navigation
Components automatically support:
- `Tab` - Navigate
- `Shift+Tab` - Navigate backward
- `Enter` - Activate
- `Escape` - Close

### High Contrast Mode
```typescript
<div className={`${isHighContrast ? 'high-contrast' : ''}`}>
  Content
</div>
```

---

## 🔧 Customization

### Change Colors
Edit `frontend/src/styles/colors.css`:
```css
:root {
  --color-success-primary: #YOUR_COLOR;
  --color-warning-primary: #YOUR_COLOR;
  /* ... */
}
```

### Modify Animations
Edit `frontend/src/styles/animations.css`:
```css
@keyframes confetti-fall {
  /* Customize animation */
}
```

### Adjust Responsive Breakpoints
In component files, modify Tailwind classes:
```typescript
className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
```

---

## 🐛 Troubleshooting

### Components Not Showing
1. Check styles are imported
2. Verify component path
3. Check console for errors
4. Ensure Framer Motion is installed

### Animations Not Working
1. Check `prefers-reduced-motion` setting
2. Verify Framer Motion version
3. Check browser support
4. Disable animations in dev tools

### Styling Issues
1. Check Tailwind CSS is configured
2. Verify CSS variables are set
3. Check for CSS conflicts
4. Use browser dev tools to inspect

### Accessibility Issues
1. Test with keyboard navigation
2. Use screen reader (NVDA, JAWS)
3. Check color contrast with tool
4. Verify ARIA labels are present

---

## 📱 Responsive Design

All components are responsive:
- **Mobile**: 320px - 640px (2 columns)
- **Tablet**: 641px - 1024px (3 columns)
- **Desktop**: 1025px+ (4 columns)

Test with:
```bash
# Chrome DevTools
F12 → Toggle device toolbar (Ctrl+Shift+M)
```

---

## 🚀 Performance Tips

1. **Lazy Load Components**
```typescript
const ReceiptGallery = lazy(() => import('./gallery/ReceiptGallery'));
```

2. **Memoize Components**
```typescript
export default memo(HeroMetric);
```

3. **Optimize Images**
- Use WebP format
- Lazy load images
- Optimize thumbnails

4. **Monitor Performance**
```typescript
import { Profiler } from 'react';

<Profiler id="component" onRender={onRender}>
  <Component />
</Profiler>
```

---

## 📚 Documentation

- **Component Reference**: `COMPONENT_REFERENCE.md`
- **Implementation Progress**: `IMPLEMENTATION_PROGRESS.md`
- **Hackathon Summary**: `HACKATHON_IMPLEMENTATION_SUMMARY.md`
- **Component Files**: `frontend/src/components/`
- **Style Files**: `frontend/src/styles/`

---

## 🎯 Next Steps

1. ✅ Import components into Dashboard
2. ✅ Connect to backend APIs
3. ✅ Implement state management
4. ✅ Add error boundaries
5. ✅ Test on mobile
6. ✅ Run accessibility audit
7. ✅ Performance optimization
8. ✅ Deploy to production

---

## 💡 Pro Tips

1. **Use Context for State**
```typescript
const DashboardContext = createContext();

<DashboardContext.Provider value={dashboardData}>
  <Dashboard />
</DashboardContext.Provider>
```

2. **Handle Loading States**
```typescript
{isLoading ? <Skeleton /> : <Component />}
```

3. **Error Boundaries**
```typescript
<ErrorBoundary>
  <Component />
</ErrorBoundary>
```

4. **Debounce Search**
```typescript
const debouncedSearch = useMemo(
  () => debounce((query) => search(query), 300),
  []
);
```

---

## 🎉 You're Ready!

All components are production-ready. Start integrating them into your dashboard and watch the magic happen! ✨

For questions, check the component files for inline documentation or refer to the reference guides.

**Happy coding! 🚀**
