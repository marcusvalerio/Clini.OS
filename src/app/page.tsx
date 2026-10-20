import { redirect } from "next/navigation";

export default function HomePage() {
  // Public read-only preview with fictional data. Operational dashboard remains authenticated.
  redirect("/demo");
}
