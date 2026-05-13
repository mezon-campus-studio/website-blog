import LoginPage from "@/features/auth/components/LoginPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Memorizz",
};

export default function Page() {
  return (
    <div className="memorizz-theme">
      <LoginPage />
    </div>
  );
}