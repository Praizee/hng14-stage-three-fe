import { SignupForm } from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5 py-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
          <p className="text-sm text-slate-600">Start tracking your daily habits in seconds.</p>
        </div>
        <SignupForm />
      </div>
      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{' '}
        <a href="/login" className="font-medium text-slate-900 underline underline-offset-2">
          Log in
        </a>
      </p>
    </main>
  );
}
