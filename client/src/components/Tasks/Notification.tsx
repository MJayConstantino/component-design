import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";

// Observer Pattern: Notification component for task changes
interface NotificationProps {
  children: ReactNode;
}

export function Notification({ children }: NotificationProps) {
  return (
    <div className="absolute -top-2 left-0 right-0 z-10 bg-red-100 border-l-4 border-red-500 text-red-700 px-3 py-2 rounded-md mb-2 flex items-center gap-2 shadow-md">
      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
      <span className="text-sm font-bold">{children}</span>
    </div>
  );
}
