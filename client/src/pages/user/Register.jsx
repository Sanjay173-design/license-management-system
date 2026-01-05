import { useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const registerHandler = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      setMsg("Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMsg(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={registerHandler}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-2 text-left">
          License Management
        </h1>
        <h2 className="text-2xl font-bold mb-2">Register</h2>

        {msg && <p className="text-blue-500 mb-3">{msg}</p>}

        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border mb-3"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-3"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-green-600 text-white p-2">Register</button>

        <p className="text-sm mt-3 text-center">
          Already have an account?
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
