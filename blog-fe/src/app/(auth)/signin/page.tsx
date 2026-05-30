import LoginPage from "@/features/auth/components/LoginPage";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sign In | Memorizz",
};

export default function Page() {
  return (
    <div className="memorizz-theme">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginPage />
      </Suspense>
    </div>
  );
}