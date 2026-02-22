import { Suspense } from "react";
import { signup } from "@/features/auth/actions/auth.action";
import { AuthForm } from "@/features/auth/components/AuthForm";

export default function SignupPage() {
  return (
    <Suspense>
      <AuthForm
        title="アカウントを作成"
        buttonText="登録する"
        action={signup}
        isLogin={false}
      />
    </Suspense>
  );
}
