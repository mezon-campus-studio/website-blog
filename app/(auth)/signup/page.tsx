import SignUpPage from "@/features/auth/components/SignUpPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | The Curator",
  description: "Create a new account"
};

export default function Page() {
  return (
    <div className="curator-theme">
      <SignUpPage />
    </div>
  );
}
