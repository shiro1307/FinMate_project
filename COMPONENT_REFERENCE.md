# FinMate Hackathon Components - Quick Reference

## 🎨 Styling System

### Color Palette
```typescript
// Success (Savings/Wins)
--color-success-primary: #00D4AA
--color-success-secondary: #10B981

// Warning (Alerts/Urgency)
--color-warning-primary: #FF6B35
--color-warning-secondary: #FF8C42

// Premium (Features/Achievements)
--color-premium-primary: #6B4CE6
--color-premium-secondary: #8B5CF6

// Critical (Errors/Overspending)
--color-critical: #FF4D6D
```

### Import Styles
```typescript
import '../styles/colors.css';
import '../styles/animations.css';
import '../styles/accessibility.css';
```

---

## 📦 Components

### 1. HeroMetric
**Location**: `frontend/src/components/dashboard/HeroMetric.tsx`

**Usage**:
```typescript
<HeroMetric
  value={1234.56}
  label="Total Monthly Spending"
  comparison={{
    value: 15,
    trend: 'down', // down = good for spending
    period: 'last month'
  }}
  animate={true}
/>
```

**Props**:
- `value: number` - The main metric value
- `label: string` - Label text
- `comparison?: { value, trend, period }` - Optional comparison data
- `animate?: boolean` - Enable animations (default: true)

---

### 2. AlertsSection
**Location**: `frontend/src/components/dashboard/AlertsSection.tsx`

**Usage**:
```typescript
<AlertsSection
  alerts={[
    {
      id: '1',
      type: 'warning',
      title: 'Budget Alert',
      message: 'You\'re 80% through your budget',
      action: 'View Details'
    }
  ]}
  onDismiss={(id) => console.log('Dismissed:', id)}
/>
```

**Alert Types**: `'warning' | 'info' | 'success'`

---

### 3. ReceiptGallery
**Location**: `frontend/src/components/gallery/ReceiptGallery.tsx`

**Usage**:
```typescript
<ReceiptGallery
  receipts={[
    {
      id: 1,
      merchant: 'Starbucks',
      amount: 5.50,
      date: '2024-03-12'
    }
  ]}
  onSearch={(query) => console.log('Search:', query)}
  onDelete={(id) => console.log('Delete:', id)}
/>
```

**Features**:
- Grid layout (responsive: 2/3/4 columns)
- Search by merchant
- Sort by date or amount
- Lazy loading support

---

### 4. PredictiveInsights
**Location**: `frontend/src/components/insights/PredictiveInsights.tsx`

**Usage**:
```typescript
<PredictiveInsights
  insights={[
    {
      id: '1',
      type: 'overspend',
      title: 'Budget Overspend Warning',
      message: 'At current rate, you\'ll exceed budget by $200',
      confidence: 'high',
      predictedDate: '2024-03-20',
      amount: 200
    }
  ]}
/>
```

**Insight Types**: `'overspend' | 'pattern' | 'opportunity'`
**Confidence Levels**: `'high' | 'medium' | 'low'`

---

### 5. SmartRecommendations
**Location**: `frontend/src/components/insights/SmartRecommendations.tsx`

**Usage**:
```typescript
<SmartRecommendations
  recommendations={[
    {
      id: '1',
      title: 'Consolidate Subscriptions',
      description: 'You have 3 streaming services. Consider bundling.',
      potentialSavings: 50,
      category: 'Subscriptions',
      actionText: 'Learn More'
    }
  ]}
  onDismiss={(id) => console.log('Dismissed:', id)}
  onAccept={(id) => console.log('Accepted:', id)}
/>
```

**Features**:
- Ranked by potential savings
- Dismissible for 30 days
- Accept/Apply actions

---

### 6. ChallengesSection
**Location**: `frontend/src/components/challenges/ChallengesSection.tsx`

**Usage**:
```typescript
<ChallengesSection
  challenges={[
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
  ]}
  onCreateChallenge={() => console.log('Create')}
  onJoinChallenge={(id) => console.log('Join:', id)}
  onShareChallenge={(id) => console.log('Share:', id)}
/>
```

**Features**:
- Animated progress bars
- Participant tracking
- Rank display
- Share functionality

---

### 7. PersonalityQuiz
**Location**: `frontend/src/components/onboarding/PersonalityQuiz.tsx`

**Usage**:
```typescript
<PersonalityQuiz
  onComplete={(personality) => {
    console.log('Personality:', personality); // 'Saver' | 'Spender' | 'Investor'
  }}
/>
```

**Features**:
- 5 questions
- Progress bar
- Result modal
- Personality classification

---

