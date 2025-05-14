import type React from "react";
import type { Task } from "@/types/task.type";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import DeleteTaskDialog from "./DeleteTaskDialog";
import EditTaskDialog from "./EditTaskDialog";

interface TimedTaskProps {
  task: Task;
  onToggleComplete: () => void;
  onRemove: () => void;
  onEdit: (updatedTask: Task) => void;
}

export const TimedTask: React.FC<TimedTaskProps> = ({
  task,
  onToggleComplete,
  onRemove,
  onEdit,
}) => (
  <Card
    className={`transition-all hover:shadow-md border-l-4 border-blue-500 relative ${
      task.completed ? "bg-gray-50" : "bg-white"
    }`}
  >
    <CardHeader className="flex justify-between p-3 border-b">
      <div className="flex items-center space-x-2">
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-600 border-blue-200"
        >
          Task # {task.id}
        </Badge>
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-600 border-blue-200"
        >
          Timed
        </Badge>
        {task.dueDate && (
          <Badge
            variant="secondary"
            className="bg-gray-100 text-gray-800 flex items-center space-x-1"
          >
            <Clock className="h-3 w-3" />
            <span className="text-xs">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </span>
          </Badge>
        )}
      </div>
    </CardHeader>

    <CardContent className="p-2">
      <h3
        className={`text-left font-bold text-base truncate mb-1 ${
          task.completed ? "line-through text-gray-500" : "text-gray-900"
        }`}
      >
        {task.title}
      </h3>
      <div className="mb-2 h-24 overflow-hidden">
        {task.description ? (
          <p className="text-sm text-left text-gray-700 overflow-y-auto max-h-24">
            {task.description}
          </p>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50 rounded">
            <p className="text-sm text-gray-400 italic">No description</p>
          </div>
        )}
      </div>
    </CardContent>

    <CardFooter className="p-3 flex justify-between items-center border-t mt-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={task.completed}
          onCheckedChange={onToggleComplete}
          id={task.id}
          className="h-4 w-4 bg-white border-black"
        />
        <span className="text-sm">Mark as complete</span>
      </div>
      <div className="space-x-2">
        <EditTaskDialog task={task} onSave={onEdit} />
        <DeleteTaskDialog onConfirm={onRemove} />
      </div>
    </CardFooter>
  </Card>
);
