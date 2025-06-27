# 🌿 Natours API

A complete Node.js RESTful API for a fictional tours company, built with Express, MongoDB, and Mongoose. This project demonstrates best practices in API design, authentication, security, and documentation.

---

## 🚀 Features

- **Tour Management**: CRUD operations, filtering, sorting, pagination, statistics, and monthly plans
- **User Authentication**: JWT-based signup, login, password reset, and role-based access control
- **Review System**: Nested reviews for tours, with user/tour linking
- **Security**: Rate limiting, data sanitization, HTTP headers, and more
- **Comprehensive Documentation**: JSON and beautiful HTML docs at the root route
- **Modern Codebase**: ES modules, async/await, modular structure

---

## 📚 API Documentation

- **JSON Docs**: [`/`](http://localhost:3000/)
- **HTML Docs**: [`/?format=html`](http://localhost:3000/?format=html)

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

Create a `.env` or `config.env` file in the root directory. Example:

```
NODE_ENV=development
PORT=3000
DATABASE=mongodb+srv://<username>:<password>@cluster.mongodb.net/natours?retryWrites=true&w=majority
DATABASE_PASSWORD=yourpassword
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
```

### 4. Run the Server

```bash
npm run start:dev
```

Server runs at [http://localhost:3000](http://localhost:3000)

---

## 🧩 Project Structure

```
controllers/      # Route handlers for tours, users, reviews, etc.
dev-data/         # Sample data for development
models/           # Mongoose models
public/           # Static files and HTML documentation
routes/           # Express route definitions
utils/            # Utility functions (error handling, features, etc.)
app.js            # Express app setup
server.js         # App entry point
```

---

## 🔑 Authentication & Roles

- Most endpoints require a JWT Bearer token
- Roles: `user`, `guide`, `lead-guide`, `admin`
- See docs for protected routes and required roles

---

## 📝 Example API Endpoints

- `POST /api/v1/users/signup` — Register a new user
- `POST /api/v1/users/login` — Login and receive JWT
- `GET /api/v1/tours` — List all tours (with filtering, sorting, pagination)
- `GET /api/v1/tours/top-5-cheap` — Top 5 cheapest tours
- `GET /api/v1/tours/tour-stats` — Aggregated tour statistics
- `GET /api/v1/tours/monthly-plan/:year` — Monthly plan for a year
- `POST /api/v1/reviews` — Create a review (user only)
- `GET /api/v1/tours/:tourId/reviews` — Get reviews for a tour

See full details in the documentation.

---

## 🛡️ Security & Best Practices

- Rate limiting (100 req/hr/IP)
- Data sanitization (NoSQL injection, XSS)
- HTTP security headers (Helmet)
- CORS enabled

---

## 👨‍💻 Author

- [Muhammad Saeed](https://github.com/your-username)

---

## 📄 License

This project is licensed under the ISC License.

---

## ⭐️ Star this repo if you found it useful!
