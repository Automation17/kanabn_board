import { useState } from "react";

export default function AddTaskModal({ onAdd, onClose, users }) {
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await onAdd({ title: title.trim(), description: description.trim(), assignedTo: assignee });
      onClose();
    } catch (err) {
      setError(err.message || "Failed to add task.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">New Task</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {error && <p className="modal-error">{error}</p>}

        <form onSubmit={handleSubmit} className="modal-form">
          <label className="modal-label">Title*</label>
          <input
            id="task-title"
            type="text"
            className="modal-input"
            placeholder="What needs to be done?"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            autoFocus
            required
          />

          <label className="modal-label">Assignee*</label>
          <select
            name="assign-employee"
            id="task-assign"
            className="modal-input"
            value={assignee}
            onChange={(event) => setAssignee(event.target.value)}
            required
          >
            <option value="" disabled>Select an assignee…</option>
            {users?.map(user => (
              <option key={user._id} value={user._id}>{user.name}</option>
            ))}
          </select>

          <label className="modal-label">Description</label>
          <textarea
            id="task-description"
            className="modal-input modal-textarea"
            placeholder="Add some details... (optional)"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
          />

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Adding..." : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
