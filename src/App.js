import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import MyTasks from "./pages/mytasks";
import Inbox from "./pages/inbox";
import User from "./pages/userinterface";
import Dashboard from "./pages/dashboard";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import "./App.css";
import { FaBell, FaBars, FaTimes } from "react-icons/fa";
import axios from "axios";

function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
    setLoadingUser(false);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      localStorage.setItem("darkMode", !prev);
      return !prev;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
  };

  const handleNotificationToggle = async () => {
    if (!notificationsEnabled) {
      // تفعيل الإشعارات
      if (!user) return alert("Please login first!");
      if (!("serviceWorker" in navigator && "PushManager" in window)) {
        return alert("Web Push not supported in this browser.");
      }

      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return alert("Notification permission denied!");

        const registration = await navigator.serviceWorker.register("/service-worker.js");
        await navigator.serviceWorker.ready;

        const existingSubscription = await registration.pushManager.getSubscription();
        if (existingSubscription) await existingSubscription.unsubscribe();

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(process.env.REACT_APP_VAPID_PUBLIC_KEY),
        });

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/notifications/save-subscription`,
          { userId: user.user_id, subscription }
        );

        if (response.data?.message) {
          setNotificationsEnabled(true);
          alert("🔔 Notifications enabled!");
        } else {
          alert("Something went wrong while saving subscription.");
        }
      } catch (err) {
        console.error("Failed to enable notifications:", err);
        alert("Failed to enable notifications.");
      }
    } else {
      // إلغاء الإشعارات
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          const sub = await registration.pushManager.getSubscription();
          if (sub) await sub.unsubscribe();
        }
        setNotificationsEnabled(false);
        alert("🔕 Notifications disabled!");
      } catch (err) {
        console.error("Error disabling notifications:", err);
      }
    }
  };

  return (
    <Router>
      <div className={`app ${darkMode ? "dark" : "light"}`}>
        {user ? (
          <>
            <header className="topbar">
              <h2 className="app-title">📝 TaskMaster</h2>
              <div className="topbar-right">
                <FaBell
                  className="icon"
                  onClick={() => {
                    setMenuOpen(false);
                    window.location.href = "/inbox";
                  }}
                />
                <button className="menu-btn" onClick={() => setMenuOpen((prev) => !prev)}>
                  {menuOpen ? <FaTimes /> : <FaBars />}
                </button>
              </div>
            </header>

            <div className={`sidebar ${menuOpen ? "open" : ""}`}>
              <nav className="sidebar-nav">
                <Link to="/" onClick={() => setMenuOpen(false)}>
                  🏠 Dashboard
                </Link>
                <Link to="/tasks" onClick={() => setMenuOpen(false)}>
                  📋 My Tasks
                </Link>
                <Link to="/inbox" onClick={() => setMenuOpen(false)}>
                  📨 Inbox
                </Link>
                <Link to="/user" onClick={() => setMenuOpen(false)}>
                  👤 Profile
                </Link>
              </nav>

              <div className="sidebar-bottom">
              
                <label className="switch">
                 
                  <span className="label-text">🔔 Notifications</span>
                  <input
                    type="checkbox"
                    checked={notificationsEnabled}
                    onChange={handleNotificationToggle}
                  />
                   <span className="slider"></span>
                </label>

                <button className="mode-toggle" onClick={toggleDarkMode}>
                  {darkMode ? "🌞 Light" : "🌙 Dark"}
                </button>

                <button className="logout-btn" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </div>
            </div>

            <main className={`main-content ${menuOpen ? "sidebar-open" : ""}`}>
              <Routes>
                <Route path="/" element={<Dashboard user={user} />} />
                <Route path="/tasks" element={<MyTasks user={user} />} />
                <Route path="/inbox" element={<Inbox user={user} />} />
                <Route path="/user" element={<User user={user} />} />
              </Routes>
            </main>
          </>
        ) : loadingUser ? (
          <div className="loading-container">
            <p>Loading user...</p>
          </div>
        ) : (
          <Routes>
            <Route path="/login" element={<Login onLoginSuccess={(u) => setUser(u)} />} />
            <Route path="/signup" element={<Signup onSignupSuccess={(u) => setUser(u)} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
