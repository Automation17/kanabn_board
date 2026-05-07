import { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { FaUser } from "react-icons/fa";
import { MdFolderCopy } from "react-icons/md";
import { useAuth } from "../context/AuthContext.jsx";
import { useSocket } from "../hooks/useSocket.js";
import Column from "../components/Column.jsx";
// import TaskCard from "../components/TaskCard.jsx";
import AddTaskModal from "../components/AddTaskModal.jsx";
// import EditTaskModal from "../components/EditTaskModal.jsx";

const API = `${import.meta.env.VITE_API_URL}/tasks`;
const STATUSES = ["todo", "inProgress", "done"];

export default function BoardPage() {
  const { token, user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTask, setActiveTask] = useState(null); // for DragOverlay

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // ─── Auth header helper ───────────────────────────────────
  function authHeader() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  // ─── Fetch all tasks ──────────────────────────────────────
  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await fetch(API, { headers: authHeader() });
        if (!res.ok) throw new Error("Failed to fetch tasks");
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, []);

  // ─── Fetch all users (for assignee dropdown) ──────────────
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
          headers: authHeader(),
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Could not load users:", err.message);
      }
    }
    fetchUsers();
  }, []);

  // ─── Real-time updates ───────────────────────────────────
  function handleTaskEvent(type, payload) {
    if (type === "added") {
      setTasks((prev) => {
        if (prev.some((t) => t._id === payload._id)) return prev;
        return [...prev, payload];
      });
    } else if (type === "moved") {
      setTasks((prev) =>
        prev.map((task) => (task._id === payload._id ? payload : task))
      );
    } else if (type === "deleted") {
      setTasks((prev) => prev.filter((task) => task._id !== payload));
    }
  };

  const socketRef = useSocket(handleTaskEvent);

  // ─── Add task ────────────────────────────────────────────
  async function handleAddTask({ title, description, assignedTo }) {
    const res = await fetch(API, {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify({ title, description, assignedTo }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to create task");
    }
    const newTask = await res.json();
    setTasks((prev) => [...prev, newTask]);
    if (socketRef.current) socketRef.current.emit("taskCreated", newTask);
  }

  // ─── Delete task ─────────────────────────────────────────
  async function handleDeleteTask(taskId) {
    const res = await fetch(`${API}/${taskId}`, {
      method: "DELETE",
      headers: authHeader(),
    });
    if (!res.ok) return;
    setTasks((prev) => prev.filter((task) => task._id !== taskId));
    if (socketRef.current) socketRef.current.emit("taskDeleted", taskId);
  }

  // ─── Move task (update status on backend) ────────────────
  async function moveTask(taskId, newStatus) {
    const res = await fetch(`${API}/${taskId}`, {
      method: "PUT",
      headers: authHeader(),
      body: JSON.stringify({ status: newStatus }),
    });
    if (!res.ok) return;
    const updated = await res.json();
    setTasks((prev) => prev.map((task) => (task._id === taskId ? updated : task)));
    if (socketRef.current) socketRef.current.emit("taskUpdated", updated);
  }

  // ─── DnD: Drag Start ─────────────────────────────────────
  function handleDragStart(event) {
    const task = tasks.find((task) => task._id === event.active.id);
    setActiveTask(task || null);
  }

  // ─── DnD: Drag End ───────────────────────────────────────
  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Determine the target status
    // `overId` can be either a column status string or another task's id
    let targetStatus = STATUSES.includes(overId) ? overId : null;

    if (!targetStatus) {
      // overId is a task id — find its column
      const overTask = tasks.find((task) => task._id === overId);
      if (overTask) targetStatus = overTask.status;
    }

    if (!targetStatus) return;

    const activeTask = tasks.find((task) => task._id === activeId);
    if (!activeTask) return;

    // If dropped into a different column → update status
    if (activeTask.status !== targetStatus) {
      setTasks((prev) =>
        prev.map((task) =>
          task._id === activeId ? { ...task, status: targetStatus } : task
        )
      );
      moveTask(activeId, targetStatus);
      return;
    }

    // Dropped in the same column → reorder locally (UI only)
    const columnTasks = tasks
      .filter((task) => task.status === targetStatus)
      .map((task) => task._id);

    const oldIndex = columnTasks.indexOf(activeId);
    const newIndex = columnTasks.indexOf(overId);

    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      const reordered = arrayMove(columnTasks, oldIndex, newIndex);
      setTasks((prev) => {
        const otherTasks = prev.filter((task) => task.status !== targetStatus);
        const reorderedTasks = reordered.map((id) =>
          prev.find((task) => task._id === id)
        );
        return [...otherTasks, ...reorderedTasks];
      });
    }
  }

  // ─── Group tasks by status ────────────────────────────────
  const tasksByStatus = (status) => tasks.filter((task) => task.status === status);

  // ─── Render ───────────────────────────────────────────────
  return (
    <div className="board-page">

      {/* ── Navbar ── */}
      <header className="navbar">
        <div className="navbar-brand">
          <span className="navbar-logo"><MdFolderCopy /></span>
          <span className="navbar-title">Kanban Board</span>
        </div>
        <div className="navbar-right">
          <span><FaUser /></span>
          <span className="navbar-user">{user?.name || "User"}</span>
          <button className="btn-logout" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {/* ── Board Controls ── */}
      <div className="board-controls">
        <h1 className="board-heading">My Board</h1>
        <button
          id="add-task-btn"
          className="btn-add-task"
          onClick={() => setShowModal(true)}
        >
          + New Task
        </button>
      </div>

      {/* ── States ── */}
      {loading && <div className="board-status">Loading tasks…</div>}
      {error   && <div className="board-status board-error">{error}</div>}

      {/* ── Columns ── */}
      {!loading && !error && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="board-columns">
            {STATUSES.map((status) => (
              <Column
                key={status}
                status={status}
                tasks={tasksByStatus(status)}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>

          {/* Floating ghost card while dragging */}
          <DragOverlay>
            {activeTask ? (
              <div className="task-card task-card-overlay">
                <p className="task-card-title">{activeTask.title}</p>
                {activeTask.assignedTo ? (
                  <p className="task-card-assignee">Assigned to: {activeTask.assignedTo.name}</p>
                ) : (
                  <p className="task-card-assignee">Unassigned</p>
                )}
                {activeTask.description && (
                  <p className="task-card-desc">{activeTask.description}</p>
                )}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* ── Add Task Modal ── */}
      {showModal && (
        <AddTaskModal
          onAdd={handleAddTask}
          onClose={() => setShowModal(false)}
          users={users}
        />
      )}
    </div>
  );
}