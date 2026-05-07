# Farmfura – Buyer Dashboard

A full-stack web application for customers to browse and order fresh vegetables.

## 🚀 Project Structure

```
farmfura-web/
├── backend/               # Node.js + Express Backend
│   ├── src/
│   │   ├── config/       # Database configuration
│   │   ├── models/       # MongoDB schemas (User, Product, Order)
│   │   ├── routes/       # API routes
│   │   ├── controllers/  # Business logic
│   │   ├── middleware/   # Auth middleware
│   │   └── index.js      # Main server file
│   ├── package.json
│   └── .env.example
│
└── frontend/              # React + Tailwind Frontend
    ├── public/
    ├── src/
    │   ├── components/   # Reusable UI components
    │   ├── pages/       # Page components
    │   ├── context/     # React context (Auth, Cart, Language)
    │   ├── hooks/       # Custom hooks
    │   ├── utils/       # API utilities
    │   ├── locales/     # Translations (EN, KN, HI)
    │   ├── styles/      # CSS & Tailwind
    │   ├── App.js
    │   └── index.js
    ├── package.json
    └── tailwind.config.js
```

## 🛠️ Setup Instructions

### Backend Setup

1. Navigate to backend folder:
   ```bash
   cd backend
   npm install
   ```

2. Create `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your MongoDB URI (if using local MongoDB):
   ```
   MONGODB_URI=mongodb://localhost:27017/farmfura
   JWT_SECRET=your_secret_key
   PORT=5000
   ```

4. Make sure MongoDB is running (or use MongoDB Atlas)

5. Start the server:
   ```bash
   npm run dev
   ```

6. Seed products (one-time):
   ```
   POST http://localhost:5000/api/seed-products
   ```

### Frontend Setup

1. Navigate to frontend folder:
   ```bash
   cd frontend
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Open `http://localhost:3000` in your browser

## 📱 Features

### Authentication
- Phone number + OTP login
- Mock OTP: Always `1234`
- JWT token-based session management

### Multi-Language Support
- English, Kannada, Hindi
- Language switcher in header
- Real-time UI translation

### Product Browsing
- Grid view with category filters
- Search functionality
- Stock status display

### Shopping Cart
- Add/remove items
- Adjust quantities
- Cart persistence with localStorage
- Sidebar cart view

### Checkout
- Address management (add/select)
- Delivery slot selection
- Multiple payment methods
- Order summary

### Order Tracking
- Real-time status updates
- Delivery partner information
- Order history
- Status timeline visualization

### User Profile
- Account information
- Address management
- Rewards system UI
- Logout functionality

## 🔌 API Endpoints

### Authentication
- `POST /auth/send-otp` - Send OTP to phone
- `POST /auth/verify-otp` - Verify OTP and login

### Products
- `GET /products` - Get all products with filters
- `GET /products/:id` - Get single product
- `POST /products` - Create product (admin)

### Orders
- `POST /orders` - Create new order
- `GET /orders/user/:userId` - Get user's orders
- `GET /orders/status/:orderId` - Get order status

### Users
- `GET /users/:id` - Get user profile
- `POST /users/:userId/address` - Add address
- `PUT /users/:id` - Update profile

## 🗄️ Database Models

### User
- Phone, name, email
- Addresses array
- OTP tracking for security

### Product
- Name with translations (EN, KN, HI)
- Price, unit (kg, bundle, piece)
- Category (leafy, roots, vegetables, herbs)
- Stock status

### Order
- User reference
- Items array with quantities
- Total and delivery fee
- Address and delivery slot
- Payment method
- Status (searching → assigned → on_the_way → delivered)

## 🎨 Technology Stack

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- React Icons
- Context API for state management

### Backend
- Node.js + Express
- MongoDB with Mongoose
- JWT for authentication
- CORS enabled

## 💡 Features Implemented

✅ Phone OTP Authentication
✅ Multi-language support (EN, KN, HI)
✅ Product browsing with filters
✅ Shopping cart with localStorage
✅ Checkout with address selection
✅ Order placement
✅ Order tracking with auto-updates
✅ User profile management
✅ Responsive design (mobile-first)
✅ Toast notifications
✅ Bottom navigation (mobile)
✅ Sticky header
✅ Mock delivery data

## 🚀 Deployment

### Backend (Node.js)
- Deploy to Heroku, Railway, or AWS
- Set environment variables
- Ensure MongoDB connection

### Frontend (React)
- Build: `npm run build`
- Deploy to Vercel, Netlify, or AWS S3

## 📝 Test Credentials

- **Phone**: Any 10-digit number
- **OTP**: `1234`
- **Mock API**: Returns real-like data with delays

## 🔐 Security Notes

- OTP stored in memory (use Redis for production)
- JWT tokens expire in 30 days
- CORS configured for development
- Input validation on both frontend and backend

## 📚 Additional Notes

- Cart data persists in localStorage
- Order status updates every 3 seconds
- Automatic status progression after order placement
- Responsive design tested on mobile, tablet, desktop
- All text supports multi-language translation

## 🤝 Contributing

Feel free to fork and improve this project!

---

**Happy Coding! 🥬🛒**
