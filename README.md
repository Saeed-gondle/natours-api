# 🌿 Natours API

A complete Node.js RESTful API for a fictional tours company, built with Express, MongoDB, and Mongoose. This project demonstrates best practices in API design, authentication, security, server-side rendering, and comprehensive error handling.

> **📚 Learning Project**: This API is originally developed by [Jonas Schmedtmann](https://github.com/jonasschmedtmann) as part of his comprehensive Node.js course. This repository represents my learning journey and rebuilding of the API to master Node.js, Express, and MongoDB development concepts taught in Jonas's excellent course.

---

## 🚀 Features

### Core API Features
- **Tour Management**: CRUD operations, filtering, sorting, pagination, statistics, and monthly plans
- **User Authentication**: JWT-based signup, login, password reset, and role-based access control
- **Review System**: Nested reviews for tours with user/tour linking and aggregation
- **Advanced Filtering**: Price ranges, difficulty levels, ratings, and geospatial queries
- **File Upload**: User profile photos with image processing

### Web Application Features
- **Server-Side Rendered Views**: Pug templates for tour overview, details, and user account
- **Interactive UI**: Login/logout functionality, user settings, and tour booking interface
- **Responsive Design**: Mobile-friendly interface with modern CSS

### Security & Best Practices
- **Rate Limiting**: 100 requests per hour per IP
- **Data Sanitization**: NoSQL injection and XSS protection
- **HTTP Security Headers**: Helmet.js implementation
- **CORS**: Cross-Origin Resource Sharing enabled
- **Input Validation**: Comprehensive data validation with Mongoose
- **Error Handling**: Centralized error handling with development/production modes

---

## 📚 API Documentation

- **JSON API Docs**: [`/api/v1/docs`](http://localhost:3000/api/v1/docs)
- **Web Interface**: [`/`](http://localhost:3000/) - Interactive tour overview
- **Postman Collection**: Available in `/dev-data/` directory

All endpoints, authentication, request/response examples, and usage instructions are included.

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/natours-api.git
cd natours-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `config.env` file in the root directory with the following variables:

```env
NODE_ENV=development
PORT=3000

# Database Configuration
DATABASE=mongodb+srv://<username>:<password>@cluster.mongodb.net/natours?retryWrites=true&w=majority
DATABASE_PASSWORD=your_database_password

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_at_least_32_characters
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

# Email Configuration (for password reset)
EMAIL_FROM=noreply@natours.com

# Development vs Production
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=587
EMAIL_USERNAME=your_mailtrap_username
EMAIL_PASSWORD=your_mailtrap_password
```

### 4. Import Sample Data (Optional)

```bash
# Import development data
node dev-data/data/import-dev-data.js --import

# Delete all data
node dev-data/data/import-dev-data.js --delete
```

### 5. Run the Application

```bash
# Development mode (with nodemon)
npm run start:dev

# Production mode
npm start

# Watch for JS changes (Parcel bundler)
npm run watch:js
```

**Server URLs:**
- API Server: [http://localhost:3000](http://localhost:3000)
- Web Interface: [http://localhost:3000](http://localhost:3000)
- API Documentation: [http://localhost:3000/api/v1/docs](http://localhost:3000/api/v1/docs)

---

## 🧩 Project Structure

```
📁 natours-api/
├── 📂 controllers/          # Route handlers and business logic
│   ├── authController.js    # Authentication & authorization
│   ├── tourController.js    # Tour CRUD operations
│   ├── userController.js    # User management
│   ├── reviewController.js  # Review system
│   ├── viewController.js    # Server-side rendering
│   ├── errorController.js   # Global error handling
│   └── handleFactory.js     # DRY factory functions
├── 📂 models/               # Mongoose data models
│   ├── tourModel.js         # Tour schema & middleware
│   ├── userModel.js         # User schema & auth methods
│   └── reviewModel.js       # Review schema & validation
├── 📂 routes/               # Express route definitions
│   ├── tourRoutes.js        # Tour API endpoints
│   ├── userRoutes.js        # User API endpoints
│   ├── reviewRoutes.js      # Review API endpoints
│   └── viewRoutes.js        # Web page routes
├── 📂 utils/                # Utility functions & classes
│   ├── appError.js          # Custom error class
│   ├── catchAsync.js        # Async error wrapper
│   ├── apiFeatures.js       # Query filtering utilities
│   └── email.js             # Email sending functionality
├── 📂 Views/                # Pug templates for SSR
│   ├── base.pug             # Base template
│   ├── overview.pug         # Tours overview page
│   ├── tour.pug             # Tour details page
│   ├── login.pug            # Login form
│   ├── account.pug          # User account page
│   └── 📂 components/       # Reusable template components
├── 📂 public/               # Static assets
│   ├── 📂 css/              # Stylesheets
│   ├── 📂 js/               # Client-side JavaScript
│   └── 📂 img/              # Images & icons
├── 📂 dev-data/             # Development data & scripts
│   ├── 📂 data/             # Sample JSON data
│   └── 📂 img/              # Sample images
├── app.js                   # Express app configuration
├── server.js                # Application entry point
└── config.env               # Environment variables
```

---

## 🔑 Authentication & Roles

- Most endpoints require a JWT Bearer token
- Roles: `user`, `guide`, `lead-guide`, `admin`
- See docs for protected routes and required roles

---

## 📝 API Endpoints

### 🎯 Tours
```http
GET    /api/v1/tours                    # Get all tours (with filtering, sorting, pagination)
POST   /api/v1/tours                    # Create new tour (admin only)
GET    /api/v1/tours/:id                # Get tour by ID
PATCH  /api/v1/tours/:id                # Update tour (admin/lead-guide)
DELETE /api/v1/tours/:id                # Delete tour (admin/lead-guide)

# Special Routes
GET    /api/v1/tours/top-5-cheap        # Top 5 cheapest tours
GET    /api/v1/tours/tour-stats         # Aggregated tour statistics  
GET    /api/v1/tours/monthly-plan/:year # Monthly plan for specific year
GET    /api/v1/tours/tours-within/:distance/center/:latlng/unit/:unit # Geospatial queries
```

### 👤 Authentication & Users
```http
POST   /api/v1/users/signup             # Register new user
POST   /api/v1/users/login              # Login user
GET    /api/v1/users/logout             # Logout user
POST   /api/v1/users/forgotPassword     # Forgot password
PATCH  /api/v1/users/resetPassword/:token # Reset password

# Protected Routes
GET    /api/v1/users/me                 # Get current user
PATCH  /api/v1/users/updateMe           # Update user data
DELETE /api/v1/users/deleteMe           # Deactivate account
PATCH  /api/v1/users/updateMyPassword   # Change password

# Admin Only
GET    /api/v1/users                    # Get all users
GET    /api/v1/users/:id                # Get user by ID
PATCH  /api/v1/users/:id                # Update user
DELETE /api/v1/users/:id                # Delete user
```

### ⭐ Reviews
```http
GET    /api/v1/reviews                  # Get all reviews
POST   /api/v1/reviews                  # Create review (user only)
GET    /api/v1/reviews/:id              # Get review by ID
PATCH  /api/v1/reviews/:id              # Update review (author/admin)
DELETE /api/v1/reviews/:id              # Delete review (author/admin)

# Nested Routes
GET    /api/v1/tours/:tourId/reviews    # Get reviews for specific tour
POST   /api/v1/tours/:tourId/reviews    # Create review for specific tour
```

### 🌐 Web Pages (Server-Side Rendered)
```http
GET    /                               # Tours overview page
GET    /tour/:slug                     # Tour details page
GET    /login                          # Login page
GET    /me                             # User account page (protected)
```

---

## 🛡️ Security & Best Practices

### Security Features
- **Rate Limiting**: 100 requests per hour per IP address
- **Data Sanitization**: Protection against NoSQL injection attacks
- **XSS Protection**: Clean user input to prevent Cross-Site Scripting
- **HTTP Security Headers**: Helmet.js for secure HTTP headers
- **CORS**: Cross-Origin Resource Sharing properly configured
- **JWT Security**: Secure token generation and validation
- **Password Security**: Bcrypt hashing with salt rounds
- **Cookie Security**: HTTP-only cookies for token storage

### Best Practices Implemented
- **Error Handling**: Centralized error handling with custom AppError class
- **Async/Await**: Modern asynchronous JavaScript patterns
- **ES6 Modules**: Clean import/export syntax
- **Input Validation**: Comprehensive validation using Mongoose schemas
- **Factory Functions**: DRY principles with handleFactory
- **Middleware Architecture**: Modular and reusable middleware
- **Environment Configuration**: Separate development and production configs

---

## 🔧 Available Scripts

```bash
npm start              # Start production server
npm run start:dev      # Start development server with nodemon
npm run watch:js       # Watch and bundle JavaScript files with Parcel
npm run build:js       # Build JavaScript for production
npm run debug          # Start server in debug mode
```

---

## 🐛 Troubleshooting

### Common Issues

**1. Database Connection**
```bash
# Check if MongoDB URI is correct in config.env
# Ensure IP is whitelisted in MongoDB Atlas
# Verify database password is correct
```

**2. JWT Token Issues**
```bash
# Ensure JWT_SECRET is at least 32 characters
# Check JWT_EXPIRES_IN format (e.g., '90d', '24h')
# Clear browser cookies if authentication fails
```

**3. File Upload Issues**
```bash
# Check if upload directory exists: public/img/users/
# Verify multer configuration
# Ensure proper image formats (jpg, jpeg, png)
```

**4. CSS/JS Not Loading**
```bash
# Check if static files middleware is configured
# Verify file paths in base.pug template
# Run npm run watch:js for development
```

---

## 👨‍💻 Credits & Author

**Original Course & API Design**: [Jonas Schmedtmann](https://github.com/jonasschmedtmann) - The Complete Node.js Developer Course

**Learning Implementation**: [Muhammad Saeed](https://github.com/Saeed-gondle) - Rebuilt for learning purposes

> 🙏 **Special Thanks**: Huge appreciation to Jonas Schmedtmann for creating such an comprehensive and practical Node.js course. This project serves as a testament to the quality of his teaching and the depth of knowledge gained through his course.

---

## 🚀 Deployment

### Environment Setup
1. Set `NODE_ENV=production` in production environment
2. Use secure JWT secrets (at least 32 characters)
3. Configure production database
4. Set up email service (SendGrid, Mailgun, etc.)
5. Enable HTTPS and secure cookies

### Recommended Platforms
- **Heroku**: Easy deployment with automatic builds
- **Railway**: Modern deployment platform
- **DigitalOcean**: VPS with more control
- **AWS/Azure**: Enterprise-grade cloud hosting

---

## 📊 Features Showcase

### Advanced API Features
- **Query String Processing**: `?sort=-price&fields=name,duration`
- **Pagination**: `?page=2&limit=10`  
- **Filtering**: `?difficulty=easy&price[gte]=500`
- **Aggregation Pipeline**: Complex data analysis with MongoDB
- **Geospatial Queries**: Find tours within radius
- **File Upload**: Image processing with sharp

### Modern Development Practices
- **ES6+ Features**: Destructuring, template literals, arrow functions
- **Async/Await**: Clean asynchronous code
- **Error Boundaries**: Comprehensive error handling
- **Code Modularity**: Separation of concerns
- **RESTful Design**: Following REST principles

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support & Contact

If you have any questions about this learning project or need help understanding any concepts:

- **GitHub Issues**: [Create an issue](https://github.com/Saeed-gondle/natours-api/issues)
- **Email**: saeedgondle@gmail.com
- **LinkedIn**: [Muhammad Saeed](https://linkedin.com/in/saeed-gondle)

---

## 📄 License

This project is licensed under the ISC License.

---

## ⭐️ Star this repo if you found it useful!
