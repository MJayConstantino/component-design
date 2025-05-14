import * as React from "react";
import { CheckSquare, ChevronDown, Plus, X } from "lucide-react";
import type { ChecklistItem } from "@/types/task.type";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChecklistDropdownProps {
  items: ChecklistItem[];
  onToggleItem: (itemId: string) => void;
  onAddItem?: (text: string) => void;
  onRemoveItem?: (itemId: string) => void;
}

export function ChecklistDropdown({
  items,
  onToggleItem,
  onAddItem,
  onRemoveItem,
}: ChecklistDropdownProps) {
  const [newText, setNewText] = React.useState("");
  const completedCount = items.filter((item) => item.completed).length;
  const totalCount = items.length;
  const percentComplete =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const addItem = () => {
    if (!newText.trim() || !onAddItem) return;
    onAddItem(newText.trim());
    setNewText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <CheckSquare className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-gray-700">Checklist</span>
        </div>
        <span className="text-xs text-gray-500">
          {completedCount}/{totalCount} completed
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className="bg-green-500 h-1.5 rounded-full"
          style={{ width: `${percentComplete}%` }}
        ></div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between text-left font-normal h-auto py-2"
          >
            <span className="truncate">
              {totalCount > 0
                ? `${completedCount}/${totalCount} items completed`
                : "No items"}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] p-2"
          align="start"
        >
          <div className="max-h-48 overflow-y-auto overflow-x-hidden custom-scrollbar space-y-1">
            {items.length > 0 ? (
              <ul className="space-y-1">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-1 text-sm">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => onToggleItem(item.id)}
                      id={`item-${item.id}`}
                      className="h-4 w-4 border-green-400 data-[state=checked]:bg-green-600 flex-shrink-0"
                    />
                    <span
                      className={`truncate flex-1 max-w-[calc(100%-2rem)] ${
                        item.completed
                          ? "line-through text-gray-500"
                          : "text-gray-700"
                      }`}
                      title={item.text}
                    >
                      {item.text}
                    </span>
                    {onRemoveItem && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveItem(item.id)}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-red-500 flex-shrink-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center justify-center h-16 bg-gray-50 rounded">
                <p className="text-sm text-gray-500 italic">No items yet</p>
              </div>
            )}
          </div>

          {onAddItem && (
            <div className="flex items-center gap-1 mt-2 pt-2 border-t">
              <Input
                placeholder="Add item"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-7 text-sm"
                maxLength={50}
              />
              <Button
                type="button"
                size="sm"
                onClick={addItem}
                className="h-7 w-7 p-0 bg-green-600 hover:bg-green-700 flex-shrink-0"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
