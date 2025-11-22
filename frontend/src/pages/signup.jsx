import { useState } from "react";
import { useAuth } from "../Components/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e?.preventDefault(); // Prevent form submission if called from form
    setError("");
    
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const res = await signup(name, email, password);

    if (!res.success) {
      setError(res.message);
      return;
    }

    // After signup → go to user dashboard
    navigate("/dashboard");
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center px-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">

        <h2 className="text-3xl font-bold text-white text-center mb-6">Create Account</h2>

        {error && <p className="text-red-400 text-sm mb-3 text-center">{error}</p>}

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          <button
            type="submit"
            className="w-full bg-slate-700 hover:bg-slate-600 transition p-3 rounded-lg text-white"
          >
            Create Account
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-slate-300 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
