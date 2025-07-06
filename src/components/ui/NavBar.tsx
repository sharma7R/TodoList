import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 flex items-center justify-between px-6 h-16 shadow-sm">
      <span className="font-bold text-xl tracking-tight text-black cursor-pointer" onClick={() => navigate("/")}>TodoList</span>
      <Button variant="outline" onClick={() => navigate("/")}>Go Home</Button>
    </header>
  );
} 