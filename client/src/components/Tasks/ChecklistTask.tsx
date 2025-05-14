import type React from "react";
import type { Task, ChecklistItem } from "@/types/task.type";
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
import { ChecklistDropdown } from "./ChecklistDropdown";

interface ChecklistTaskProps {
  task: Task;
  onToggleComplete: () => void;
  onRemove: () => void;
  onToggleChecklistItem: (itemId: string) => void;
  onAddChecklistItem?: (text: string) => void;
  onRemoveChecklistItem?: (itemId: string) => void;
  onEdit: (updatedTask: Task) => void;
}

export const ChecklistTask: React.FC<ChecklistTaskProps> = ({
  task,
  onToggleComplete,
  onRemove,
  onToggleChecklistItem,
  onAddChecklistItem,
  onRemoveChecklistItem,
  onEdit,
}) => {
  const items: ChecklistItem[] = task.checklistItems ?? [];
  const completedCount = items.filter((item) => item.completed).length;
  const totalCount = items.length;
  const percentComplete =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <Card
      className={`transition-all hover:shadow-md border-l-4 border-green-500 relative ${
        task.completed ? "bg-gray-50" : "bg-white"
      }`}
    >
      <CardHeader className="flex justify-between p-3 border-b">
        <div className="flex items-center space-x-2">
          <Badge
            variant="outline"
            className="bg-green-50 text-green-600 border-green-200"
          >
            Task # {task.id}
          </Badge>
          <Badge
            variant="outline"
            className="bg-green-50 text-green-600 border-green-200"
          >
            Checklist
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

      <CardContent className="p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <h3
            className={`text-left font-bold text-base truncate mb-1 ${
              task.completed ? "line-through text-gray-500" : "text-gray-900"
            }`}
          >
            {task.title}
          </h3>
          <div className="h-24 mb-2 overflow-hidden">
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
        </div>

        <div className="border-t md:border-t-0 md:border-l pt-2 md:pt-0 md:pl-3 md:ml-0">
          <ChecklistDropdown
            items={items}
            onToggleItem={onToggleChecklistItem}
            onAddItem={onAddChecklistItem}
            onRemoveItem={onRemoveChecklistItem}
          />
        </div>
      </CardContent>

      <div className="px-3 pb-2">
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-green-500 h-1.5 rounded-full"
            style={{ width: `${percentComplete}%` }}
          ></div>
        </div>
      </div>

      <CardFooter className="p-3 flex justify-between items-center border-t">
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
};

export default ChecklistTask;
