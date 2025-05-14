import { useState, useEffect } from "react";
import { TaskFactory } from "@/components/Tasks/TaskFactory";
import TaskForm from "@/components/Tasks/TaskForm";
import { TaskManager } from "@/lib/TaskManager";
import { TaskSortingStrategy } from "@/lib/TaskSortingStrategy";
import { Notification } from "@/components/Tasks/Notification";
import type { Task } from "@/types/task.type";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle, Filter, ClipboardList } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";

const MidtermsPage = () => {
  const taskManager = TaskManager();
  const [sortMethod, setSortMethod] = useState("date");
  const [sortedTasks, setSortedTasks] = useState<Task[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    taskManager.fetchTasks();
  }, []);

  useEffect(() => {
    let filteredTasks = taskManager.tasks;

    if (sortMethod === "date") {
      setSortedTasks(TaskSortingStrategy.sortByDate(filteredTasks));
    } else if (sortMethod === "name") {
      setSortedTasks(TaskSortingStrategy.sortByName(filteredTasks));
    } else {
      setSortedTasks(TaskSortingStrategy.sortById(filteredTasks));
    }
  }, [taskManager.tasks, sortMethod]);

  const handleAddTask = (task: Omit<Task, "id">) => {
    taskManager.addTask(task);
    setDialogOpen(false);
  };

  const handleEditTask = (updatedTask: Task) => {
    taskManager.updateTask(updatedTask);
  };

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <Toaster />
      <div className="m-5 text-center">
        <header className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              To Do List Application
            </h1>
            <div className="flex items-center gap-2">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-blue-500 text-white">
                    <PlusCircle className="h-5 w-5" />
                    <span>New Task</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-800">
                      Create New Task
                    </DialogTitle>
                  </DialogHeader>
                  <TaskForm
                    onSubmit={handleAddTask}
                    onCancel={() => setDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <Label className="font-medium text-gray-700">Sort By:</Label>
                <Select value={sortMethod} onValueChange={setSortMethod}>
                  <SelectTrigger className="w-[150px] border-gray-300">
                    <SelectValue placeholder="Select sort method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Due Date</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="id">ID</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </header>

        {sortedTasks.length === 0 ? (
          <Card className="bg-white border-gray-200">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-blue-100 p-4 mb-4">
                <ClipboardList className="h-12 w-12 text-blue-500" />
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                You don't have any tasks yet
              </h3>
              <p className="text-gray-500 mb-6 max-w-md text-center">
                Create your first task to get started with organizing your work
                and tracking your progress.
              </p>
              <Button
                onClick={() => setDialogOpen(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md flex items-center gap-2"
                size="lg"
              >
                <PlusCircle className="h-5 w-5" />
                Create Your First Task
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div
            className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"}
          >
            {sortedTasks.map((task) => (
              <div key={task.id} className="relative">
                {task.dueDate &&
                  new Date(task.dueDate) < new Date() &&
                  !task.completed && (
                    <Notification>This task is overdue!</Notification>
                  )}

                <TaskFactory
                  type={task.type}
                  task={task}
                  onToggleComplete={() =>
                    taskManager.toggleTaskComplete(task.id)
                  }
                  onRemove={() => taskManager.removeTask(task.id)}
                  onToggleChecklistItem={(itemId) =>
                    taskManager.toggleChecklistItem(task.id, itemId)
                  }
                  onAddChecklistItem={(text) =>
                    taskManager.addChecklistItem(task.id, text)
                  }
                  onRemoveChecklistItem={(itemId) =>
                    taskManager.removeChecklistItem(task.id, itemId)
                  }
                  onEdit={handleEditTask}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MidtermsPage;
