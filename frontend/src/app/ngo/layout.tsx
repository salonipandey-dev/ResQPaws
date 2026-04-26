import { AppShell } from "@/components/dashboard/AppShell";
export default function NgoLayout({ children }: { children: React.ReactNode }) {
  return <AppShell role="ngo">{children}</AppShell>;
}
