"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { LayoutDashboard, FilePlus2, MapPinned, Trophy, User, LogOut, Building2, ListChecks, Map, History, ShieldCheck, Users2, BarChart3, Settings, FileText } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type NavItem = { href: string; label: string; icon: any };

const USER_NAV: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/report", label: "Report Rescue", icon: FilePlus2 },
  { href: "/dashboard/track", label: "Track Cases", icon: MapPinned },
  { href: "/dashboard/rewards", label: "Rewards", icon: Trophy },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];
const NGO_NAV: NavItem[] = [
  { href: "/ngo", label: "Overview", icon: Building2 },
  { href: "/ngo/cases", label: "Active Cases", icon: ListChecks },
  { href: "/ngo/map", label: "Live Map", icon: Map },
  { href: "/ngo/history", label: "History", icon: History },
];
const ADMIN_NAV: NavItem[] = [
  { href: "/admin", label: "Overview", icon: ShieldCheck },
  { href: "/admin/users", label: "Users", icon: Users2 },
  { href: "/admin/reports", label: "Reports", icon: FileText },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children, role }: { children: React.ReactNode; role: "user" | "ngo" | "admin" }) {
  const pathname = usePathname();
  const nav = role === "ngo" ? NGO_NAV : role === "admin" ? ADMIN_NAV : USER_NAV;
  const roleLabel = role === "ngo" ? "NGO Console" : role === "admin" ? "Admin Console" : "My Dashboard";

  return (
    <div className="min-h-screen flex bg-secondary/30">
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-sidebar">
        <div className="p-5 border-b border-border">
          <Logo />
          <p className="mt-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">{roleLabel}</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active ? "text-primary bg-primary/10" : "text-foreground/70 hover:bg-muted hover:text-foreground"
                )}
              >
                {active && <motion.span layoutId="sidebar-active" className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-primary" />}
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition">
            <LogOut className="h-4 w-4" /> Back to site
          </Link>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border">
          <div className="flex h-16 items-center justify-between px-5">
            <div>
              <p className="font-display text-xl font-bold tracking-tight capitalize">{nav.find(n => n.href === pathname)?.label || "Dashboard"}</p>
              <p className="text-xs text-muted-foreground">Welcome back, hero 🐾</p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Avatar className="h-9 w-9"><AvatarImage src="https://i.pravatar.cc/80?img=15" /><AvatarFallback>R</AvatarFallback></Avatar>
            </div>
          </div>
        </header>
        <main className="flex-1 p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
