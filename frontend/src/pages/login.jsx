import { useState } from "react";
import { useAuth } from "../Components/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleLogin = () => {
    const res = login(email, password);

    if (!res.success) {
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

        <div className="space-y-4">
          <input
            type="email"
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-slate-700 hover:bg-slate-600 transition p-3 rounded-lg text-white"
          >
            Login
          </button>
          <div class="text-sm">
              <p class="font-medium text-slate-300">Test Accounts:</p>
              <ul class="list-disc list-inside text-slate-400">
                  <li><b>User:</b> user@test.com</li>
                  <li><b>Owner:</b> owner@test.com</li>
                  <li><b>Admin:</b> admin@test.com</li>
                  <li>(Password for all: \`password\`)</li>
              </ul>
          </div>
        </div>

        <p className="text-gray-400 text-sm text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-slate-300 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
