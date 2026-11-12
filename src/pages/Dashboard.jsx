import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import {
  getMyTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../api";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !user) {
      navigate("/");
    }
  }, [navigate, user]);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, []);

  async function fetchTasks() {
    setLoading(true);
    setError("");

    try {
      const result = await getMyTasks();
      if (result.ok) {
        setTasks(result.data.tasks || []);
      } else {
        setError("Tasks load nahi ho paye");
      }
    } catch (err) {
      setError("Server se connect nahi ho paya");
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleTaskSubmit(taskData) {
    let result;

    if (editingTask) {
      result = await updateTask(editingTask._id, taskData);
    } else {
      // create mode
      result = await createTask(taskData);
    }

    if (result.ok) {
      // list dobara fetch karo
      await fetchTasks();
      setEditingTask(null);
    }

    return result;
  }

  async function handleDelete(id) {
    const ok = window.confirm("Kya sach me yeh task delete karna hai?");
    if (!ok) return;

    try {
      const result = await deleteTask(id);
      if (result.ok) {
        setTasks(tasks.filter((t) => t._id !== id));
      } else {
        alert(result.data.message || "Delete nahi ho paya");
      }
    } catch (err) {
      alert("Server se connect nahi ho paya");
    }
  }

  // edit button click
  function handleEdit(task) {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  const counts = {
    all: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    "in-progress": tasks.filter((t) => t.status === "in-progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  if (!user) return null;

  return (
    <>
      <Navbar />

      <div className="dashboard-wrapper">
        <div className="dashboard-content">
          {/* greeting section */}
          <div className="greeting">
            <h1>
              Hi, <span>{user.name}</span> 👋
            </h1>
            <p>Aaj ka kya plan hai? Neeche apne tasks manage karein.</p>
          </div>

          {/* task form */}
          <TaskForm
            onSubmit={handleTaskSubmit}
            editingTask={editingTask}
            onCancelEdit={() => setEditingTask(null)}
          />

          {/* filter tabs */}
          <div className="filter-tabs">
            <button
              className={"filter-btn " + (filter === "all" ? "active" : "")}
              onClick={() => setFilter("all")}
            >
              All <span className="count">{counts.all}</span>
            </button>
            <button
              className={"filter-btn " + (filter === "pending" ? "active" : "")}
              onClick={() => setFilter("pending")}
            >
              Pending <span className="count">{counts.pending}</span>
            </button>
            <button
              className={
                "filter-btn " + (filter === "in-progress" ? "active" : "")
              }
              onClick={() => setFilter("in-progress")}
            >
              In Progress <span className="count">{counts["in-progress"]}</span>
            </button>
            <button
              className={
                "filter-btn " + (filter === "completed" ? "active" : "")
              }
              onClick={() => setFilter("completed")}
            >
              Completed <span className="count">{counts.completed}</span>
            </button>
          </div>

          {/* task list */}
          {loading ? (
            <div className="empty-state">
              <p>Tasks load ho rahe hain...</p>
            </div>
          ) : error ? (
            <div className="empty-state error-state">
              <p>⚠️ {error}</p>
              <button className="btn" onClick={fetchTasks}>
                Retry
              </button>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="empty-state">
              <p className="empty-icon">📝</p>
              <p className="empty-text">
                {filter === "all"
                  ? "Abhi koi task nahi hai. Upar se naya task banayein."
                  : "Is filter me koi task nahi hai."}
              </p>
            </div>
          ) : (
            <div className="task-list">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;