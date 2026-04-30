import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard.jsx";

const COLUMN_META = {
  todo:       { label: "To Do",       color: "#6366f1", emoji: "📋" },
  inProgress: { label: "In Progress", color: "#f59e0b", emoji: "🔄️" },
  done:       { label: "Done",        color: "#10b981", emoji: "✅" },
};

export default function Column({ status, tasks, onDelete, }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const meta = COLUMN_META[status];
  const taskIds = tasks.map((task) => task._id);

  return (
    <div className={`column ${isOver ? "column-over" : ""}`}>
      {/* Column Header */}
      <div className="column-header">
        <div className="column-title-row">
          <span className="column-emoji">{meta.emoji}</span>
          <h2 className="column-title" style={{ color: meta.color }}>
            {meta.label}
          </h2>
        </div>
        <span className="column-count" style={{ background: meta.color }}>
          {tasks.length}
        </span>
      </div>

      {/* Drop zone with sortable tasks */}
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="column-body">
          {tasks.length === 0 ? (
            <div className="column-empty">Drop tasks here</div>
          ) : (
            tasks.map((task) => (
              <TaskCard key={task._id} task={task} onDelete={onDelete} />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}
