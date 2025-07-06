import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabase/supabase";
import { useAuth } from "../../../supabase/auth";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  created_at: string;
}

export default function TodoDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [editInput, setEditInput] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Redirect to login if not signed in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // Fetch todos from Supabase
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from("tasks")
      .select("id, text, completed, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setTodos(data || []);
        setLoading(false);
      });
  }, [user]);

  const addTodo = async () => {
    if (input.trim() === "" || !user) return;
    setSaving(true);
    const { data, error } = await supabase
      .from("tasks")
      .insert({ text: input.trim(), completed: false, user_id: user.id })
      .select()
      .single();
    setSaving(false);
    if (error) setError(error.message);
    else if (data) setTodos(todos => [...todos, data]);
    setInput("");
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    const { error } = await supabase
      .from("tasks")
      .update({ completed: !completed })
      .eq("id", id)
      .eq("user_id", user?.id);
    if (error) setError(error.message);
    else setTodos(todos => todos.map(todo => todo.id === id ? { ...todo, completed: !completed } : todo));
  };

  const startEdit = (id: string, text: string) => {
    setEditId(id);
    setEditInput(text);
  };

  const saveEdit = async (id: string) => {
    if (!user) return;
    const { error } = await supabase
      .from("tasks")
      .update({ text: editInput })
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) setError(error.message);
    else setTodos(todos => todos.map(todo => todo.id === id ? { ...todo, text: editInput } : todo));
    setEditId(null);
    setEditInput("");
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditInput("");
  };

  const deleteTodo = async (id: string) => {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id)
      .eq("user_id", user?.id);
    if (error) setError(error.message);
    else setTodos(todos => todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 flex items-center justify-between px-6 h-16 shadow-sm">
        <span className="font-bold text-xl tracking-tight text-black">TodoList</span>
        <Button variant="outline" onClick={() => navigate("/")}>Go Home</Button>
      </header>
      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Todo Dashboard</h1>
          {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
          <div className="flex gap-2 mb-6">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Add a new task..."
              onKeyDown={e => { if (e.key === "Enter") addTodo(); }}
              className="flex-1"
              disabled={saving}
            />
            <Button onClick={addTodo} className="bg-black text-white" disabled={saving}>Add</Button>
          </div>
          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading...</div>
          ) : (
            <ul className="space-y-3">
              {todos.length === 0 && (
                <li className="text-gray-400 text-center">No tasks yet. Add one!</li>
              )}
              {todos.map(todo => (
                <li
                  key={todo.id}
                  className={`flex items-center justify-between bg-gray-100 rounded-lg px-4 py-2 ${todo.completed ? "opacity-60" : ""}`}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleComplete(todo.id, todo.completed)}
                      className="accent-black w-5 h-5"
                    />
                    {editId === todo.id ? (
                      <>
                        <Input
                          value={editInput}
                          onChange={e => setEditInput(e.target.value)}
                          className="flex-1"
                          onKeyDown={e => { if (e.key === "Enter") saveEdit(todo.id); if (e.key === "Escape") cancelEdit(); }}
                          autoFocus
                        />
                        <Button size="sm" onClick={() => saveEdit(todo.id)} className="ml-2">Save</Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit} className="ml-1">Cancel</Button>
                      </>
                    ) : (
                      <span
                        className={`flex-1 text-left ${todo.completed ? "line-through text-gray-500" : "text-gray-900"}`}
                      >
                        {todo.text}
                      </span>
                    )}
                  </div>
                  {editId !== todo.id && (
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => startEdit(todo.id, todo.text)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteTodo(todo.id)}>
                        Delete
                      </Button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
} 