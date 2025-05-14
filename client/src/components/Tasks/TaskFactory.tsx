import type React from "react";
import type { Task } from "@/types/task.type";
import { BasicTask } from "./BasicTask";
import { TimedTask } from "./TimedTask";
import { ChecklistTask } from "./ChecklistTask";

interface TaskFactoryProps {
  type: Task["type"];
  task: Task;
  onToggleComplete: () => void;
  onRemove: () => void;
  onToggleChecklistItem?: (itemId: string) => void;
  onAddChecklistItem?: (text: string) => void;
  onRemoveChecklistItem?: (itemId: string) => void;
  onEdit: (updatedTask: Task) => void;
}

export const TaskFactory: React.FC<TaskFactoryProps> = ({
  type,
  task,
  onToggleComplete,
  onRemove,
  onToggleChecklistItem = () => {},
  onAddChecklistItem = () => {},
  onRemoveChecklistItem = () => {},
  onEdit,
}) => {
  switch (type) {
    case "basic":
      return (
        <BasicTask
          task={task}
          onToggleComplete={onToggleComplete}
          onRemove={onRemove}
          onEdit={onEdit}
        />
      );

    case "timed":
      return (
        <TimedTask
          task={task}
          onToggleComplete={onToggleComplete}
          onRemove={onRemove}
          onEdit={onEdit}
        />
      );

    case "checklist":
      return (
        <ChecklistTask
          task={task}
          onToggleComplete={onToggleComplete}
          onRemove={onRemove}
          onToggleChecklistItem={onToggleChecklistItem}
          onAddChecklistItem={onAddChecklistItem}
          onRemoveChecklistItem={onRemoveChecklistItem}
          onEdit={onEdit}
        />
      );

    default:
      return (
        <BasicTask
          task={task}
          onToggleComplete={onToggleComplete}
          onRemove={onRemove}
          onEdit={onEdit}
        />
      );
  }
};
