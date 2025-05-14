import type React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Clock, CheckSquare, Plus, X } from "lucide-react";
import type { Task, ChecklistItem } from "@/types/task.type";

// form schema
const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(50),
  description: z.string().max(200).optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  type: z.enum(["basic", "timed", "checklist"]),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormProps {
  onSubmit: (task: Omit<Task, "id">) => void;
  onCancel?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onCancel }) => {
  const [checklistItems, setChecklistItems] = useState<string[]>([]);
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [showDateFields, setShowDateFields] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      time: "",
      type: "basic",
    },
  });

  const taskType = watch("type");

  useEffect(() => {
    setShowDateFields(taskType === "timed" || taskType === "checklist");
  }, [taskType]);

  const addItem = () => {
    if (!newChecklistItem.trim()) return;
    setChecklistItems((list) => [...list, newChecklistItem.trim()]);
    setNewChecklistItem("");
  };

  const removeItem = (idx: number) => {
    setChecklistItems((list) => list.filter((_, i) => i !== idx));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
  };

  const onFormSubmit = (data: TaskFormValues) => {
    let dueDate: Date | undefined;
    if (showDateFields && data.date) {
      const iso = data.time
        ? `${data.date}T${data.time}:00`
        : `${data.date}T00:00:00`;
      dueDate = new Date(iso);
    }

    const payload: Omit<Task, "id"> = {
      title: data.title,
      description: data.description,
      completed: false,
      dueDate,
      type: data.type,
      checklistItems:
        data.type === "checklist"
          ? checklistItems.map<ChecklistItem>((text, idx) => ({
              id: `new-${Date.now()}-${idx}`,
              text,
              completed: false,
            }))
          : undefined,
    };

    onSubmit(payload);
  };

  const getTabStyle = (val: Task["type"]) => {
    switch (val) {
      case "basic":
        return "bg-purple-100 data-[state=active]:bg-purple-200 text-purple-800";
      case "timed":
        return "bg-blue-100 data-[state=active]:bg-blue-200 text-blue-800";
      case "checklist":
        return "bg-green-100 data-[state=active]:bg-green-200 text-green-800";
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="space-y-4 max-h-screen pr-1"
    >
      <Tabs
        value={taskType}
        onValueChange={(v) => setValue("type", v as any)}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 mb-4 gap-2">
          {(["basic", "timed", "checklist"] as Task["type"][]).map((val) => {
            const Icon =
              val === "basic"
                ? FileText
                : val === "timed"
                ? Clock
                : CheckSquare;
            return (
              <TabsTrigger key={val} value={val} className={getTabStyle(val)}>
                <Icon className="h-4 w-4 mr-1" />
                {val.charAt(0).toUpperCase() + val.slice(1)}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        <div>
          <Label className={errors.title ? "text-red-500" : ""}>Title</Label>
          <Input
            id="title"
            {...register("title")}
            className={errors.title ? "border-red-500" : ""}
            placeholder="Task title"
            maxLength={50}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>
        <div>
          <Label>Description</Label>
          <Textarea {...register("description")} rows={3} maxLength={200} />
        </div>
      </div>

      {showDateFields && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <input
              type="date"
              {...register("date")}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <Label htmlFor="dueTime">Due Time</Label>
            <input
              type="time"
              {...register("time")}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>
      )}

      {taskType === "checklist" && (
        <div className="border-2 p-3 rounded space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium">Checklist Items</Label>
            <span className="text-xs text-gray-500">
              {checklistItems.length} items
            </span>
          </div>

          <div className="flex gap-1">
            <Input
              placeholder="Add new item"
              value={newChecklistItem}
              onChange={(e) => setNewChecklistItem(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-8 text-sm"
              maxLength={50}
            />
            <Button
              type="button"
              size="sm"
              onClick={addItem}
              className="h-8 px-2"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="custom-scrollbar">
            {checklistItems.length > 0 ? (
              <ul className="space-y-1">
                {checklistItems.map((text, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between bg-white p-2 rounded border text-sm"
                  >
                    <span
                      className="truncate flex-1 max-w-[calc(100%-2rem)]"
                      id={text}
                    >
                      • {text}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(idx)}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-red-500 flex-shrink-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic text-center py-2">
                No items added yet
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" className="bg-black text-white">
          Create Task
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
