# Pages Overview

Quick reference for the 4-page dashboard structure.

---

## 📄 Page 1: General Map

**File:** `src/pages/GeneralMapPage.tsx`

**Purpose:** Visualize the Indus River GeoJSON

**Features:**
- Full-screen map with river visualization
- Info panel (top right) with statistics
- Legend (bottom right)
- Clean, focused view

**Data Source:**
- `/public/data/geojson/indus-river.geojson`

**Customization Points:**
- River color: `RiverLayer.tsx` line 20-21
- Map center: `constants.ts` INITIAL_VIEW_STATE
- Info panel content: `GeneralMapPage.tsx` lines 66-86

---

## 📄 Page 2: Monitoring

**File:** `src/pages/MonitoringPage.tsx`

**Purpose:** Real-time station monitoring

**Features:**
- Alert summary (Critical/Warning/Info)
- Risk metrics (Population, Villages, Stations)
- Interactive map with stations and villages
- Stations list sidebar
- Water level chart (bottom panel)

**Data Source:**
- Mock data from `mockData.ts`

**Components Used:**
- AlertSummary
- RiskMetrics
- DeckGLMap
- StationsList
- WaterLevelChart
- BottomPanel

---

## 📄 Page 3: Analytics

**File:** `src/pages/AnalyticsPage.tsx`

**Purpose:** Data visualization and trend analysis

**Features:**
- 3 Risk gauge charts (Overall, North, South)
- Multi-station trend chart
- Station comparison bar chart
- Risk heatmap over time
- Scrollable dashboard layout

**Charts:**
- RiskGauge (x3)
- TrendChart
- ComparisonChart
- HeatmapChart

---

## 📄 Page 4: Alerts

**File:** `src/pages/AlertsPage.tsx`

**Purpose:** Manage active alerts and warnings

**Features:**
- Alert statistics (Critical/Warning/Info counts)
- Detailed alert list
- Time-based sorting (newest first)
- Acknowledgment system
- Color-coded by severity

**Alert Types:**
- 🔴 Critical (red)
- 🟠 Warning (orange)
- 🔵 Info (blue)

---

## 🧭 Navigation Component

**File:** `src/components/layout/PageNavigation.tsx`

**Location:** Fixed at left bottom corner

**Pages:**
1. 📍 General Map (Map icon)
2. 📊 Monitoring (Activity icon)
3. 📈 Analytics (BarChart3 icon)
4. ⚠️ Alerts (AlertTriangle icon)

**Styling:**
- Active page: Blue background (#3B82F6)
- Inactive: Gray text
- Hover: Gray background
- Icons from Lucide React

---

## 🎨 Styling Guide

### Colors
- **Background:** `bg-gray-950` (main), `bg-gray-900` (cards)
- **Text:** `text-white` (primary), `text-gray-400` (secondary)
- **Borders:** `border-gray-800`
- **Active:** `bg-blue-600` (navigation)

### Layout
- **Header:** Fixed top, full width
- **Main Content:** Flex-1, overflow hidden
- **Navigation:** Fixed left bottom

### Spacing
- **Page padding:** `p-6`
- **Card padding:** `p-4` or `p-6`
- **Gap between elements:** `gap-4` or `gap-6`

---

## 🔄 Page Switching Logic

**File:** `src/App.tsx`

```typescript
const [currentPage, setCurrentPage] = useState<PageType>('general-map');

const renderPage = () => {
  switch (currentPage) {
    case 'general-map': return <GeneralMapPage />;
    case 'monitoring': return <MonitoringPage />;
    case 'analytics': return <AnalyticsPage />;
    case 'alerts': return <AlertsPage />;
  }
};
```

**Default Page:** `general-map`

---

## 📝 Quick Edit Guide

### To Change Default Page
**File:** `src/App.tsx` line 12
```typescript
const [currentPage, setCurrentPage] = useState<PageType>('general-map');
//                                                          ↑ Change this
```

### To Add a New Page
1. Create `src/pages/YourPage.tsx`
2. Add page type to `PageNavigation.tsx`
3. Add case to `App.tsx` renderPage()
4. Add button to navigation array

### To Modify River Appearance
**File:** `src/components/map/layers/RiverLayer.tsx`
- Line 20: `getFillColor` - River fill color
- Line 21: `getLineColor` - River outline color
- Line 18: `lineWidthMinPixels` - Line thickness

### To Change Map Center
**File:** `src/lib/constants.ts`
```typescript
export const INITIAL_VIEW_STATE = {
  longitude: 72.5,  // ← East/West
  latitude: 30.5,   // ← North/South
  zoom: 5.5,        // ← Zoom level
};
```

---

## 🎯 Page-Specific Notes

### General Map
- Loads GeoJSON asynchronously
- Shows loading spinner while loading
- Error handling for failed loads
- Info panel data is static (can be made dynamic)

### Monitoring
- Uses mock data (replace with real API)
- Station click updates selected station
- Chart shows last 3 data points
- Sidebar scrollable for many stations

### Analytics
- All charts use sample data
- Scrollable page for more content
- Responsive grid layout
- Charts auto-resize

### Alerts
- Generates alerts from station risk levels
- Sorts by timestamp (newest first)
- Acknowledgment state tracked
- Color-coded severity

---

## 🚀 Performance Tips

1. **General Map:** Large GeoJSON may be slow
   - Consider simplifying geometry
   - Use GeoJSON-VT for tiling
   - Add loading states

2. **Monitoring:** Many stations may slow map
   - Implement clustering
   - Add layer visibility toggles
   - Lazy load station details

3. **Analytics:** Many charts may impact performance
   - Lazy load charts
   - Debounce data updates
   - Use chart loading states

4. **Alerts:** Long alert list may scroll slowly
   - Implement pagination
   - Virtual scrolling for 100+ alerts
   - Filter/search functionality

---

## 📱 Responsive Considerations

### Current Breakpoints
- Mobile: `< 640px`
- Tablet: `640px - 1024px`
- Desktop: `> 1024px`

### Mobile Optimizations Needed
- [ ] Navigation: Convert to bottom tab bar
- [ ] Monitoring: Stack map and sidebar
- [ ] Analytics: Single column layout
- [ ] Alerts: Compact card view

---

## 🔗 File Dependencies

```
App.tsx
├── GeneralMapPage.tsx
│   ├── DeckGLMap.tsx
│   └── RiverLayer.tsx
├── MonitoringPage.tsx
│   ├── AlertSummary.tsx
│   ├── RiskMetrics.tsx
│   ├── DeckGLMap.tsx
│   ├── StationsList.tsx
│   └── WaterLevelChart.tsx
├── AnalyticsPage.tsx
│   ├── RiskGauge.tsx
│   ├── TrendChart.tsx
│   ├── ComparisonChart.tsx
│   └── HeatmapChart.tsx
├── AlertsPage.tsx
└── PageNavigation.tsx
```

---

**Quick Start:** Open http://localhost:3000/ and click the navigation buttons in the left bottom corner!

