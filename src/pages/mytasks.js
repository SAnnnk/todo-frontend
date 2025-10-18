// src/pages/MyTasks.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import { FaTrash, FaCheckCircle, FaRegCircle, FaPlus, FaInfoCircle, FaEdit } from "react-icons/fa";

export default function MyTasks({ user: parentUser, refreshStats = () => {} }) {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("due_date");
  const priorityOrder = { Low: 1, Medium: 2, High: 3 };
  const [newTask, setNewTask] = useState({
    task_id: null,
    title: "",
    description: "",
    user_id: null,
    category_id: null,
    priority: "Medium",
    status: "Pending",
    due_date: ""
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [togglingId, setTogglingId] = useState(null); // disable per-task button while updating
  const API = process.env.REACT_APP_API_URL?.replace(/\/+$/, "") || "";

  // Fetch tasks
  const fetchTasks = async (user_id) => {
    if (!user_id) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API}/tasks`, { params: { user_id } });
      setTasks(res.data || []);
    } catch (err) {
      console.error("Error fetching tasks:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async (user_id) => {
    if (!user_id) return;
    try {
      const res = await axios.get(`${API}/categories`, { params: { user_id } });
      setCategories(res.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err.response?.data || err.message);
    }
  };

  // Load logged-in user
  useEffect(() => {
    const savedUser = parentUser || (localStorage.getItem("user") && JSON.parse(localStorage.getItem("user")));
    if (savedUser) {
      setUser(savedUser);
      setNewTask(prev => ({ ...prev, user_id: savedUser.user_id }));
      Promise.all([fetchTasks(savedUser.user_id), fetchCategories(savedUser.user_id)]);
    }
  }, [parentUser]);

  if (!user) return <p>Please login to see your tasks.</p>;

  // Modal controls
  const openModal = () => {
    setIsEditing(false);
    setNewTask({
      task_id: null,
      title: "",
      description: "",
      user_id: user.user_id,
      category_id: null,
      priority: "Medium",
      status: "Pending",
      due_date: ""
    });
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setNewTask(prev => ({ ...prev, task_id: null }));
  };

  // Add / Update task
  const addTask = async () => {
    if (!newTask.title?.trim()) return alert("Title is required");
    const payload = { ...newTask, category_id: newTask.category_id ? parseInt(newTask.category_id, 10) : null };
    try {
      await axios.post(`${API}/tasks`, payload);
      await fetchTasks(user.user_id);
      closeModal();
      if (typeof refreshStats === "function") refreshStats();
    } catch (err) {
      console.error("Add task failed:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to add task");
    }
  };

  const updateTask = async () => {
    if (!newTask.title?.trim()) return alert("Title is required");
    if (!newTask.task_id) return alert("Invalid task id");
    const payload = { ...newTask, category_id: newTask.category_id ? parseInt(newTask.category_id, 10) : null };
    try {
      await axios.put(`${API}/tasks/${newTask.task_id}`, payload);
      await fetchTasks(user.user_id);
      closeModal();
      if (typeof refreshStats === "function") refreshStats();
    } catch (err) {
      console.error("Update task failed:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to update task");
    }
  };

  // Toggle status (fixed endpoint and per-task disabling)
  const toggleStatus = async (task) => {
    if (!task || !task.task_id) return;
    const newStatus = task.status === "Pending" ? "Completed" : "Pending";
    const payload = {
      ...task,
      status: newStatus,
      completed_at: newStatus === "Completed" ? new Date().toISOString() : null
    };

    setTogglingId(task.task_id);
    try {
      await axios.put(`${API}/tasks/${task.task_id}`, payload);
      await fetchTasks(task.user_id);
      if (typeof refreshStats === "function") refreshStats();
    } catch (err) {
      console.error("Toggle status failed:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to update task status");
    } finally {
      setTogglingId(null);
    }
  };

  // Delete
  const deleteTask = async (task_id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await axios.delete(`${API}/tasks/${task_id}`, { data: { user_id: user.user_id } });
      setTasks(prev => prev.filter(t => t.task_id !== task_id));
      if (typeof refreshStats === "function") refreshStats();
    } catch (err) {
      console.error("Delete task failed:", err.response?.data || err.message);
      alert("Failed to delete task");
    }
  };

  // Edit
  const editTask = (task) => {
    setIsEditing(true);
    setNewTask({
      ...task,
      due_date: task.due_date || ""
    });
    setShowModal(true);
  };

  // Filter and sort
  const filteredTasks = tasks.filter(task => (filter === "All" ? true : task.status === filter));
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "due_date") return new Date(a.due_date || Infinity) - new Date(b.due_date || Infinity);
    if (sortBy === "priority") return priorityOrder[a.priority] - priorityOrder[b.priority];
    return 0;
  });

  return (
    <main className="tasks-container">
      <div className="header">
        <h2>📋 My Tasks</h2>
        <button className="add-task-btn" onClick={openModal}><FaPlus /> Add Task</button>
      </div>

      <div className="filter-sort-container">
        <div className="filter-buttons">
          {["All", "Pending", "Completed"].map(f => (
            <button key={f} className={filter === f ? "active" : ""} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>

        <div className="sort-container">
          <label>Sort by:</label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="due_date">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>

      <div className="task-list">
        {loading ? <p>Loading tasks...</p> : sortedTasks.length === 0 ? <p>No tasks found</p> :
          sortedTasks.map(task => {
            const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== "Completed";
            return (
              <div key={task.task_id} className={`task-card ${task.status === "Completed" ? "done" : ""} ${isOverdue ? "overdue" : ""}`}>
                <div className="task-info">
                  <button
                    className="status-btn"
                    onClick={() => toggleStatus(task)}
                    disabled={togglingId === task.task_id}
                    title={togglingId === task.task_id ? "Updating..." : "Toggle status"}
                  >
                    {task.status === "Completed" ? <FaCheckCircle color="#16a34a" /> : <FaRegCircle />}
                  </button>
                  <div className="task-title">
                    <p className={task.status === "Completed" ? "done" : ""}>{task.title}</p>
                    <span className={`priority-badge ${task.priority?.toLowerCase()}`}>{task.priority}</span>
                    {task.due_date && <small>📅 {new Date(task.due_date).toLocaleString()}</small>}
                  </div>
                </div>
                <div className="task-actions">
                  <button className="info-btn" onClick={() => setSelectedTask(task)}><FaInfoCircle /></button>
                  <button className="edit-btn" onClick={() => editTask(task)}><FaEdit /></button>
                  <button className="delete-btn" onClick={() => deleteTask(task.task_id)}><FaTrash /></button>
                </div>
              </div>
            );
          })
        }
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{isEditing ? "Edit Task" : "Add Task"}</h3>
            <input type="text" placeholder="Title" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} />
            <textarea placeholder="Description" value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} />
            {/* Category Dropdown */}
            <select
              value={newTask.category_id?.toString() ?? ""}
              onChange={e =>
                setNewTask({
                  ...newTask,
                  category_id: e.target.value ? parseInt(e.target.value, 10) : null
                })
              }
            >
              <option value="">No category</option>
              {categories.map(c => (
                <option key={c.category_id} value={c.category_id.toString()}>
                  {c.name}
                </option>
              ))}
            </select>

            <select value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <input
              type="datetime-local"
              value={newTask.due_date ? (newTask.due_date.length >= 16 ? newTask.due_date.slice(0, 16) : newTask.due_date) : ""}
              onChange={e => setNewTask({ ...newTask, due_date: e.target.value })}
            />
            <div className="modal-buttons">
              <button onClick={isEditing ? updateTask : addTask}>{isEditing ? "Update" : "Add"}</button>
              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="modal">
          <div className="modal-content">
            <h3>Task Details</h3>
            <p><strong>Title:</strong> {selectedTask.title}</p>
            <p><strong>Description:</strong> {selectedTask.description || "No description"}</p>
            <p><strong>Priority:</strong> {selectedTask.priority}</p>
            <p><strong>Status:</strong> {selectedTask.status}</p>
            <p><strong>Due Date:</strong> {selectedTask.due_date ? new Date(selectedTask.due_date).toLocaleString() : "Not set"}</p>
            <p><strong>Category:</strong> {categories.find(c => c.category_id === selectedTask.category_id)?.name || "None"}</p>
            <button onClick={() => setSelectedTask(null)}>Close</button>
          </div>
        </div>
      )}
    </main>
  );
}
