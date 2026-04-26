import LoginPage from "@/features/auth/components/LoginPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | The Curator",
};

export default function Page() {
  return (
    <div className="curator-theme">
      <LoginPage />
    </div>
  );
}