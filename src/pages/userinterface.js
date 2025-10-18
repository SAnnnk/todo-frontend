// src/pages/User.js
import React, { useState, useEffect } from "react";
import "../App.css";

export default function User() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ✅ Get the logged-in user from localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  if (!user) return <p>Loading user info...</p>;

  return (
    <main className="tasks-container">
      <h2>👤 User Profile</h2>
      <div className="user-card">
        <img src="https://i.pravatar.cc/100" alt="profile" />
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Created At:</strong> {user.created_at || "N/A"}</p>
        <p><strong>Last Login:</strong> {user.last_login || "Never"}</p>
      </div>
    </main>
  );
}
