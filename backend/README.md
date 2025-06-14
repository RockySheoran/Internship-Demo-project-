# StayFinder Backend API

A robust Node.js/Express backend for the StayFinder application - an Airbnb-like platform for property rentals.

## 🚀 Features

- **Authentication**: JWT-based user authentication with role-based access
- **Listings Management**: Full CRUD operations for property listings
- **Booking System**: Complete booking management with availability checking
- **Review System**: User reviews and ratings for properties
- **File Upload**: Image upload for property listings
- **Search & Filters**: Advanced search with multiple filter options
- **Host Dashboard**: Management interface for property hosts

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Listings
- `GET /api/listings` - Get all listings (with filters)
- `GET /api/listings/:id` - Get single listing
- `POST /api/listings` - Create new listing (auth required)
- `PUT /api/listings/:id` - Update listing (host only)
- `DELETE /api/listings/:id` - Delete listing (host only)

### Bookings
- `POST /api/bookings` - Create booking (auth required)
- `GET /api/bookings` - Get user bookings (auth required)
- `GET /api/bookings/:id` - Get single booking (auth required)
- `PUT /api/bookings/:id` - Update booking status (auth required)

### Reviews
- `POST /api/reviews` - Create review (auth required)

### Host Dashboard
- `GET /api/host/listings` - Get host's listings (auth required)
- `GET /api/host/bookings` - Get bookings for host's properties (auth required)

### Development
- `POST /api/seed` - Seed database with sample data

## 🛠️ Installation

1. **Clone and setup**:
   \`\`\`bash
   cd backend
   npm install
   \`\`\`

2. **Environment Setup**:
   Create `.env` file with your MongoDB URI and JWT secret:
   \`\`\`
   MONGODB_URI=mongodb://localhost:27017/stayfinder
   JWT_SECRET=your-super-secret-key
   PORT=5000
   \`\`\`

3. **Start the server**:
   \`\`\`bash
   # Development
   npm run dev
   
   # Production
   npm start
   \`\`\`

4. **Seed Database** (optional):
   \`\`\`bash
   curl -X POST http://localhost:5000/api/seed
   \`\`\`

## 📊 Database Schema

### User Model
- Basic user information
- Role-based access (user/host/admin)
- Authentication fields

### Listing Model
- Property details and amenities
- Location with coordinates
- Host reference and pricing
- Images and availability

### Booking Model
- Reservation details
- Date ranges and guest count
- Payment and status tracking
- User and listing references

### Review Model
- Rating and comments
- User and listing references
- Timestamp tracking

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based authorization
- File upload validation
- CORS configuration
- Input validation and sanitization

## 📈 Performance Features

- Database indexing for fast queries
- Pagination for large datasets
- Optimized database queries
- Image compression and validation

## 🧪 Testing

The API includes sample data and endpoints for testing:

- Use `/api/seed` to populate test data
- Sample users: `john@example.com`, `jane@example.com` (password: `password123`)
- Multiple sample listings with different property types

## 🚀 Deployment

1. Set production environment variables
2. Use a production MongoDB instance
3. Configure proper CORS origins
4. Set up file storage (AWS S3, Cloudinary, etc.)
5. Add rate limiting and security headers

## 📝 API Usage Examples

**Register User**:
\`\`\`javascript
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
\`\`\`

**Create Listing**:
\`\`\`javascript
POST /api/listings
Headers: { "Authorization": "Bearer <token>" }
{
  "title": "Beautiful Beach House",
  "description": "Amazing oceanfront property...",
  "type": "House",
  "price": 200,
  "location": {
    "city": "Miami",
    "country": "USA"
  },
  "bedrooms": 3,
  "bathrooms": 2,
  "maxGuests": 6,
  "amenities": ["wifi", "pool", "parking"]
}
\`\`\`

**Search Listings**:
\`\`\`
GET /api/listings?location=Miami&guests=4&minPrice=100&maxPrice=300
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details
\`\`\`

Now let me add the enhanced frontend components:
