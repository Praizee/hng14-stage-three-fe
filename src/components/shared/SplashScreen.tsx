import { Star } from "lucide-react";

export function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="flex min-h-dvh flex-col items-center justify-center bg-linear-to-br from-slate-900 via-slate-900 to-slate-800 text-white"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative grid h-16 w-16 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur">
          <Star className="h-7 w-7 text-emerald-300" aria-hidden />
          <span className="absolute -inset-1 animate-pulse rounded-2xl ring-1 ring-emerald-400/20" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Habit Tracker
          </h1>
          <p className="text-sm text-white/60">
            Build streaks, one day at a time.
          </p>
        </div>
      </div>
    </div>
  );
}