### 8. ExportMenu
**Location**: `frontend/src/components/export/ExportMenu.tsx`

**Usage**:
```typescript
<ExportMenu
  onExportPDF={() => console.log('Export PDF')}
  onExportCSV={() => console.log('Export CSV')}
  onExportYearInReview={() => console.log('Year in Review')}
  onShareAchievement={() => console.log('Share')}
/>
```

**Export Options**:
- PDF Report
- CSV Export
- Year in Review
- Share Achievement

---

### 9. HeroSection (Landing)
**Location**: `frontend/src/components/landing/HeroSection.tsx`

**Features**:
- Animated gradient text
- CTA buttons
- Social proof
- Background animations

---

### 10. VideoPlaceholder (Landing)
**Location**: `frontend/src/components/landing/VideoPlaceholder.tsx`

**Features**:
- 16:9 aspect ratio
- Play button overlay
- Hover animations
- Placeholder content

---

### 11. FeatureShowcase (Landing)
**Location**: `frontend/src/components/landing/FeatureShowcase.tsx`

**Features**:
- 6 feature cards
- Icon animations
- Hover effects
- Responsive grid

---

### 12. SocialProof (Landing)
**Location**: `frontend/src/components/landing/SocialProof.tsx`

**Features**:
- Stats display
- Testimonial cards
- Star ratings
- Animated counters

---

## 🎬 Animation Keyframes

### Available Animations
```css
/* Confetti (3s) */
@keyframes confetti-fall

/* Shake (0.5s) */
@keyframes shake

/* Progress Fill (800ms) */
@keyframes progress-fill

/* Fade In (300ms) */
@keyframes fade-in

/* Slide Up (300ms) */
@keyframes slide-up

/* Pulse (2s) */
@keyframes pulse

/* Bounce (1s) */
@keyframes bounce
```

### Usage
```typescript
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>
```

---

## ♿ Accessibility Features

### Keyboard Navigation
- `Tab` - Navigate forward
- `Shift+Tab` - Navigate backward
- `Enter` - Activate button/link
- `Space` - Toggle checkbox
- `Escape` - Close modal

### ARIA Labels
```typescript
<button aria-label="Close menu">✕</button>
<div aria-live="polite" role="status">
  {dynamicContent}
</div>
```

### High Contrast Mode
```css
.high-contrast-mode {
  --color-text-primary: #000000;
  --color-bg-deepest: #FFFFFF;
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
  }
}
```

---

## 🎯 Usage Examples

### Complete Dashboard Section
```typescript
import HeroMetric from './dashboard/HeroMetric';
import AlertsSection from './dashboard/AlertsSection';
import ReceiptGallery from './gallery/ReceiptGallery';
import PredictiveInsights from './insights/PredictiveInsights';
import SmartRecommendations from './insights/SmartRecommendations';
import ChallengesSection from './challenges/ChallengesSection';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <HeroMetric value={1234.56} label="Total Spending" />
      <AlertsSection alerts={alerts} />
      <ChallengesSection challenges={challenges} />
      <PredictiveInsights insights={insights} />
      <SmartRecommendations recommendations={recommendations} />
      <ReceiptGallery receipts={receipts} />
    </div>
  );
}
```

---

## 📊 Component Statistics

| Component | Lines | Props | Animations |
|-----------|-------|-------|-----------|
| HeroMetric | 65 | 4 | 3 |
| AlertsSection | 70 | 2 | 2 |
| ReceiptGallery | 120 | 3 | 4 |
| PredictiveInsights | 95 | 1 | 2 |
| SmartRecommendations | 100 | 3 | 2 |
| ChallengesSection | 140 | 4 | 5 |
| PersonalityQuiz | 130 | 1 | 4 |
| ExportMenu | 110 | 4 | 3 |
| HeroSection | 95 | 0 | 5 |
| VideoPlaceholder | 85 | 0 | 3 |
| FeatureShowcase | 130 | 0 | 4 |
| SocialProof | 120 | 0 | 4 |

**Total**: ~1,240 lines of component code

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

3. **Optimize Animations**
   - Max 3 concurrent animations
   - Use `will-change` CSS property
   - Disable on low-end devices

4. **Image Optimization**
   - Use WebP with fallbacks
   - Lazy load images
   - Optimize thumbnails

---

## 🔗 Integration Checklist

- [ ] Import all style files in main.tsx
- [ ] Set up Context providers for state
- [ ] Connect to backend APIs
- [ ] Implement error boundaries
- [ ] Add loading states
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Verify color contrast ratios
- [ ] Test on mobile devices
- [ ] Performance audit

---

**Last Updated**: March 12, 2026
**Version**: 1.0.0
