import Link from "next/link";
import { Logo } from "./Logo";
import { Github, Twitter, Instagram, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="container py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            ResQPaws is a 24/7 AI-powered rescue network connecting concerned citizens, NGOs and volunteers to save injured animals — fast.
          </p>
          <div className="mt-5 flex gap-3 text-muted-foreground">
            <Link href="#" className="hover:text-primary transition"><Twitter className="h-4 w-4" /></Link>
            <Link href="#" className="hover:text-primary transition"><Instagram className="h-4 w-4" /></Link>
            <Link href="#" className="hover:text-primary transition"><Github className="h-4 w-4" /></Link>
            <Link href="#" className="hover:text-primary transition"><Mail className="h-4 w-4" /></Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold mb-3">Platform</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/about" className="hover:text-foreground">About</Link></li>
            <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
            <li><Link href="/login" className="hover:text-foreground">Login</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold mb-3">For</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/login" className="hover:text-foreground">Citizens</Link></li>
            <li><Link href="/login" className="hover:text-foreground">NGO Partners</Link></li>
            <li><Link href="/login" className="hover:text-foreground">Volunteers</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} ResQPaws. Made with care for every paw.</p>
          <div className="flex gap-4"><Link href="#">Privacy</Link><Link href="#">Terms</Link></div>
        </div>
      </div>
    </footer>
  );
}
