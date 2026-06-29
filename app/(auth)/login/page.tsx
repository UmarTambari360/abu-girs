import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import LoginClient from "../LoginClient";

export const metadata = {
  title: "Sign In — GIRS",
  description: "Sign in to the GIRS admin panel",
};

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect("/admin");
  }

  return <LoginClient />;
}
