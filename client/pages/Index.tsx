import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Trash2,
  Plus,
  Quote,
  Sparkles,
  Calendar,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  text: string;
  category: "work" | "personal" | "urgent";
  completed: boolean;
  createdAt: Date;
}

interface Quote {
  text: string;
  author: string;
}

const quotes: Quote[] = [
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
  },
  {
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
  },
  { text: "Your limitation—it's only your imagination.", author: "Unknown" },
  {
    text: "Push yourself, because no one else is going to do it for you.",
    author: "Unknown",
  },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "Dream it. Wish it. Do it.", author: "Unknown" },
  {
    text: "Success doesn't just find you. You have to go out and get it.",
    author: "Unknown",
  },
  {
    text: "The harder you work for something, the greater you'll feel when you achieve it.",
    author: "Unknown",
  },
  { text: "Dream bigger. Do bigger.", author: "Unknown" },
  {
    text: "Don't stop when you're tired. Stop when you're done.",
    author: "Unknown",
  },
];

const categoryColors = {
  work: {
    bg: "bg-blue-50/80",
    border: "border-l-blue-500",
    badge: "bg-blue-100 text-blue-800",
    icon: "text-blue-600",
  },
  personal: {
    bg: "bg-green-50/80",
    border: "border-l-green-500",
    badge: "bg-green-100 text-green-800",
    icon: "text-green-600",
  },
  urgent: {
    bg: "bg-red-50/80",
    border: "border-l-red-500",
    badge: "bg-red-100 text-red-800",
    icon: "text-red-600",
  },
};

export default function Index() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "work" | "personal" | "urgent"
  >("work");
  const [dailyQuote, setDailyQuote] = useState<Quote>();
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  useEffect(() => {
    // Set daily quote (same quote per day)
    const today = new Date().toDateString();
    const savedQuote = localStorage.getItem(`quote-${today}`);

    if (savedQuote) {
      setDailyQuote(JSON.parse(savedQuote));
    } else {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setDailyQuote(randomQuote);
      localStorage.setItem(`quote-${today}`, JSON.stringify(randomQuote));
    }

    // Load tasks from localStorage
    const savedTasks = localStorage.getItem("daily-tasks");
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
      }));
      setTasks(parsedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("daily-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      text: newTask.trim(),
      category: selectedCategory,
      completed: false,
      createdAt: new Date(),
    };

    setTasks((prev) => [...prev, task]);
    setNewTask("");
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();

    if (!draggedTask || draggedTask === targetId) return;

    const draggedIndex = tasks.findIndex((task) => task.id === draggedTask);
    const targetIndex = tasks.findIndex((task) => task.id === targetId);

    const newTasks = [...tasks];
    const draggedTaskObj = newTasks[draggedIndex];
    newTasks.splice(draggedIndex, 1);
    newTasks.splice(targetIndex, 0, draggedTaskObj);

    setTasks(newTasks);
    setDraggedTask(null);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const completedCount = tasks.filter((task) => task.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4 flex items-center justify-center gap-3">
            <Sparkles className="text-yellow-500 animate-pulse" />
            Daily Goals
            <Sparkles className="text-yellow-500 animate-pulse" />
          </h1>
          <p className="text-black/80 text-lg">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Daily Quote */}
        {dailyQuote && (
          <Card className="glass-card p-6 mb-8 animate-slide-in">
            <div className="flex items-start gap-4">
              <Quote className="text-black/60 flex-shrink-0 mt-1" size={24} />
              <div>
                <p className="text-black text-lg italic mb-2">
                  "{dailyQuote.text}"
                </p>
                <p className="text-black/70 text-sm">— {dailyQuote.author}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Progress Bar */}
        <Card className="glass-card p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-black/90 font-medium">Progress</span>
            <span className="text-black/70 text-sm">
              {completedCount} of {totalCount} completed
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full transition-all duration-500 ease-out"
              style={{
                width:
                  totalCount > 0
                    ? `${(completedCount / totalCount) * 100}%`
                    : "0%",
              }}
            ></div>
          </div>
        </Card>

        {/* Add Task Form */}
        <Card className="glass-card p-6 mb-6">
          <div className="space-y-4">
            <Label className="text-black text-lg font-medium">
              Add New Task
            </Label>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="What do you need to accomplish today?"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTask()}
                  className="bg-white/20 border-white/30 text-black placeholder:text-black/50 focus:border-white/50"
                />
              </div>
              <Select
                value={selectedCategory}
                onValueChange={(value: "work" | "personal" | "urgent") =>
                  setSelectedCategory(value)
                }
              >
                <SelectTrigger className="w-full md:w-40 bg-white/20 border-white/30 text-black">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={addTask}
                className="bg-white/20 hover:bg-white/30 text-black border-white/30 hover:border-white/50"
                size="default"
              >
                <Plus size={20} />
              </Button>
            </div>
          </div>
        </Card>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-white/10 rounded-lg p-1">
            {[
              { key: "all", label: "All" },
              { key: "active", label: "Active" },
              { key: "completed", label: "Completed" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-all",
                  filter === tab.key
                    ? "bg-white text-purple-600 shadow-md"
                    : "text-black/70 hover:text-black hover:bg-white/10",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <Card className="glass-card p-8 text-center">
              <Calendar className="mx-auto text-black/50 mb-4" size={48} />
              <p className="text-black/70 text-lg">
                {filter === "completed"
                  ? "No completed tasks yet"
                  : filter === "active"
                    ? "No active tasks"
                    : "No tasks yet. Add one above to get started!"}
              </p>
            </Card>
          ) : (
            filteredTasks.map((task) => {
              const categoryStyle = categoryColors[task.category];
              return (
                <Card
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, task.id)}
                  className={cn(
                    "task-card p-4 cursor-move hover:scale-[1.02] transition-all duration-200",
                    categoryStyle.bg,
                    categoryStyle.border,
                    task.completed && "opacity-60",
                    draggedTask === task.id && "scale-105 rotate-2",
                  )}
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={cn(
                        "flex-shrink-0 transition-colors",
                        categoryStyle.icon,
                        task.completed && "text-green-600",
                      )}
                    >
                      {task.completed ? (
                        <CheckCircle2 size={24} />
                      ) : (
                        <Circle size={24} />
                      )}
                    </button>

                    <div className="flex-1">
                      <p
                        className={cn(
                          "text-gray-800 font-medium",
                          task.completed && "line-through text-gray-500",
                        )}
                      >
                        {task.text}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={categoryStyle.badge}>
                          {task.category.charAt(0).toUpperCase() +
                            task.category.slice(1)}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {task.createdAt.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTask(task.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-black/60">
          <p className="text-sm">
            Drag and drop tasks to reorder • Data saved locally
          </p>
        </div>
      </div>
    </div>
  );
}
