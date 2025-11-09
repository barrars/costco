# Fullstack App

A full-stack application with a Vite React frontend and an Express.js backend with MongoDB.

## Features

- React single-page application with routing (Home, About, Analytics)
- Express server with API endpoints
- MongoDB integration with analytics endpoints
- Modular architecture
- Interactive charts for data visualization

## Setup

1. Install dependencies for root, client, and server:

   ```bash
   npm install
   cd client && npm install
   cd ../server && npm install
   ```

2. Set up MongoDB:
   - Make sure MongoDB is running locally on port 27017, or set MONGO_URI in server/.env

3. Run the application:

   ```bash
   npm run dev
   ```

   This will start both the client (http://localhost:5173) and server (http://localhost:5000).

## Build for Production

1. Build the client:
   ```bash
   cd client && npm run build
   ```

2. Start the server:
   ```bash
   npm run start
   ```

The server will serve the built React app and handle API requests.

## API Endpoints

- GET /api/data - Get data from database
- POST /api/users - Create a new user

### Analytics Endpoints

- GET /api/analytics/spending-patterns - Spending patterns by receipt type
- GET /api/analytics/gas-analysis - Gas purchase analysis
- GET /api/analytics/top-categories - Top product categories
- GET /api/analytics/monthly-trends - Monthly spending trends
- GET /api/analytics/warehouse-tax - Warehouse preferences & tax analysis
- GET /api/analytics/savings - Savings analysis
- GET /api/analytics/shopping-times - Shopping time patterns
- GET /api/analytics/top-items - Item-level deep dive
- GET /api/analytics/payment-methods - Payment method analysis
- GET /api/data - Test endpoint (dev only)