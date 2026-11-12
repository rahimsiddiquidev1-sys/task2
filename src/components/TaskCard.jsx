
function TaskCard({ task, onEdit, onDelete }) {
  const statusClass = "status-" + task.status;

  const priorityClass = "priority-" + task.priority;

  const statusLabel = {
    pending: "Pending",
    "in-progress": "In Progress",
    completed: "Completed",
  };

  function formatDate(dateStr) {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function isOverdue() {
    if (!task.dueDate || task.status === "completed") return false;
    return new Date(task.dueDate) < new Date();
  }

  return (
    <div className="task-card">
      <div className="task-card-header">
        <h4 className={task.status === "completed" ? "task-done" : ""}>
          {task.title}
        </h4>
        <span className={"status-badge " + statusClass}>
          {statusLabel[task.status] || task.status}
        </span>
      </div>

      {task.description && <p className="task-desc">{task.description}</p>}

      <div className="task-meta">
        <span className={"priority-badge " + priorityClass}>
          {task.priority}
        </span>

        {task.dueDate && (
          <span className={"due-date " + (isOverdue() ? "overdue" : "")}>
            📅 {formatDate(task.dueDate)}
          </span>
        )}
      </div>

      <div className="task-actions">
        <button className="btn-small btn-edit" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button
          className="btn-small btn-delete"
          onClick={() => onDelete(task._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;