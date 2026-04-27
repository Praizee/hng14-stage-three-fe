"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { HabitList } from "@/components/habits/HabitList";
import { logout, getSession } from "@/lib/auth";
import { useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const [email] = useState<string>(() => getSession()?.email ?? "");

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const initial = email ? email[0]?.toUpperCase() : "?";

  return (
    <ProtectedRoute>
      <main
        data-testid="dashboard-page"
        className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-5 py-6"
      >
        <header className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              aria-hidden
              className="grid h-10 w-10 place-items-center rounded-full bg-slate-900 text-sm font-semibold text-white"
            >
              {initial}
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-semibold tracking-tight">
                Your habits
              </h1>
              {email && (
                <p className="truncate text-xs text-slate-500" title={email}>
                  {email}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            data-testid="auth-logout-button"
            onClick={handleLogout}
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 active:bg-slate-100"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Log out</span>
            <span className="sr-only sm:hidden">Log out</span>
          </button>
        </header>
        <HabitList />
      </main>
    </ProtectedRoute>
  );
}

