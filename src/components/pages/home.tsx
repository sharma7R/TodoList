import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronRight, Settings, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";
import NavBar from "@/components/ui/NavBar";

export default function LandingPage() {
  const { user, signOut } = useAuth();

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-black">
      <NavBar />
      {/* Apple-style navigation */}
      <header className="fixed top-0 z-50 w-full bg-[rgba(255,255,255,0.8)] backdrop-blur-md border-b border-[#f5f5f7]/30">
        <div className="flex h-12 items-center justify-between px-6">
          <span className="font-medium text-xl">TodoList</span>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 ml-auto hover:cursor-pointer shadow-none bg-transparent">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                    alt={user.email || ""}
                  />
                  <AvatarFallback>
                    {user.email?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl border-none shadow-lg">
                <DropdownMenuLabel className="text-xs text-gray-500">{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onSelect={() => signOut()}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <a href="/login" className="flex items-center h-full">
              <button className="px-4 py-2 rounded-full bg-black text-white hover:bg-gray-800 text-sm font-medium flex items-center h-8 mt-2">Sign In</button>
            </a>
          )}
        </div>
      </header>

      <main className="pt-12">
        {/* Hero section */}
        <section className="py-20 text-center">
          <h2 className="text-5xl font-semibold tracking-tight mb-1">
            TodoList
          </h2>
          <h3 className="text-2xl font-medium text-gray-500 mb-4">
            Organize your tasks. Boost your productivity.
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            A clean, minimalist todo list application that helps you manage your
            tasks efficiently. Create, organize, and track your daily tasks with
            ease.
          </p>
          <div className="flex justify-center space-x-6 text-xl text-blue-600">
            {user ? (
              <Link
                to="/hi"
                className="flex items-center hover:underline"
              >
                View <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="flex items-center hover:underline"
                >
                  Get started <ChevronRight className="h-4 w-4" />
                </Link>
                <Link to="/login" className="flex items-center hover:underline">
                  Sign in <ChevronRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>
        </section>

        {/* Features section */}
        <section className="py-20 bg-[#f5f5f7] text-center">
          <h2 className="text-5xl font-semibold tracking-tight mb-1">
            Everything You Need
          </h2>
          <h3 className="text-2xl font-medium text-gray-500 mb-4">
            Powerful features to manage your tasks efficiently
          </h3>
          <div className="mt-8 max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6 justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-sm text-left">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-medium mb-2">Quick Task Creation</h4>
              <p className="text-gray-500">
                Add new tasks instantly with our simple input field and submit
                button.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm text-left">
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-medium mb-2">Task Management</h4>
              <p className="text-gray-500">
                Mark tasks as complete, edit task text, and delete tasks with
                ease.
              </p>
            </div>
          </div>
        </section>

        {/* Grid section for other features */}
        {/* The Secure & Personal section has been removed as requested. */}
      </main>

      {/* Footer removed as requested */}
    </div>
  );
}
