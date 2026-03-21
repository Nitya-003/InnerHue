import SignupForm from "@/components/signupform";

export default function SignupPage() {
  return (
    <main id="main" className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-cyan-50 dark:from-[hsl(var(--page-gradient-from))] dark:via-[hsl(var(--page-gradient-via))] dark:to-[hsl(var(--page-gradient-to))]">
      <SignupForm />
    </main>
  );
}