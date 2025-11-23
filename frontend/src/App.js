import './App.css';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/navbar";
import Welcome from "./Components/welcome";
import Hostels from "./pages/hostels";
import HostelDetails from "./pages/hostelDetails";
import Login from "./pages/login";
import Signup from "./pages/signup";
import UserDashboard from "./pages/UserDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import FAQ from "./pages/FAQ";
import Footer from "./Components/footer";
import { AuthProvider } from "./Components/AuthContext";



function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/hostels" element={<Hostels />} />
          <Route path="/hostel/:id" element={<HostelDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/owner" element={<OwnerDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/faq" element={<FAQ />} />
        </Routes>

        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
