# TeamHub Backend API

Express.js backend with MongoDB integration for the TeamHub employee portal.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/teamhub
NODE_ENV=development
```

3. Start MongoDB (make sure MongoDB is installed and running)

4. Run the development server:
```bash
npm run dev
```

## API Endpoints

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID

### Announcements
- `GET /api/announcements` - Get all announcements
- `GET /api/announcements/:id` - Get announcement by ID
- `POST /api/announcements` - Create new announcement (role-protected)

### Celebrations
- `GET /api/celebrations` - Get upcoming celebrations (next 30 days)
- `GET /api/celebrations/today` - Get today's celebrations

### Health Check
- `GET /api/health` - API health status

## Models

### User
- `id` - MongoDB ObjectId
- `name` - String (required)
- `email` - String (required, unique)
- `role` - String (employee, manager, admin)
- `department` - String (required)
- `photo` - String (URL)
- `birthday` - Date (required)
- `hireDate` - Date (default: now)

### Announcement
- `id` - MongoDB ObjectId
- `title` - String (required)
- `content` - String (required)
- `created_by` - ObjectId (ref: User)
- `created_at` - Date (auto-generated)

## Features

- CORS enabled for frontend integration
- MongoDB with Mongoose ODM
- Role-based access control (placeholder)
- Virtual fields for calculated data
- Error handling middleware
- Environment variable configuration

## Development

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server 