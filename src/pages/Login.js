import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Login({ onLoginSuccess }) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      setError("Email and password are required!");
      return;
    }

    axios
      .post(`${process.env.REACT_APP_API_URL}/users/login`, credentials)
      .then((res) => {
        const user = res.data;

        // ✅ Save user in localStorage
        localStorage.setItem("user", JSON.stringify(user));

        // ✅ Update App state with user
        onLoginSuccess(user);

        // ✅ Navigate after login
        navigate("/tasks");
      })
      .catch((err) => {
        console.log("Login Error:", err.response?.data);
        setError(err.response?.data?.error || "Invalid credentials!");
      });
  };

  // ✅ New function to navigate to signup
  const goToSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>🔑 Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={credentials.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
          />
          <button type="submit" className="confirm-btn">
            Login
          </button>
        </form>

        {/* ✅ Signup link */}
        <p style={{ marginTop: "10px" }}>
          Don’t have an account?{" "}
          <span
            onClick={goToSignup}
            style={{ color: "#007bff", cursor: "pointer", textDecoration: "underline" }}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
