export function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="flex min-h-dvh flex-col items-center justify-center bg-slate-900 text-white"
    >
      <div className="flex flex-col items-center gap-2">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/10 text-2xl font-semibold">
          HT
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Habit Tracker</h1>
        <p className="text-sm text-white/60">Loading…</p>
      </div>
    </div>
  );
}
