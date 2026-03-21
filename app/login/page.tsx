// app/login/page.tsx
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main id="main" className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-cyan-50 dark:from-[hsl(var(--page-gradient-from))] dark:via-[hsl(var(--page-gradient-via))] dark:to-[hsl(var(--page-gradient-to))]">
      <LoginForm />
    </main>
  );
}