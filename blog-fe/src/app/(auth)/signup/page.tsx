import SignUpPage from "@/features/auth/components/SignUpPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Memorizz",
  description: "Create a new account"
};

export default function Page() {
  return (
    <div className="memorizz-theme">
      <SignUpPage />
    </div>
  );
}
