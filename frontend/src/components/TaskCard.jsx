import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { RiEditFill } from "react-icons/ri";
import { RxCross1 } from "react-icons/rx";

export default function TaskCard({ task, onDelete, /* onEdit */ }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="task-card"
    >
      {/* Drag handle area */}
      <div className="task-card-drag" {...attributes} {...listeners}>
        <span className="drag-icon">⠿</span>
      </div>

      {/* Content */}
      <div className="task-card-content">
        <p className="task-card-title">{task.title}</p>
        {task.assignedTo ? (
          <p className="task-card-assignee">Assigned to: {task.assignedTo.name}</p>
        ) : (
          <p className="task-card-assignee">Unassigned</p>
        )}
        {task.description && (
          <p className="task-card-desc">{task.description}</p>
        )}
      </div>

      {/* Edit */}
      <button
        className="task-card-edit"
        // onClick={() => onEdit(task._id)}
        title="Edit task"
      >
        <RiEditFill />
      </button>

      {/* Delete */}
      <button
        className="task-card-delete"
        onClick={() => onDelete(task._id)}
        title="Delete task"
      >
        <RxCross1 />
      </button>
    </div>
  );
}
