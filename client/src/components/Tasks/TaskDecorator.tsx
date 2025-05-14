import type { ReactNode } from "react";
import { Clock } from "lucide-react";

// Decorator Pattern: Add reminder icon for tasks with due dates
interface TaskDecoratorProps {
  hasDueDate: boolean;
  children: ReactNode;
}

export function TaskDecorator({ hasDueDate, children }: TaskDecoratorProps) {
  return (
    <div className="relative">
      {children}
      {hasDueDate && (
        <div className="absolute top-3 right-3 bg-blue-100 rounded-full p-1.5 shadow-sm">
          <Clock className="h-4 w-4 text-blue-600" />
        </div>
      )}
    </div>
  );
}
