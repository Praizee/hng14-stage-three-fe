const DAY_MS = 86_400_000;

function parseISODate(s: string): number {
  const [y, m, d] = s.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

function todayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function calculateCurrentStreak(completions: string[], today?: string): number {
  const ref = today ?? todayISO();
  const set = new Set(completions);
  if (!set.has(ref)) return 0;

  let streak = 0;
  let cursor = parseISODate(ref);
  while (true) {
    const iso = new Date(cursor).toISOString().slice(0, 10);
    if (set.has(iso)) {
      streak += 1;
      cursor -= DAY_MS;
    } else {
      break;
    }
  }
  return streak;
}
