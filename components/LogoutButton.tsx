'use client';

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh(); // Refresh to update server components state
  };

  return (
    <button onClick={handleLogout} className="flex w-full items-center text-red-600 focus:text-red-600 cursor-pointer">
        <LogOut className="me-2 h-4 w-4" />
        <span>خروج</span>
    </button>
  );
}
