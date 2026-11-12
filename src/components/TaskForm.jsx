import { useState, useEffect } from "react";

// yeh form task create aur edit dono ke liye use hoga
// agar editingTask pass kiya hai to edit mode, warna create mode
function TaskForm({ onSubmit, editingTask, onCancelEdit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("pending");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // jab editingTask change ho to form me values bhar do
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || "");
      setDescription(editingTask.description || "");
      setPriority(editingTask.priority || "medium");
      setStatus(editingTask.status || "pending");

      // dueDate ko input ke format me convert karo (yyyy-mm-dd)
      if (editingTask.dueDate) {
        const d = new Date(editingTask.dueDate);
        setDueDate(d.toISOString().split("T")[0]);
      } else {
        setDueDate("");
      }
    } else {
      // reset form
      setTitle("");
      setDescription("");
      setPriority("medium");
      setStatus("pending");
      setDueDate("");
    }
  }, [editingTask]);

  async function handleSubmit(e) {
    e.preventDefault();

    // title zaroori hai
    if (!title.trim()) {
      setMsg("Title likhna zaroori hai");
      return;
    }

    setLoading(true);
    setMsg("");

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
    };

    // agar dueDate diya hai to hi bhejo
    if (dueDate) {
      taskData.dueDate = dueDate;
    }

    const result = await onSubmit(taskData);

    if (result.ok) {
      setMsg(editingTask ? "Task update ho gaya!" : "Task create ho gaya!");

      // form reset karo agar naya task tha
      if (!editingTask) {
        setTitle("");
        setDescription("");
        setPriority("medium");
        setStatus("pending");
        setDueDate("");
      }

      // 1.5 sec baad message hata do
      setTimeout(() => setMsg(""), 1500);
    } else {
      setMsg(result.data.message || "Kuch galat ho gaya");
    }

    setLoading(false);
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h3 className="form-title">
        {editingTask ? "✏️ Edit Task" : "➕ Naya Task Banayein"}
      </h3>

      <div className="form-group">
        <label>Title *</label>
        <input
          type="text"
          placeholder="Kya karna hai?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          placeholder="Thodi detail likhein (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={500}
          rows={3}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
        </div>

        <div className="form-group">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="pending">⏳ Pending</option>
            <option value="in-progress">🚀 In Progress</option>
            <option value="completed">✅ Completed</option>
          </select>
        </div>

        <div className="form-group">
          <label>Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      {msg && (
        <p
          className={
            "message " + (msg.includes("gaya") ? "success" : "error")
          }
        >
          {msg}
        </p>
      )}

      <div className="form-actions">
        <button type="submit" className="btn" disabled={loading}>
          {loading
            ? "Saving..."
            : editingTask
            ? "Update Task"
            : "Create Task"}
        </button>

        {editingTask && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancelEdit}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;