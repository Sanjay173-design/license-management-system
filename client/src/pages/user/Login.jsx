import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", form);

      login(res.data.token, res.data.user);

      if (res.data.user.role === "admin") navigate("/admin");
      else navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow p-8 rounded w-96"
      >
        <h1 className="text-2xl font-bold mb-2 text-left">
          License Management
        </h1>

        <h2 className="text-2xl font-bold mb-2 text-left">Login</h2>

        {error && (
          <p className="bg-red-200 text-red-700 p-2 mb-4 rounded">{error}</p>
        )}

        <label>Email</label>
        <input
          name="email"
          type="email"
          className="w-full border p-2 rounded mb-4"
          onChange={handleChange}
        />

        <label>Password</label>
        <input
          name="password"
          type="password"
          className="w-full border p-2 rounded mb-4"
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>

        <p className="text-sm mt-3 text-center">
          Do not have an account?{" "}
          <Link to="/register" className="text-blue-500 font-medium">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
