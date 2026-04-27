import type { Session, User } from '@/types/auth';
import { STORAGE_KEYS } from './constants';
import { readJSON, removeKey, writeJSON } from './storage';

type AuthResult =
  | { ok: true; session: Session }
  | { ok: false; error: string };

function loadUsers(): User[] {
  return readJSON<User[]>(STORAGE_KEYS.users, []);
}

function saveUsers(users: User[]): void {
  writeJSON(STORAGE_KEYS.users, users);
}

function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function signup(email: string, password: string): AuthResult {
  const e = normalizeEmail(email);
  if (!e) return { ok: false, error: 'Email is required' };
  if (!password) return { ok: false, error: 'Password is required' };

  const users = loadUsers();
  if (users.some((u) => u.email === e)) {
    return { ok: false, error: 'User already exists' };
  }

  const user: User = {
    id: uid(),
    email: e,
    password,
    createdAt: new Date().toISOString(),
  };
  saveUsers([...users, user]);

  const session: Session = { userId: user.id, email: user.email };
  writeJSON(STORAGE_KEYS.session, session);
  return { ok: true, session };
}

export function login(email: string, password: string): AuthResult {
  const e = normalizeEmail(email);
  const user = loadUsers().find((u) => u.email === e && u.password === password);
  if (!user) return { ok: false, error: 'Invalid email or password' };

  const session: Session = { userId: user.id, email: user.email };
  writeJSON(STORAGE_KEYS.session, session);
  return { ok: true, session };
}

export function logout(): void {
  removeKey(STORAGE_KEYS.session);
}

export function getSession(): Session | null {
  return readJSON<Session | null>(STORAGE_KEYS.session, null);
}
