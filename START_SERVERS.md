# How to Start Both Servers and Test the Website

## Prerequisites
- Node.js and npm installed
- MongoDB running (local or cloud like MongoDB Atlas)

## Step-by-Step Instructions

### 1. Set Up Backend Environment

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/hostel-facilitator
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=http://localhost:3000
```

**For MongoDB Atlas (Cloud):**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hostel-facilitator?retryWrites=true&w=majority
```

### 2. Set Up Frontend Environment

Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Install Dependencies (if not already done)

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 4. Start MongoDB (if using local MongoDB)

**Windows:**
- Make sure MongoDB service is running
- Or start it manually: `mongod`

**Mac/Linux:**
```bash
mongod
```

**Or use MongoDB Atlas (Cloud)** - No local setup needed!

### 5. Start the Backend Server

Open a terminal/command prompt and run:

```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
```

**Keep this terminal open!**

### 6. Start the Frontend Server

Open a **NEW** terminal/command prompt and run:

```bash
cd frontend
npm start
```

The React app will automatically open in your browser at `http://localhost:3000`

**Keep this terminal open too!**

### 7. Test the Website

#### A. Test User Registration/Login

1. **Register a New User:**
   - Go to `http://localhost:3000/signup`
   - Fill in name, email, and password
   - Click "Create Account"
   - You should be redirected to the dashboard

2. **Login:**
   - Go to `http://localhost:3000/login`
   - Enter email and password
   - Click "Login"
   - You should be redirected based on your role

#### B. Test as Regular User

1. **Browse Hostels:**
   - Go to `http://localhost:3000/hostels`
   - You should see approved hostels (if any exist)

2. **View Hostel Details:**
   - Click on any hostel card
   - View details, reviews, and questions
   - Try adding a review (if logged in as user)
   - Try asking a question

#### C. Test as Owner

1. **Register/Login as Owner:**
   - Register with role "owner" (or modify in backend)
   - Login and go to `/owner` dashboard

2. **Create a Hostel:**
   - Click "Add New Hostel"
   - Fill in all details
   - Submit for approval
   - Hostel will be in "pending" status

3. **Manage Hostels:**
   - View your hostels
   - Update hostel details
   - Delete hostels
   - Answer questions from users

#### D. Test as Admin

1. **Login as Admin:**
   - Use admin credentials (you may need to create one in database)
   - Go to `/admin` dashboard

2. **Approve/Reject Hostels:**
   - View pending hostels
   - Click "Approve" or "Reject"
   - Approved hostels will appear on the main hostels page

3. **Manage Reviews:**
   - View recent reviews
   - Remove inappropriate reviews

### 8. Quick Test Checklist

- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 3000
- [ ] MongoDB connected
- [ ] Can register new user
- [ ] Can login
- [ ] Can view hostels (if any exist)
- [ ] Can create hostel (as owner)
- [ ] Can approve hostel (as admin)
- [ ] Can add review
- [ ] Can ask question
- [ ] Can answer question (as owner)

### 9. Troubleshooting

#### Backend Issues:

**"MongoDB Connection Error"**
- Make sure MongoDB is running
- Check `MONGO_URI` in `.env` file
- For Atlas: Check connection string and network access

**"Port 5000 already in use"**
- Change `PORT` in backend `.env` file
- Update `REACT_APP_API_URL` in frontend `.env` accordingly

#### Frontend Issues:

**"Network Error" or "Cannot connect to API"**
- Make sure backend is running
- Check `REACT_APP_API_URL` in frontend `.env`
- Check browser console for CORS errors

**"401 Unauthorized"**
- Token might be expired
- Try logging out and logging back in
- Clear localStorage: `localStorage.clear()` in browser console

#### Common Issues:

**"Module not found"**
- Run `npm install` in both backend and frontend directories

**"CORS Error"**
- Make sure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check backend `server.js` CORS configuration

### 10. Using Two Terminals

You need **TWO separate terminals** running simultaneously:

**Terminal 1 (Backend):**
```
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```
cd frontend
npm start
```

### 11. Stopping the Servers

- Press `Ctrl + C` in each terminal to stop the servers
- Stop backend first, then frontend

### 12. Seeding Initial Data (Optional)

If you have a seed script:
```bash
cd backend
node seed.js
```

This will populate the database with sample data.

---

## Quick Start Commands Summary

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend (in new terminal)
cd frontend
npm install
npm start
```

Then open `http://localhost:3000` in your browser!

