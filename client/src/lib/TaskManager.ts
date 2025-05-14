import { useState } from "react";
import { Task, ChecklistItem } from "@/types/task.type";
import { useToast } from "@/hooks/use-toast";

export function TaskManager() {
  const baseUrl = "http://localhost:3001/api/tasks";
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  const parseChecklistItems = (raw: any): ChecklistItem[] => {
    if (Array.isArray(raw)) return raw;
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  };

  // Add a new task
  const addTask = async (task: Omit<Task, "id">) => {
    try {
      const body = {
        ...task,
        checklist: JSON.stringify(task.checklistItems || []),
      };
      const response = await fetch(`${baseUrl}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error("Failed to add task");
      const newTask: any = await response.json();
      const parsed = {
        ...newTask,
        checklistItems: parseChecklistItems(newTask.checklist),
      };
      setTasks((prev) => [...prev, parsed]);
      toast({
        title: "Task added",
        description: "Task added successfully",
        variant: "default",
      });
      return parsed;
    } catch (error) {
      console.error("Error adding task:", error);
      toast({
        title: "Add failed",
        description: "Failed to add task",
        variant: "destructive",
      });
      return task as Task;
    }
  };

  // Remove a task by id
  const removeTask = async (id: string) => {
    try {
      const response = await fetch(`${baseUrl}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete task");
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast({ title: "Task removed", variant: "default" });
    } catch (error) {
      console.error("Error removing task:", error);
      toast({ title: "Remove failed", variant: "destructive" });
    }
  };

  // Update a task
  const updateTask = async (updated: Task) => {
    try {
      const body = {
        ...updated,
        checklist: JSON.stringify(updated.checklistItems || []),
      };
      const response = await fetch(`${baseUrl}/${updated.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error("Failed to update task");
      const saved: any = await response.json();
      const parsed = {
        ...saved,
        checklistItems: parseChecklistItems(saved.checklist),
      };
      setTasks((prev) => prev.map((t) => (t.id === parsed.id ? parsed : t)));
      toast({
        title: "Task updated",
        description: "Task updated succesfully",
        variant: "default",
      });
      return parsed;
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Update failed",
        description: "Failed to update task",
        variant: "destructive",
      });
      return updated;
    }
  };

  // Toggle checklist item completion
  const toggleChecklistItem = async (taskId: string, itemId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task?.checklistItems) return;
    const updatedItems = task.checklistItems.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    return updateTask({ ...task, checklistItems: updatedItems });
  };

  // Toggle task completion status
  const toggleTaskComplete = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    return updateTask({ ...task, completed: !task.completed });
  };

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const response = await fetch(`${baseUrl}`);
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data: any[] = await response.json();
      const adapted: Task[] = data.map((api) => ({
        id: api.id,
        title: api.title,
        description: api.description,
        completed: api.completed,
        dueDate: api.dueDate ? new Date(api.dueDate) : undefined,
        type: api.type,
        checklistItems: parseChecklistItems(api.checklist),
      }));
      setTasks(adapted);
      toast({ title: "Tasks loaded", variant: "default" });
      return adapted;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast({ title: "Fetch failed", variant: "destructive" });
    }
  };

  const addChecklistItem = (taskId: string, text: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const newItem: ChecklistItem = {
      id: `cl-${Date.now()}`,
      text,
      completed: false,
    };
    return updateTask({
      ...task,
      checklistItems: [...(task.checklistItems ?? []), newItem],
    });
  };

  // Remove a checklist item by filtering and updating
  const removeChecklistItem = (taskId: string, itemId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    return updateTask({
      ...task,
      checklistItems: (task.checklistItems ?? []).filter(
        (i) => i.id !== itemId
      ),
    });
  };

  return {
    tasks,
    addTask,
    removeTask,
    updateTask,
    toggleTaskComplete,
    toggleChecklistItem,
    fetchTasks,
    addChecklistItem,
    removeChecklistItem,
  };
}
