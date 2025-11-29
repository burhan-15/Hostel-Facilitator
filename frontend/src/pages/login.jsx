import { useState } from "react";
import { useAuth } from "../Components/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission
    setError("");
    
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    const res = await login(email, password);
    
    if (!res.success) {
      console.error("Login failed:", res.message);
      setError(res.message);
      return;
    }


    // redirect based on role
    if (res.user.role === "admin") navigate("/admin");
    else if (res.user.role === "owner") navigate("/owner");
    else navigate("/dashboard");
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center px-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">

        <h2 className="text-3xl font-bold text-white text-center mb-6">Login</h2>

        {error && <p className="text-red-400 text-sm mb-3 text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-3 pr-12 rounded-lg bg-gray-700 text-white border border-gray-600"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-700 hover:bg-slate-600 transition p-3 rounded-lg text-white"
          >
            Login
          </button>
        </form>
        <div className="text-sm mt-4">
          <p className="font-medium text-slate-300">Test Accounts:</p>
          <ul className="list-disc list-inside text-slate-400">
            <li><b>User:</b> user@test.com</li>
            <li><b>Owner:</b> owner@test.com</li>
            <li><b>Admin:</b> admin@test.com</li>
            <li>(Password for all: abcd123)</li>
          </ul>
        </div>

        <p className="text-gray-400 text-sm text-center mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-slate-300 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
