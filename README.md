# 🏠 StayFinder - Complete Booking Platform

A modern, full-stack accommodation booking platform built with Next.js 14 and Node.js. Features include user authentication, property listings, booking management, reviews, and more.

## ✨ Features

### 🎯 Core Features
- **User Authentication** - JWT-based auth with role management
- **Property Listings** - Advanced search and filtering
- **Booking System** - Complete reservation management
- **Review System** - User ratings and feedback
- **Host Dashboard** - Property and booking management
- **Real-time Notifications** - Live updates and alerts
- **Payment Integration** - Stripe payment processing
- **File Upload** - Image handling with Cloudinary
- **Email System** - Automated notifications

### 🚀 Technical Features
- **Next.js 14** - App Router with Server Components
- **TypeScript** - Full type safety
- **Tailwind CSS** - Modern responsive design
- **Framer Motion** - Smooth animations
- **React Query** - Data fetching and caching
- **MongoDB** - Flexible document database
- **Redis** - Caching and session management
- **Docker** - Containerized deployment
- **Nginx** - Reverse proxy and load balancing

## 🏗️ Architecture

\`\`\`
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (Express)     │◄──►│   (MongoDB)     │
│   Port: 3000    │    │   Port: 5000    │    │   Port: 27017   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────►│     Redis       │◄─────────────┘
                        │   (Cache)       │
                        │   Port: 6379    │
                        └─────────────────┘
\`\`\`

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB 7.0+
- Redis 7.0+
- npm or yarn

### 1. Clone Repository
\`\`\`bash
git clone https://github.com/your-username/stayfinder.git
cd stayfinder
\`\`\`

### 2. Environment Setup
\`\`\`bash
# Copy environment template
cp .env.example .env

# Update .env with your configuration
\`\`\`

### 3. Backend Setup
\`\`\`bash
cd backend
npm install
npm run dev
\`\`\`

### 4. Frontend Setup
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

### 5. Database Seeding
\`\`\`bash
# Seed with sample data
curl -X POST http://localhost:5000/api/auth/seed
\`\`\`

## 🐳 Docker Deployment

### Development
\`\`\`bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
\`\`\`

### Production
\`\`\`bash
# Build and start production containers
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose up -d --scale backend=3
\`\`\`

## 📁 Project Structure

\`\`\`
stayfinder/
├── frontend/                 # Next.js Frontend
│   ├── app/                 # App Router pages
│   ├── components/          # Reusable components
│   ├── lib/                # Utilities
│   ├── hooks/              # Custom hooks
│   ├── types/              # TypeScript types
│   └── public/             # Static assets
├── backend/                 # Express.js Backend
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── utils/             # Helper functions
│   └── config/            # Configuration
├── docker-compose.yml      # Docker configuration
└── README.md              # Documentation
\`\`\`

## 🔧 API Endpoints

### Authentication
\`\`\`
POST   /api/auth/register     # User registration
POST   /api/auth/login        # User login
GET    /api/auth/me          # Get current user
PUT    /api/auth/profile     # Update profile
POST   /api/auth/logout      # User logout
\`\`\`

### Listings
\`\`\`
GET    /api/listings         # Get all listings
GET    /api/listings/:id     # Get single listing
POST   /api/listings        # Create listing (host)
PUT    /api/listings/:id     # Update listing (host)
DELETE /api/listings/:id     # Delete listing (host)
\`\`\`

### Bookings
\`\`\`
GET    /api/bookings         # Get user bookings
POST   /api/bookings        # Create booking
GET    /api/bookings/:id     # Get single booking
PUT    /api/bookings/:id     # Update booking status
\`\`\`

### Reviews
\`\`\`
GET    /api/reviews          # Get reviews
POST   /api/reviews         # Create review
PUT    /api/reviews/:id      # Update review
DELETE /api/reviews/:id      # Delete review
\`\`\`

## 🎨 UI Components

### Design System
- **Colors** - Blue to purple gradient theme
- **Typography** - Inter and Poppins fonts
- **Components** - shadcn/ui component library
- **Icons** - Lucide React icons
- **Animations** - Framer Motion

### Key Components
- `Header` - Navigation with auth
- `SearchBar` - Advanced property search
- `PropertyCard` - Listing display
- `BookingForm` - Reservation interface
- `UserProfile` - Account management
- `HostDashboard` - Property management

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt encryption
- **Rate Limiting** - API request throttling
- **Input Validation** - express-validator
- **CORS Protection** - Cross-origin security
- **Helmet.js** - Security headers
- **SQL Injection Prevention** - MongoDB ODM
- **XSS Protection** - Input sanitization

## 📊 Performance

- **Server-Side Rendering** - Next.js SSR
- **Image Optimization** - Next.js Image component
- **Code Splitting** - Automatic bundle splitting
- **Caching** - Redis for session/data caching
- **CDN** - Cloudinary for media delivery
- **Database Indexing** - Optimized queries
- **Compression** - Gzip response compression

## 🧪 Testing

\`\`\`bash
# Backend tests
cd backend
npm test
npm run test:coverage

# Frontend tests
cd frontend
npm test
npm run test:e2e
\`\`\`

## 📈 Monitoring

- **Health Checks** - `/health` endpoint
- **Logging** - Morgan + Winston
- **Error Tracking** - Sentry integration
- **Analytics** - Google Analytics
- **Performance** - Web Vitals monitoring

## 🚀 Deployment

### Vercel (Frontend)
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel --prod
\`\`\`

### Railway/Heroku (Backend)
\`\`\`bash
# Deploy to Railway
railway login
railway link
railway up

# Deploy to Heroku
heroku create stayfinder-api
git push heroku main
\`\`\`

### AWS/DigitalOcean (Full Stack)
\`\`\`bash
# Use Docker Compose
docker-compose -f docker-compose.prod.yml up -d
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Express.js](https://expressjs.com/) - Node.js framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Vercel](https://vercel.com/) - Deployment platform

## 📞 Support

- 📧 Email: support@stayfinder.com
- 💬 Discord: [Join our community](https://discord.gg/stayfinder)
- 📖 Docs: [Documentation](https://docs.stayfinder.com)
- 🐛 Issues: [GitHub Issues](https://github.com/stayfinder/issues)

---

**Built with ❤️ by the StayFinder Team**
\`\`\`

This is a complete, production-ready full-stack application with:

## 🎯 **Key Features:**

### **Frontend Excellence:**
- **Next.js 14** with App Router
- **Beautiful UI** with Tailwind CSS and shadcn/ui
- **Smooth animations** with Framer Motion
- **Perfect responsive design**
- **Advanced authentication** with role management
- **Real-time features** with React Query
- **Type-safe** with TypeScript

### **Backend Robustness:**
- **Express.js** with comprehensive middleware
- **MongoDB** with optimized schemas
- **JWT authentication** with refresh tokens
- **File upload** with Multer/Cloudinary
- **Rate limiting** and security
- **Comprehensive API** with validation
- **Error handling** and logging

### **DevOps Ready:**
- **Docker** containerization
- **Docker Compose** for development
- **Environment configuration**
- **Health checks** and monitoring
- **Production optimizations**
- **Deployment guides** for multiple platforms

### **Perfect Integration:**
- **Seamless frontend-backend communication**
- **Proper error handling**
- **Loading states** and user feedback
- **Responsive design** for all devices
- **SEO optimized**
- **Performance optimized**

## 🚀 **Deployment Ready:**

1. **Development:** `docker-compose up -d`
2. **Frontend:** Deploy to Vercel
3. **Backend:** Deploy to Railway/Heroku
4. **Database:** MongoDB Atlas
5. **Full Stack:** AWS/DigitalOcean with Docker

This is a complete, scalable, and maintainable application ready for production deployment! 🎉
