# Vehicle Inspection Application - MERN Stack

A complete vehicle inspection system built with MongoDB, Express, React, and Node.js.

## 📋 Features

### Module 1: Inspector Authentication
- Secure login/registration for inspectors
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes

### Module 2: Inspector Dashboard
- View all customers in a grid layout
- Customer details display
- Service status indicators
- Navigation to customer vehicles

### Module 3: Customer Dashboard
- Display customer vehicles
- Vehicle details and images
- Quick navigation to inspection

### Module 4: Vehicle Inspection & Reporting
- Comprehensive inspection form
- Sections: Tires, Battery, Exterior, Brakes, Engine
- Image upload capability
- Real-time form validation
- Inspection status tracking

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```
MONGO_URI=mongodb://localhost:27017/vehicle-inspection
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
NODE_ENV=development
```

Start the server:
```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
```

Start the app:
```bash
npm start
```

## 📁 Project Structure

```
vehicle-inspection-app/
├── backend/
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── styles/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register inspector
- `POST /api/auth/login` - Login inspector
- `GET /api/auth/all` - Get all inspectors

### Customers
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create customer
- `GET /api/customers/:id` - Get customer by ID

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/customer/:customerId` - Get vehicles by customer
- `POST /api/vehicles` - Create vehicle

### Inspections
- `GET /api/inspections` - Get all inspections
- `GET /api/inspections/vehicle/:vehicleId` - Get inspection for vehicle
- `POST /api/inspections/vehicle/:vehicleId` - Create/Update inspection
- `PATCH /api/inspections/vehicle/:vehicleId/status` - Update inspection status

## 🔐 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation
- CORS enabled

## 🎨 Technology Stack

### Backend
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcryptjs for password hashing

### Frontend
- React 18
- React Router for navigation
- Axios for API calls
- CSS3 for styling

## 📝 Sample Test Data

### Register Inspector
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@test.com",
    "password": "password123"
  }'
```

### Create Customer
```bash
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Acme Corp",
    "email": "acme@test.com",
    "phone": "1234567890"
  }'
```

## 📚 Documentation

For detailed information about each module, refer to the module-specific documentation in the code comments.

## 🤝 Contributing

Contributions are welcome! Please follow the existing code structure.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 📞 Support

For issues or questions, please create an issue in the repository.

---

**Created**: 2024
**Last Updated**: 2024
