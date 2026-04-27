import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5 py-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-slate-600">Log in to continue your streaks.</p>
        </div>
        <LoginForm />
      </div>
      <p className="mt-6 text-center text-sm text-slate-600">
        Don&apos;t have an account?{' '}
        <a href="/signup" className="font-medium text-slate-900 underline underline-offset-2">
          Sign up
        </a>
      </p>
    </main>
  );
}
