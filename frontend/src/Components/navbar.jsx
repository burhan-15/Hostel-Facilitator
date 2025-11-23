import { Link, NavLink } from "react-router-dom";
import logo from "../Images/2-removebg-preview.png";
import { useAuth } from "./AuthContext";

export default function Navbar() {
  const { currentUser, logout } = useAuth();

  return (
    <header className="bg-gray-900 border-b border-gray-700 shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-white font-bold text-2xl">
          <img src={logo} alt="Logo" className="h-12 w-12" />
          <span className="hidden md:block">Hostel Facilitator</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex gap-6 items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium transition ${
                isActive
                  ? "text-white border-b-2 border-slate-500"
                  : "text-gray-300 hover:text-white"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/hostels"
            className={({ isActive }) =>
              `text-sm font-medium transition ${
                isActive
                  ? "text-white border-b-2 border-slate-500"
                  : "text-gray-300 hover:text-white"
              }`
            }
          >
            Hostels
          </NavLink>

          <NavLink to="/faq" className={({ isActive }) =>
              `text-sm font-medium transition ${
                isActive
                  ? "text-white border-b-2 border-slate-500"
                  : "text-gray-300 hover:text-white"
              }`
            }>FAQs</NavLink>

          {currentUser && (
            <>
              {currentUser.role === "admin" && (
                <NavLink
                  to="/admin"
                  className= {({ isActive }) =>
                    `text-sm font-medium transition ${
                      isActive
                        ? "text-white border-b-2 border-slate-500"
                        : "text-gray-300 hover:text-white"
                    }`
                  }
                >
                  Admin Panel
                </NavLink>
              )}

              {currentUser.role === "owner" && (
                <NavLink
                  to="/owner"
                  className= {({ isActive }) =>
                    `text-sm font-medium transition ${
                      isActive
                        ? "text-white border-b-2 border-slate-500"
                        : "text-gray-300 hover:text-white"
                    }`
                  }
                >
                  Owner Dashboard
                </NavLink>
              )}

              {currentUser.role === "user" && (
                <NavLink
                  to="/dashboard"
                  className= {({ isActive }) =>
                    `text-sm font-medium transition ${
                      isActive
                        ? "text-white border-b-2 border-slate-500"
                        : "text-gray-300 hover:text-white"
                    }`
                  }
                >
                  Dashboard
                </NavLink>
              )}
            </>
          )}
        </div>

        {/* AUTH SECTION */}
        <div className="hidden md:flex items-center gap-4">

          {/* If NOT Logged In → show Login + Signup */}
          {!currentUser && (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700 transition"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="px-4 py-2 rounded-lg bg-slate-600 text-white hover:bg-slate-700 transition"
              >
                Signup
              </Link>
            </>
          )}

          {/* If Logged In → show Username + Dashboard + Logout */}
          {currentUser && (
            <>
              <span className="text-gray-300">
                Hi,{" "}
                <span className="text-white font-semibold">
                  {currentUser.name}
                </span>
              </span>

              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-600 text-white"
              >
                Logout
              </button>
            </>
          )}

        </div>
      </nav>
    </header>
  );
}
