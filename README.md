# Strictly Desserts

A modern web application for dessert businesses to manage their sales, forecasts, and customer interactions.

## Features

- **Client Dashboard**
  - Sales forecasting with historical data visualization
  - Top products analytics
  - Detailed forecast data
  - Data upload capability
  - Product recommendations

- **Customer Portal**
  - Browse dessert categories
  - View special offers
  - Easy navigation and search

## Tech Stack

### Frontend
- **Next.js 14** - React framework for server-side rendering and routing
- **React** - UI library for building user interfaces
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Recharts** - React charting library for data visualization
- **Lucide React** - Icon library for UI elements

### Backend
- **Python Flask** - Web framework for API endpoints
- **Prophet** - Time series forecasting library
- **Pandas** - Data manipulation and analysis

## Prerequisites

- Node.js (v18 or higher)
- Python (v3.8 or higher)
- npm or yarn package manager

## Installation Steps

### 1. Clone the Repository
```bash
git clone <repository-url>
cd StrictlyDesserts
```

### 2. Install Frontend Dependencies
```bash
cd client
npm install
# or
yarn install
```

### 3. Install Backend Dependencies
```bash
cd ../server
pip install -r requirements.txt
```

### 4. Environment Setup

Create a `.env` file in the client directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 5. Start the Development Servers

#### Start the Backend Server
```bash
cd server
python app.py
```

#### Start the Frontend Server
```bash
cd client
npm run dev
# or
yarn dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
StrictlyDesserts/
├── client/                 # Frontend Next.js application
│   ├── app/               # Next.js app directory
│   │   ├── dashboard/     # Client dashboard pages
│   │   ├── customer/      # Customer portal pages
│   │   └── page.js        # Root page
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
│
└── server/                # Backend Flask application
    ├── app.py            # Main Flask application
    ├── requirements.txt  # Python dependencies
    └── data/            # Sample data and models
```

## Usage

1. **Client Dashboard**
   - Access the dashboard at http://localhost:3000/dashboard
   - Upload sales data in CSV format
   - View sales forecasts and analytics
   - Check product recommendations

2. **Customer Portal**
   - Access the customer portal at http://localhost:3000/customer
   - Browse dessert categories
   - View special offers

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@strictlydesserts.com or create an issue in the repository. 