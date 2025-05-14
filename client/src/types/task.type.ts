export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  type: "basic" | "timed" | "checklist";
  checklistItems?: ChecklistItem[];
}
