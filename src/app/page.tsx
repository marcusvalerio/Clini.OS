import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export default function HomePage() {
  if (!auth) redirect("/setup");
  redirect("/dashboard");
}
