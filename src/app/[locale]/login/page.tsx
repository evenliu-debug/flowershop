import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <Suspense fallback={<p className="text-slate-600">Loading…</p>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
