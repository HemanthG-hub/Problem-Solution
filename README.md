# Problem Platform - Full Stack Application

A professional, real-world platform where industries post problems and students solve them to earn credits.

## Features

### For Students 🎓
- Browse and explore real-world problems
- Submit solutions with code/files
- Track submission status
- View earned credits
- Build portfolio

### For Industries 🏢
- Post problems for students to solve
- Review student submissions
- Award credits to accepted solutions
- Find talented developers

## Tech Stack

**Frontend:**
- React + React Router
- Tailwind CSS with custom animations
- Axios for API calls
- Context API for state management

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcrypt Password Hashing

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)

### Installation

#### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```
MONGO_URI=mongodb://localhost:27017/problem-platform
JWT_SECRET=your_jwt_secret_here
PORT=5000
```

#### 2. Frontend Setup

```bash
cd frontend
npm install
```

### Running the Application

#### Terminal 1 - MongoDB
```bash
mongod
```
Or use MongoDB Atlas connection string in `.env`

#### Terminal 2 - Backend
```bash
cd backend
npm start
# Or with nodemon: npm run dev
```

#### Terminal 3 - Frontend
```bash
cd frontend
npm start
```

Access the app at `http://localhost:3000`

## Seeding Demo Data

To populate the database with sample problems and users:

```bash
cd backend
npm run seed
```

**Demo Credentials:**
- **Student:** alice@example.com / password123
- **Student:** bob@example.com / password123
- **Industry:** tech@techcorp.com / password123
- **Industry:** info@dataflow.com / password123

## Project Structure

```
problem-platform/
├── backend/
│   ├── models/           # Database schemas
│   ├── controllers/       # Business logic
│   ├── routes/           # API endpoints
│   ├── middleware/       # Auth & role-based access
│   ├── server.js         # Express app
│   ├── seed.js           # Demo data script
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API client
│   │   ├── context/      # Global state
│   │   └── App.js
│   ├── public/
│   │   ├── images/       # SVG icons for domains
│   │   └── index.html
│   └── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user

### Problems
- `GET /api/problems` - List all problems
- `GET /api/problems/:id` - Get problem details
- `POST /api/problems` - Create problem (industry only)

### Submissions
- `POST /api/submissions` - Submit solution (student only)
- `GET /api/submissions/my` - Get student's submissions
- `GET /api/submissions/problem/:id` - Get submissions for a problem
- `PATCH /api/submissions/:id/review` - Accept/reject submission

## Key Features

### Professional UI/UX
- ✨ Smooth animations and transitions
- 🎨 Gradient backgrounds and cards
- 📱 Fully responsive design
- 🎯 Intuitive navigation

### Security
- 🔐 JWT token-based authentication
- 🔒 Bcrypt password hashing
- 🛡️ Role-based access control (RBAC)

### Performance
- ⚡ Optimized MongoDB queries
- 🚀 Efficient state management
- 📦 Minimal bundle size

## Demo Problems

The seeded data includes 8 sample problems across different domains:

1. **Web Development** - Build a real-time chat application
2. **AI/ML** - Image classification model
3. **Data Science** - Database query optimization
4. **System Design** - Microservices architecture
5. **DevOps** - Docker CI/CD pipeline
6. **Mobile Development** - Cross-platform app
7. **Web Development** - REST API with authentication
8. **Data Science** - Big data analysis with Spark

## Customization

### Adding More Problems
Edit `backend/seed.js` and add to the `problems` array.

### Changing Difficulty
Modify difficulty levels in problem creation or schema validation.

### Custom Animations
Update `frontend/src/index.css` for animation tweaks.

## Troubleshooting

### Issues with Database Connection
- Ensure MongoDB is running: `mongod`
- Check `MONGO_URI` in `.env`
- Verify port 27017 is not blocked

### NPM Install Errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Frontend Won't Start
```bash
cd frontend
rm -rf node_modules
npm install
npm start
```

## Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced search and filtering
- [ ] Problem recommendations
- [ ] User ratings system
- [ ] Leaderboard
- [ ] Email notifications
- [ ] File upload functionality
- [ ] Live code editor integration

## License

MIT

---

**Happy Coding! 🚀**