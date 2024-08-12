"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { logout } from "@/lib/pocketbase";
import { Button } from "@/components/ui/button";
import { Home, PlusCircle, List, User, LogOut } from "lucide-react";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-8">Idea Tracker</h1>
      <nav className="space-y-2">
        <Link href="/dashboard">
          <Button
            variant={isActive("/dashboard") ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </Link>
        <Link href="/ideas">
          <Button
            variant={isActive("/ideas") ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <List className="mr-2 h-4 w-4" />
            My Ideas
          </Button>
        </Link>
        <Link href="/ideas/new">
          <Button
            variant={isActive("/ideas/new") ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Idea
          </Button>
        </Link>
        <Link href="/profile">
          <Button
            variant={isActive("/profile") ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </Link>
      </nav>
      <Button
        variant="ghost"
        className="w-full justify-start mt-8"
        onClick={handleLogout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </div>
  );
}
