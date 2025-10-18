import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Signup({ onSignupSuccess }) {
  const [user, setUser] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
console.log("API URL:", process.env.REACT_APP_API_URL);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (!user.username || !user.email || !user.password) {
      setError("All fields are required!");
      return;
    }

    axios
      .post(`${process.env.REACT_APP_API_URL}/users`, user)
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data));
        onSignupSuccess?.();
        navigate("/login"); 
      })
      .catch((err) => {
        console.log("Frontend Signup Error:", err.response?.data);
        setError(err.response?.data?.error || "Signup failed, try again!");
      });
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>📝 Create Account</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSignup}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={user.username}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={user.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
          />
          <button type="submit" className="confirm-btn">Sign Up</button>
        </form>
        <p style={{ marginTop: "10px" }}>
  Already have an account?{" "}
  <span
    onClick={() => navigate("/login")}
    style={{ color: "#007bff", cursor: "pointer", textDecoration: "underline" }}
  >
    Log in
  </span>
</p>
      </div>
    </div>
  );
}
