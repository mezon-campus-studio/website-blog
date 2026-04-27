import LoginPage from "@/features/auth/components/LoginPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | The Curator",
};

export default function Page() {
  return <LoginPage />;
}