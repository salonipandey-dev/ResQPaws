import { AppShell } from "@/components/dashboard/AppShell";
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AppShell role="user">{children}</AppShell>;
}
