# Customization Checklist

## 📋 Quick Reference: What to Customize

This checklist shows exactly what needs to be customized with your reference project styles.

---

## 🎨 Styling Customization

### 1. Tailwind Configuration
**File:** `tailwind.config.js`

```javascript
// Current (default):
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom theme will be added here based on reference project
    },
  },
  plugins: [],
}

// TODO: Add your custom:
// - colors
// - fonts
// - spacing
// - borderRadius
// - shadows
// - animations
```

### 2. CSS Variables
**File:** `src/styles/custom/variables.css`

Current placeholders:
```css
:root {
  --color-primary: #3b82f6;
  --color-secondary: #64748b;
  --color-background: #0f172a;
  --color-foreground: #f8fafc;
  --color-border: #334155;
  
  --color-risk-low: #fbbf24;
  --color-risk-medium: #f97316;
  --color-risk-high: #ea580c;
  --color-risk-critical: #dc2626;
}
```

**TODO:** Replace with your exact color values

### 3. Component Styles
**File:** `src/styles/custom/components.css`

Currently has basic styles for:
- `.card`
- `.button`
- `.panel`
- `.sidebar`
- `.header`

**TODO:** Add your component-specific styles

### 4. Utility Classes
**File:** `src/styles/custom/utilities.css`

Currently has:
- `.text-gradient`
- `.glass-effect`
- `.custom-shadow`

**TODO:** Add your custom utility classes

### 5. Color Theme
**File:** `src/styles/themes/colors.css`

Currently has HSL color definitions.

**TODO:** Update with your hex color values

---

## 📊 Chart Customization

### 6. ECharts Theme
**File:** `src/styles/themes/echarts-theme.ts`

Current theme colors:
```typescript
color: [
  '#5470c6',
  '#91cc75',
  '#fac858',
  '#ee6666',
  '#73c0de',
  // ...
]
```

**TODO:** Update to match your design system

### 7. Risk Colors
**File:** `src/lib/constants.ts`

```typescript
export const RISK_COLORS = {
  low: '#fbbf24',      // Yellow
  medium: '#f97316',   // Orange
  high: '#ea580c',     // Dark Orange
  critical: '#dc2626', // Red
}
```

**TODO:** Replace with exact hex values from reference project

### 8. Chart Colors
**File:** `src/lib/constants.ts`

```typescript
export const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
}
```

**TODO:** Update to match your color scheme

---

## 🗺️ Map Configuration

### 9. Initial Viewport
**File:** `src/lib/constants.ts`

```typescript
export const INITIAL_VIEW_STATE = {
  longitude: 71.5,
  latitude: 30.0,
  zoom: 6,
  pitch: 0,
  bearing: 0,
}
```

**TODO:** Fine-tune coordinates for your exact area

### 10. Mapbox Style
**File:** `src/lib/constants.ts`

```typescript
export const MAPBOX_STYLE = 'mapbox://styles/mapbox/dark-v11';
```

**TODO:** Change to your preferred Mapbox style or custom style URL

---

## 🔧 Configuration Files

### 11. Environment Variables
**File:** `.env` (create from `.env.example`)

```
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

**TODO:** Add your actual Mapbox token

---

## 📝 Step-by-Step Customization Process

### Phase 1: Colors (Priority: HIGH)
1. ✅ Get color palette from reference project
2. ✅ Update `RISK_COLORS` in `src/lib/constants.ts`
3. ✅ Update `CHART_COLORS` in `src/lib/constants.ts`
4. ✅ Update CSS variables in `src/styles/custom/variables.css`
5. ✅ Update Tailwind colors in `tailwind.config.js`
6. ✅ Update ECharts theme colors in `src/styles/themes/echarts-theme.ts`

### Phase 2: Typography (Priority: MEDIUM)
1. ✅ Add custom fonts to `tailwind.config.js`
2. ✅ Update font families in CSS variables
3. ✅ Update ECharts font in `echarts-theme.ts`

### Phase 3: Component Styles (Priority: MEDIUM)
1. ✅ Copy component styles to `src/styles/custom/components.css`
2. ✅ Update individual component files if needed
3. ✅ Test all components

### Phase 4: Utilities (Priority: LOW)
1. ✅ Add custom utility classes to `src/styles/custom/utilities.css`
2. ✅ Add custom Tailwind utilities to `tailwind.config.js`

### Phase 5: Map & Data (Priority: HIGH)
1. ✅ Add Mapbox token to `.env`
2. ✅ Fine-tune initial viewport
3. ✅ Add GeoJSON files to `public/data/geojson/`
4. ✅ Connect to real data sources

---

## 🎯 Quick Wins

### Immediate Visual Impact
1. **Update Risk Colors** (5 minutes)
   - File: `src/lib/constants.ts`
   - Impact: All risk indicators, map markers, charts

2. **Update Primary Color** (2 minutes)
   - File: `src/styles/custom/variables.css`
   - Impact: Buttons, links, highlights

3. **Update Background Colors** (3 minutes)
   - File: `src/styles/custom/variables.css`
   - Impact: Overall dashboard appearance

### Medium Effort, High Impact
4. **Customize Tailwind Theme** (15 minutes)
   - File: `tailwind.config.js`
   - Impact: All components, consistent styling

5. **Update ECharts Theme** (10 minutes)
   - File: `src/styles/themes/echarts-theme.ts`
   - Impact: All charts match design system

---

## 🧪 Testing After Customization

After each customization phase, test:

1. **Visual Check**
   - ✅ Colors match reference project
   - ✅ Fonts render correctly
   - ✅ Spacing looks good
   - ✅ Components align properly

2. **Functionality Check**
   - ✅ All buttons clickable
   - ✅ Charts render
   - ✅ Map loads
   - ✅ No console errors

3. **Responsive Check**
   - ✅ Mobile view
   - ✅ Tablet view
   - ✅ Desktop view

4. **Build Check**
   ```bash
   npm run build
   ```
   - ✅ No errors
   - ✅ No warnings

---

## 📦 Files to Provide

Please provide the following from your reference project:

### Required
- [ ] Tailwind config (colors, fonts, theme)
- [ ] CSS variables file
- [ ] Risk tier colors (exact hex values)

### Optional but Recommended
- [ ] Component-specific CSS
- [ ] Custom utility classes
- [ ] Font files (if custom fonts)
- [ ] Logo/assets

---

## 🚀 Ready to Customize?

1. **Gather your reference project files**
2. **Follow the Phase 1 checklist above**
3. **Test after each change**
4. **Move to next phase**

---

## 💡 Tips

- **Start with colors** - Biggest visual impact
- **Test frequently** - Catch issues early
- **Use browser DevTools** - Inspect and tweak
- **Keep backups** - Git commit after each phase
- **Ask for help** - If something doesn't work

---

**Current Status:** ✅ All functionality working, ready for styling customization

**Next Step:** Provide your reference project's Tailwind config and color palette

