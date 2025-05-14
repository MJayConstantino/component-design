import type { Task } from "@/types/task.type";

export class TaskSortingStrategy {
  // Sort by due date (earliest first)
  public static sortByDate(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }

  // sort by name - alphabetically
  public static sortByName(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => a.title.localeCompare(b.title));
  }

  // sort by id - oldest to most recent
  public static sortById(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => {
      const idA = Number(a.id);
      const idB = Number(b.id);

      return idA - idB;
    });
  }

  // sort by completion - incomplet first
  public static sortByCompletion(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return a.completed ? 1 : -1;
    });
  }
}
