import { SignupForm } from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Create your account</h1>
      <SignupForm />
      <p className="mt-6 text-sm text-slate-600">
        Already have an account?{' '}
        <a href="/login" className="font-medium text-slate-900 underline">
          Log in
        </a>
      </p>
    </main>
  );
}
