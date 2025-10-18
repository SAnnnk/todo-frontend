import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import { FaEnvelope } from "react-icons/fa";

export default function Inbox({ searchTerm = "" }) {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load logged-in user from localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      console.log("Fetching messages for user:", parsedUser.user_id);
      fetchMessages(parsedUser.user_id);
    }
  }, []);

  const fetchMessages = async (user_id) => {
    try {
      const res = await axios.get(`http://localhost:5000/messages?user_id=${user_id}`);
      console.log("Messages received:", res.data);
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  // Safe filtering: show all messages if searchTerm is empty
  const filteredMessages = messages.filter(
    (msg) =>
      !searchTerm ||
      (msg.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (msg.description || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) return <p className="dashboard-message">🔒 Please login to view your inbox.</p>;

  return (
    <main className="tasks-container">
      <h2>📥 Inbox</h2>

      {filteredMessages.length === 0 ? (
        <p className="empty-text">No messages found 📭</p>
      ) : (
        filteredMessages.map((msg) => (
          <div
            key={msg.message_id}
            className={`task-card ${msg.is_read ? "read" : "unread"}`}
          >
            <div className="task-info">
              <FaEnvelope className={msg.is_read ? "read" : "unread"} />
              <div>
                <p><strong>{msg.title || "No title"}</strong></p>
                <p>{msg.description || "No content"}</p>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Debug: show raw messages */}
      <pre style={{ display: "none" }}>{JSON.stringify(messages, null, 2)}</pre>
    </main>
  );
}
