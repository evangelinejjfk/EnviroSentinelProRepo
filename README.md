# EnviroSentinel Pro

A web-based environmental monitoring platform that tracks climate risks in real-time and helps communities prepare for disasters.

## What It Does

Climate Guardian monitors multiple environmental threats in one unified dashboard:

- **Wildfires** - Real-time satellite detection and fire spread prediction
- **Floods** - AI-powered predictions with 24-72 hour advance warning
- **Heat Islands** - Urban temperature monitoring and forecasting
- **Microplastics** - Water pollution mapping and tracking
- **Eco Routes** - Calculate environmentally friendly travel paths
- **Community Reports** - Crowdsourced environmental observations
- **Risk Correlation** - Understand how climate threats interact
- **Personal Impact** - Track your environmental footprint

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Setup

1. Clone the repository
```bash
git clone <repo-url>
cd project
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables (already set in `.env`)

4. Start development server
```bash
npm run dev
```

5. Build for production
```bash
npm run build
```

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Mapping**: Leaflet, React Leaflet
- **Charts**: Recharts
- **Backend**: Supabase (PostgreSQL)
- **Icons**: Lucide React

## Key Features

- Interactive real-time map with live alerts
- Multi-module environmental tracking
- Historical data analysis
- Location-based alerts
- Community crowdsourcing
- Responsive mobile-friendly design

## Database

Built on Supabase PostgreSQL with:
- Real-time alert storage
- Risk zone tracking
- Historical event logging
- User preferences and subscriptions
- Row Level Security (RLS) for data protection

## License

MIT
