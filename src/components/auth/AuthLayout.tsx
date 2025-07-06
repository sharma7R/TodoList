import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Apple-style navigation */}
      <header className="fixed top-0 z-50 w-full bg-[rgba(255,255,255,0.8)] backdrop-blur-md border-b border-[#f5f5f7]/30">
        <div className="flex h-12 items-center justify-between px-6">
          <a href="/" className="font-medium text-xl hover:underline">TodoList</a>
          {user && (
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
          )}
        </div>
      </header>

      <div className="min-h-screen flex items-center justify-center pt-12">
        <div className="max-w-md w-full px-4">
          <div className="text-center mb-8">
            <p className="text-3xl font-semibold text-gray-700 mt-2">
              Sign in to access your account
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
