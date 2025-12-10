# Indus Pulse Warning System (IPWS)

A real-time flood monitoring dashboard for the Indus River basin using React, Deck.gl, and Apache ECharts.

## 🌊 Overview

The Indus Pulse Warning System is a comprehensive flood monitoring and early warning dashboard that visualizes water levels, risk zones, and evacuation routes along the Indus River in Pakistan.

## 🛠️ Tech Stack

- **React 18+** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Deck.gl** - WebGL-powered map visualization
- **Mapbox GL JS** - Base map tiles
- **Apache ECharts** - Data visualization and charts
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library
- **date-fns** - Date manipulation

## 📁 Project Structure

```
indus-pulse-dashboard/
├── public/
│   └── data/                  # GeoJSON and data files
│       ├── geojson/          # River, districts, villages
│       ├── dummy/            # Mock data
│       └── assets/           # Images, logos
├── src/
│   ├── components/
│   │   ├── map/              # Map components and layers
│   │   ├── dashboard/        # Dashboard UI components
│   │   ├── charts/           # ECharts components
│   │   └── common/           # Reusable components
│   ├── styles/
│   │   ├── custom/           # Custom styles (to be populated)
│   │   └── themes/           # Color and ECharts themes
│   ├── lib/                  # Utilities and configurations
│   ├── hooks/                # Custom React hooks
│   ├── types/                # TypeScript definitions
│   └── data/                 # Data generators and mock data
└── ...
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Mapbox access token (get one at https://account.mapbox.com/)

### Installation

1. **Clone or navigate to the project:**
   ```bash
   cd indus-pulse-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Mapbox token:
   ```
   VITE_MAPBOX_TOKEN=your_actual_mapbox_token_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   The app will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## 🎨 Customization

### Styling

The project is set up with **placeholder styles** that need to be customized based on your reference project:

1. **Tailwind Configuration** (`tailwind.config.js`)
   - Add custom colors, fonts, and theme extensions

2. **Custom CSS** (`src/styles/custom/`)
   - `variables.css` - CSS variables and color definitions
   - `components.css` - Component-specific styles
   - `utilities.css` - Custom utility classes

3. **ECharts Theme** (`src/styles/themes/echarts-theme.ts`)
   - Customize chart colors to match your design system

### Risk Tier Colors

Update the risk colors in `src/lib/constants.ts`:

```typescript
export const RISK_COLORS = {
  low: '#your-color',      // Yellow
  medium: '#your-color',   // Orange
  high: '#your-color',     // Dark Orange
  critical: '#your-color', // Red
}
```

## 📊 Features

### Map Visualization
- Interactive Deck.gl map with Mapbox base layers
- Multiple data layers (river, stations, villages, buffer zones)
- Real-time station monitoring
- Risk zone visualization

### Dashboard Components
- Alert summary cards
- Risk metrics overview
- Station list with status indicators
- Customizable sidebar navigation

### Charts & Analytics
- Water level time-series charts
- Multi-station trend comparisons
- Risk gauge indicators
- Heatmap visualizations
- All powered by Apache ECharts

### Data Management
- TypeScript interfaces for type safety
- Custom hooks for data fetching
- Mock data generators for development
- Modular data structure

## 🔧 Configuration Files

- `vite.config.ts` - Vite configuration with optimizations
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `.env.example` - Environment variables template

## 📝 TODO

- [ ] Add custom Tailwind theme from reference project
- [ ] Populate custom CSS files with reference styles
- [ ] Customize ECharts theme colors
- [ ] Add actual GeoJSON data files
- [ ] Integrate real-time data API
- [ ] Add authentication if needed
- [ ] Implement state management (Context API/Zustand)
- [ ] Add unit tests

## 🤝 Contributing

This is a custom project. Follow the established patterns when adding new features:

1. Use TypeScript for all new files
2. Follow the component structure in `src/components/`
3. Add types to `src/types/`
4. Use custom hooks for data fetching
5. Maintain consistent styling patterns

## 📄 License

Private project - All rights reserved

## 🆘 Support

For issues or questions, refer to the documentation in each component file.

---

**Built with ❤️ for flood monitoring and early warning**
