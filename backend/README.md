# Hostel Facilitator Backend API

A RESTful API backend for the Hostel Facilitator application built with Node.js, Express, and MongoDB.

## Features

- **Authentication & Authorization**
  - User registration and login with JWT
  - Role-based access control (User, Owner, Admin)
  - Protected routes with authentication middleware

- **Hostel Management**
  - CRUD operations for hostels
  - Admin approval/rejection system
  - Filtering and search capabilities
  - Owner-specific hostel management

- **Reviews & Ratings**
  - Add reviews with ratings (1-5 stars)
  - Delete reviews (admin or review owner)
  - View all reviews for a hostel

- **Q&A System**
  - Users can ask questions about hostels
  - Owners can answer questions
  - Track unanswered questions

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- npm or yarn

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/hostel-facilitator
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

   **Note:** 
   - For MongoDB Atlas, use: `mongodb+srv://username:password@cluster.mongodb.net/hostel-facilitator`
   - Change `JWT_SECRET` to a strong random string in production

3. **Start MongoDB**
   Make sure MongoDB is running on your system or use a cloud instance.

4. **Run the Server**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:5000` (or the port specified in `.env`)

## API Endpoints

### Authentication (`/api/auth`)

- `POST /api/auth/register` - Register a new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "user" // optional: "user", "owner", or "admin"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `GET /api/auth/profile` - Get current user profile (requires auth)

### Hostels (`/api/hostels`)

- `GET /api/hostels` - Get all hostels (with optional query params: `status`, `area`, `gender`, `profession`, `minRent`, `maxRent`)
- `GET /api/hostels/:id` - Get single hostel by ID
- `POST /api/hostels` - Create new hostel (Owner/Admin only)
  ```json
  {
    "name": "G-10 Boys Hostel",
    "area": "G-10",
    "rent": 15000,
    "gender": "Male",
    "profession": "Student",
    "description": "A modern and clean hostel...",
    "image": "https://example.com/image.jpg",
    "amenities": ["Wi-Fi", "Laundry", "Mess", "Parking"]
  }
  ```
- `PUT /api/hostels/:id` - Update hostel (Owner of hostel or Admin)
- `DELETE /api/hostels/:id` - Delete hostel (Owner of hostel or Admin)
- `GET /api/hostels/owner/my-hostels` - Get hostels owned by current user (Owner/Admin)
- `PATCH /api/hostels/:id/approve` - Approve hostel (Admin only)
- `PATCH /api/hostels/:id/reject` - Reject hostel (Admin only)
- `POST /api/hostels/:id/questions` - Add question to hostel (Authenticated users)
  ```json
  {
    "text": "Is there a generator for backup power?"
  }
  ```
- `POST /api/hostels/:id/questions/:questionId/answer` - Answer question (Owner/Admin)
  ```json
  {
    "answer": "Yes, we have a 24/7 generator backup."
  }
  ```

### Reviews (`/api/reviews`)

- `GET /api/reviews/hostel/:id` - Get all reviews for a hostel
- `POST /api/reviews/hostel/:id` - Add review (Users only)
  ```json
  {
    "rating": 5,
    "text": "Great place to live! Very clean and the management is cooperative."
  }
  ```
- `DELETE /api/reviews/hostel/:id/:reviewId` - Delete review (Admin or review owner)

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All responses follow this format:

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error message"
}
```

## User Roles

- **user**: Can view hostels, add reviews, ask questions
- **owner**: Can create/manage hostels, answer questions
- **admin**: Can approve/reject hostels, manage all content

## Database Models

### User
- name, email, password, role, timestamps

### Hostel
- name, area, rent, gender, profession, description, image, amenities
- ownerId (reference to User)
- status (pending/approved/rejected)
- reviews[] (embedded)
- questions[] (embedded)
- timestamps

## Testing the API

You can use tools like:
- Postman
- Thunder Client (VS Code extension)
- curl
- Your React frontend

Example curl command:
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Notes

- New hostels are created with `status: "pending"` and require admin approval
- Users can only review a hostel once
- Only owners can answer questions on their hostels
- Admins can delete any review, users can only delete their own reviews

