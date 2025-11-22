# 🚀 Quick Start Guide

## Prerequisites Checklist
- [ ] Node.js installed (check with `node --version`)
- [ ] npm installed (check with `npm --version`)
- [ ] MongoDB running locally OR MongoDB Atlas account

---

## Step 1: Create Environment Files

### Backend `.env` file
Create `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/hostel-facilitator
JWT_SECRET=my-super-secret-jwt-key-12345
FRONTEND_URL=http://localhost:3000
```

**For MongoDB Atlas (Cloud):**
```env
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/hostel-facilitator?retryWrites=true&w=majority
```

### Frontend `.env` file
Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Step 2: Install Dependencies

**Open Terminal 1:**
```bash
cd backend
npm install
```

**Open Terminal 2:**
```bash
cd frontend
npm install
```

---

## Step 3: Start Backend Server

**In Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

✅ **You should see:**
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
```

**Keep this terminal running!**

---

## Step 4: Start Frontend Server

**In Terminal 2 (Frontend):**
```bash
cd frontend
npm start
```

✅ **You should see:**
- Browser automatically opens to `http://localhost:3000`
- Or manually go to `http://localhost:3000`

**Keep this terminal running too!**

---

## Step 5: Test the Website

### 🌐 Open in Browser
Go to: **http://localhost:3000**

### 📝 Test Flow:

1. **Register a New User**
   - Click "Sign Up" or go to `/signup`
   - Fill in: Name, Email, Password
   - Click "Create Account"
   - You'll be logged in automatically

2. **Browse Hostels**
   - Go to `/hostels` page
   - View available hostels (if any exist)

3. **View Hostel Details**
   - Click on any hostel card
   - See full details, reviews, questions

4. **Test as Owner** (Register with role "owner" or modify in database)
   - Go to `/owner` dashboard
   - Click "Add New Hostel"
   - Fill in hostel details
   - Submit for approval

5. **Test as Admin** (Create admin user in database)
   - Go to `/admin` dashboard
   - Approve/reject pending hostels
   - Manage reviews

---

## 🛠️ Troubleshooting

### ❌ "MongoDB Connection Error"
**Solution:**
- Make sure MongoDB is running
- Check `MONGO_URI` in `backend/.env`
- For local MongoDB: Start MongoDB service
- For Atlas: Check connection string and whitelist IP

### ❌ "Port 5000 already in use"
**Solution:**
- Change `PORT=5001` in `backend/.env`
- Update `REACT_APP_API_URL=http://localhost:5001/api` in `frontend/.env`

### ❌ "Cannot connect to API" or CORS Error
**Solution:**
- Make sure backend is running
- Check `REACT_APP_API_URL` in `frontend/.env` matches backend port
- Check `FRONTEND_URL` in `backend/.env` matches frontend URL

### ❌ "401 Unauthorized"
**Solution:**
- Clear browser localStorage: Open console → `localStorage.clear()`
- Log out and log back in
- Check if JWT_SECRET is set in backend `.env`

### ❌ "Module not found"
**Solution:**
- Run `npm install` in both `backend` and `frontend` directories

---

## 📋 Visual Guide

```
┌─────────────────────────────────────────┐
│  TERMINAL 1 (Backend)                   │
│  ─────────────────────────────────────  │
│  $ cd backend                            │
│  $ npm run dev                           │
│                                         │
│  ✅ MongoDB Connected Successfully      │
│  🚀 Server running on port 5000         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  TERMINAL 2 (Frontend)                  │
│  ─────────────────────────────────────  │
│  $ cd frontend                           │
│  $ npm start                             │
│                                         │
│  Compiled successfully!                 │
│  Local: http://localhost:3000           │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  BROWSER                                │
│  ─────────────────────────────────────  │
│  http://localhost:3000                  │
│                                         │
│  [Hostel Facilitator Website]          │
└─────────────────────────────────────────┘
```

---

## 🎯 Quick Commands Reference

```bash
# Backend
cd backend
npm install          # First time only
npm run dev          # Start backend

# Frontend  
cd frontend
npm install          # First time only
npm start            # Start frontend

# Stop servers
Ctrl + C             # In each terminal
```

---

## ✅ Success Indicators

- ✅ Backend: "Server running on port 5000"
- ✅ Backend: "MongoDB Connected Successfully"
- ✅ Frontend: Browser opens to localhost:3000
- ✅ Frontend: No console errors
- ✅ Can register/login
- ✅ Can view hostels page
- ✅ API calls work (check Network tab in browser DevTools)

---

## 🎉 You're Ready!

Once both servers are running:
1. Open `http://localhost:3000` in your browser
2. Start testing the features!
3. Check browser console (F12) for any errors
4. Check Network tab to see API calls

**Happy Testing! 🚀**

