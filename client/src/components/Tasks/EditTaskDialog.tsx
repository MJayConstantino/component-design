import React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Plus, X } from "lucide-react";
import type { Task, ChecklistItem } from "@/types/task.type";

// Zod schema
const editTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(50),
  description: z.string().max(200).optional(),
  completed: z.boolean(),
  dueDate: z.string().optional(),
  dueTime: z.string().optional(),
  newItem: z.string().optional(),
});

type EditTaskForm = z.infer<typeof editTaskSchema>;

interface EditTaskDialogProps {
  task: Task;
  onSave: (updatedTask: Task) => void;
}

const EditTaskDialog: React.FC<EditTaskDialogProps> = ({ task, onSave }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EditTaskForm>({
    resolver: zodResolver(editTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description || "",
      completed: task.completed,
      dueDate: task.dueDate
        ? new Date(task.dueDate).toISOString().slice(0, 10)
        : "",
      dueTime: task.dueDate
        ? new Date(task.dueDate).toTimeString().slice(0, 5)
        : "",
      newItem: "",
    },
  });
  const [open, setOpen] = React.useState(false);
  const [checklistItems, setChecklistItems] = React.useState<ChecklistItem[]>(
    task.checklistItems || []
  );

  const taskType = task.type;

  useEffect(() => {
    reset({
      title: task.title,
      description: task.description || "",
      completed: task.completed,
      dueDate: task.dueDate
        ? new Date(task.dueDate).toISOString().slice(0, 10)
        : "",
      dueTime: task.dueDate
        ? new Date(task.dueDate).toTimeString().slice(0, 5)
        : "",
      newItem: "",
    });
    setChecklistItems(task.checklistItems || []);
  }, [task, reset]);

  const onSubmit = (data: EditTaskForm) => {
    let updatedDueDate: Date | undefined;
    if (data.dueDate) {
      updatedDueDate = data.dueTime
        ? new Date(`${data.dueDate}T${data.dueTime}:00`)
        : new Date(`${data.dueDate}T00:00:00`);
    }

    const updated: Task = {
      ...task,
      title: data.title,
      description: data.description,
      completed: data.completed,
      dueDate: updatedDueDate,
    };
    if (taskType === "checklist") updated.checklistItems = checklistItems;
    onSave(updated);
    setOpen(false);
  };

  const addItem = () => {
    const text = watch("newItem");
    if (text?.trim()) {
      setChecklistItems([
        ...checklistItems,
        { id: `item-${Date.now()}`, text, completed: false },
      ]);
      setValue("newItem", "");
    }
  };

  const removeItem = (id: string) =>
    setChecklistItems(checklistItems.filter((i) => i.id !== id));
  const toggleItem = (id: string) =>
    setChecklistItems(
      checklistItems.map((i) =>
        i.id === id ? { ...i, completed: !i.completed } : i
      )
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        size="sm"
        onClick={() => setOpen(true)}
        className="text-gray-500 bg-white hover:text-gray-700 hover:bg-gray-50"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <DialogContent className="sm:max-w-md w-full max-h-screen p-0">
        <DialogHeader className="px-4 pt-4 pb-2 border-b">
          <DialogTitle className="text-lg">
            Edit {taskType.charAt(0).toUpperCase() + taskType.slice(1)} Task
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-8rem)]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="px-4 py-3 space-y-4"
          >
            <div>
              <Label
                htmlFor="title"
                className={errors.title ? "text-red-500" : ""}
              >
                Title
              </Label>
              <Input
                id="title"
                {...register("title")}
                className={errors.title ? "border-red-500" : ""}
                maxLength={50}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                rows={3}
                className="resize-none"
                maxLength={200}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="completed"
                checked={watch("completed")}
                onCheckedChange={(checked) => setValue("completed", !!checked)}
                className="bg-white border-black"
              />
              <Label htmlFor="completed" className="cursor-pointer">
                Mark as completed
              </Label>
            </div>

            {(taskType === "timed" || taskType === "checklist") && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <input
                    type="date"
                    {...register("dueDate")}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <Label htmlFor="dueTime">Due Time</Label>
                  <input
                    type="time"
                    {...register("dueTime")}
                    className="w-full border p-2 rounded"
                  />
                </div>
              </div>
            )}

            {taskType === "checklist" && (
              <div className="border rounded-md p-3 space-y-3 bg-gray-50">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Checklist Items</Label>
                  <span className="text-xs text-gray-500">
                    {checklistItems.filter((i) => i.completed).length}/
                    {checklistItems.length} completed
                  </span>
                </div>

                <div className="flex space-x-2">
                  <Input
                    placeholder="New item"
                    {...register("newItem")}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addItem())
                    }
                    className="h-8 text-sm"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={addItem}
                    className="h-8 w-8 p-0 flex-shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="max-h-40 overflow-y-auto space-y-1 custom-scrollbar pr-1">
                  {checklistItems.length > 0 ? (
                    <ul className="space-y-1">
                      {checklistItems.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center space-x-2 border p-2 rounded bg-white"
                        >
                          <Checkbox
                            checked={item.completed}
                            onCheckedChange={() => toggleItem(item.id)}
                            className="h-4 w-4 flex-shrink-0"
                          />
                          <span
                            className={`truncate text-sm flex-1 ${
                              item.completed ? "line-through text-gray-500" : ""
                            }`}
                            title={item.text}
                            id={item.text}
                          >
                            {item.text}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-red-500 flex-shrink-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex items-center justify-center h-16 bg-white rounded border">
                      <p className="text-sm text-gray-500 italic">
                        No items added yet
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </form>
        </div>

        <DialogFooter className="px-4 py-3 border-t">
          <div className="flex justify-end space-x-2 w-full">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit(onSubmit)}>
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskDialog;
