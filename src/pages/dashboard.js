import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
  tasksCompleted: 0,
  tasksOverdue: 0,
  avgCompletion: 0,
  categories: [],
  completion30Days: 0,
  completed_prev_30: 0,
  totalTasks: 0
});


  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      fetchStats(parsedUser.user_id);
    }
  }, []);


  const fetchStats = async (user_id) => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/dashboard/${user_id}`);
      setStats(data);
    } catch (err) {
      console.error("Dashboard fetch error:", err.response?.data || err.message);
    }
  };



  if (!user) return <p className="dashboard-message">🔒 Please login to view your dashboard.</p>;
  

  const {
    tasksCompleted,
    tasksOverdue,
    avgCompletion,
    categories,
    completion30Days,
    completed_prev_30,
    totalTasks
  } = stats;

  const rateChange = completed_prev_30
    ? (((completion30Days - completed_prev_30) / completed_prev_30) * 100).toFixed(1)
    : "0";

  const completionData = [
    { name: "Previous 30 Days", completed: completed_prev_30 },
    { name: "Last 30 Days", completed: completion30Days },
  ];

  return (
    <div className="dashboard">
      <header className="hea_de2r1">
        <p>Analyze your task completion and time management</p>
      </header>

      <section className="stats-grid">
        <StatCard title="Tasks Completed" value={tasksCompleted} />
        <StatCard title="Tasks Overdue" value={tasksOverdue} />
        <StatCard title="Avg. Completion Time" value={`${avgCompletion} days`} />
      </section>

      <section className="completion-section">
        <h3>Task Completion Rate (Last 30 Days)</h3>
        <div className="completion-rate">
          <p className="rate-value">{completion30Days}</p>
          <span className={`rate-change ${rateChange >= 0 ? 'positive' : 'negative'}`}>
            {rateChange >= 0 ? '+' : ''}{rateChange}%
          </span>
        </div>
      </section>

      <section className="completion-chart-section">
        <h3>Task Completion Comparison</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={completionData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="completed" fill="#4caf50" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="categories-section">
        <h3>Task Categories</h3>
        {categories.length ? (
          categories.map((cat, i) => {
            const percent = totalTasks > 0 ? ((cat.total / totalTasks) * 100).toFixed(1) : 0;
            return (
              <div key={i} className="category-row">
                <span className="category-name">{cat.name}</span>
                <span className="category-percent">{percent}%</span>
                <div className="category-bar">
                  <div className="category-fill" style={{ width: `${percent}%` }}></div>
                </div>
              </div>
            );
          })
        ) : (
          <p>No categories yet</p>
        )}
         
      </section>
    
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="stat-card">
      <p className="stat-title">{title}</p>
      <p className="stat-value">{value}</p>
    </div>
  );
}
