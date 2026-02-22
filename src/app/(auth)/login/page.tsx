import { Suspense } from "react";
import { login } from "@/features/auth/actions/auth.action";
import { AuthForm } from "@/features/auth/components/AuthForm";

export default function LoginPage() {
  return (
    <Suspense>
      <AuthForm
        title="アカウントにログイン"
        buttonText="ログイン"
        action={login}
        isLogin={true}
      />
    </Suspense>
  );
}
