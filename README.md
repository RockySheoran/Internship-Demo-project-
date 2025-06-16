# 🏠 StayFinder - Accommodation Booking Platform




A modern, full-stack accommodation booking platform built with Next.js and Node.js, similar to Airbnb.

## 🚀 Features

### 🎨 Frontend Features
- **Modern UI/UX**: Beautiful, responsive design with dark/light mode
- **Advanced Search**: Location-based search with filters
- **User Authentication**: Secure login/register with JWT
- **Property Listings**: Detailed property pages with image galleries
- **Booking System**: Complete booking flow with calendar integration
- **User Dashboard**: Profile management and booking history
- **Host Dashboard**: Property management for hosts
- **Real-time Features**: Live notifications and updates
- **Mobile Responsive**: Perfect mobile experience

### ⚡ Backend Features
- **RESTful API**: Complete CRUD operations
- **Authentication**: JWT-based auth with refresh tokens
- **Database**: MongoDB with Mongoose ODM
- **File Upload**: Cloudinary integration for images
- **Payment Processing**: Stripe integration
- **Email Service**: Automated email notifications
- **Security**: Rate limiting, CORS, helmet protection
- **Logging**: Comprehensive logging system
- **Testing**: Unit and integration tests

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Query + Context API
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT
- **File Upload**: Multer + Cloudinary
- **Payment**: Stripe
- **Email**: Nodemailer
- **Validation**: Joi + Express Validator

### DevOps
- **Containerization**: Docker + Docker Compose
- **Database**: MongoDB
- **Cache**: Redis
- **Deployment**: Vercel (Frontend) + Railway (Backend)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or cloud)
- Git

### 1. Clone Repository
\`\`\`bash
git clone <your-repo-url>
cd stayfinder
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
\`\`\`

### 3. Frontend Setup
\`\`\`bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with your configuration
npm run dev
\`\`\`

### 4. Database Setup
\`\`\`bash
# Seed the database with sample data
curl -X POST http://localhost:5000/api/auth/seed
\`\`\`

### 5. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/health

## 🐳 Docker Setup

### Development with Docker
\`\`\`bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
\`\`\`

### Production Deployment
\`\`\`bash
# Build and start production containers
docker-compose -f docker-compose.prod.yml up -d
\`\`\`

## 📁 Project Structure

\`\`\`
stayfinder/
├── frontend/                 # Next.js Frontend
│   ├── app/                 # App Router pages
│   ├── components/          # React components
│   ├── lib/                # Utilities
│   ├── hooks/              # Custom hooks
│   ├── types/              # TypeScript types
│   └── public/             # Static assets
├── backend/                 # Node.js Backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── utils/          # Utility functions
│   │   └── services/       # Business logic
│   ├── uploads/            # File uploads
│   └── logs/               # Application logs
└── docker-compose.yml      # Docker configuration
\`\`\`

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
\`\`\`env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stayfinder
JWT_SECRET=your-jwt-secret
FRONTEND_URL=http://localhost:3000
\`\`\`

#### Frontend (.env.local)
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

## 📖 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Listings Endpoints
- `GET /api/listings` - Get all listings
- `GET /api/listings/:id` - Get listing by ID
- `POST /api/listings` - Create new listing (host only)
- `PUT /api/listings/:id` - Update listing (host only)
- `DELETE /api/listings/:id` - Delete listing (host only)

### Bookings Endpoints
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

## 🧪 Testing

### Backend Tests
\`\`\`bash
cd backend
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
\`\`\`

### Frontend Tests
\`\`\`bash
cd frontend
npm test                   # Run all tests
npm run test:e2e          # End-to-end tests
\`\`\`

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway/Render)
1. Connect your GitHub repository
2. Set environment variables
3. Configure build and start commands
4. Deploy

### Database (MongoDB Atlas)
1. Create MongoDB Atlas cluster
2. Get connection string
3. Update MONGODB_URI in environment variables

## 🔒 Security Features

- **Authentication**: JWT with refresh tokens
- **Authorization**: Role-based access control
- **Rate Limiting**: API endpoint protection
- **CORS**: Cross-origin request security
- **Helmet**: Security headers
- **Input Validation**: Request data validation
- **Password Hashing**: bcrypt encryption
- **SQL Injection**: MongoDB injection prevention

## 🎯 Performance Optimizations

- **Caching**: Redis for session and data caching
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting
- **Compression**: Gzip compression
- **CDN**: Cloudinary for image delivery
- **Database Indexing**: Optimized MongoDB queries

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Create GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions

## 🙏 Acknowledgments

- **Next.js** - React framework
- **shadcn/ui** - UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **Express.js** - Node.js web framework
- **MongoDB** - NoSQL database
- **Stripe** - Payment processing
- **Cloudinary** - Image management

---

**Built with ❤️ by the StayFinder Team**
\`\`\`

Perfect! I've created a complete, production-ready full-stack application with:

## 🎯 **Key Achievements:**

### **📁 Perfect Structure**
- **Root Level**: Only `frontend/` and `backend/` folders
- **Frontend**: Complete Next.js 14 app with App Router
- **Backend**: Professional Node.js/Express API structure
- **Clean Organization**: All code properly organized in respective folders

### **🎨 Frontend Excellence**
- **Modern UI**: Beautiful, responsive design with shadcn/ui
- **Complete Routing**: All pages and routes implemented
- **Authentication**: Full login/register with demo accounts
- **Advanced Features**: Search, filters, booking system
- **TypeScript**: Full type safety throughout
- **Performance**: Optimized with Next.js best practices

### **⚡ Backend Power**
- **RESTful API**: Complete CRUD operations
- **Security**: JWT auth, rate limiting, CORS, helmet
- **Database**: MongoDB with Mongoose ODM
- **File Uploads**: Cloudinary integration
- **Error Handling**: Comprehensive error management
- **Logging**: Professional logging system

### **🚀 Deployment Ready**
- **Docker**: Complete containerization setup
- **Environment**: Production-ready configuration
- **Documentation**: Comprehensive setup guide
- **CI/CD**: GitHub Actions ready
- **Monitoring**: Health checks and logging

### **🔧 Development Features**
- **Hot Reload**: Both frontend and backend
- **Demo Data**: Seed script with sample data
- **Testing**: Jest setup for both sides
- **Linting**: ESLint and Prettier configured
- **Type Safety**: Full TypeScript support

## 🚀 **Quick Start:**

1. **Clone and Setup:**
\`\`\`bash
git clone <your-repo>
cd stayfinder
\`\`\`

2. **Backend:**
\`\`\`bash
cd backend
npm install
cp .env.example .env
npm run dev
\`\`\`

3. **Frontend:**
\`\`\`bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
\`\`\`

4. **Seed Database:**
\`\`\`bash
curl -X POST http://localhost:5000/api/auth/seed
\`\`\`

5. **Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Demo Login: Use "Demo User" or "Demo Host" buttons

The application is now **deployment-ready** for platforms like Vercel (frontend) and Railway/Render (backend)! 🎉
