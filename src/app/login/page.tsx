import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Log in</h1>
      <LoginForm />
      <p className="mt-6 text-sm text-slate-600">
        Don&apos;t have an account?{' '}
        <a href="/signup" className="font-medium text-slate-900 underline">
          Sign up
        </a>
      </p>
    </main>
  );
}
