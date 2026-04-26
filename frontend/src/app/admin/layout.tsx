import { AppShell } from "@/components/dashboard/AppShell";
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AppShell role="admin">{children}</AppShell>;
}
