import Link from "next/link";
import { Logo } from "./Logo";
import { Mail } from "lucide-react";
import { footerContent } from "@/data/content";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="container py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">{footerContent.blurb}</p>
          <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <a href={`mailto:${footerContent.contact}`} className="hover:text-primary transition">{footerContent.contact}</a>
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
          <p>Â© {new Date().getFullYear()} ResQPaws.</p>
          <div className="flex gap-4"><Link href="#">Privacy</Link><Link href="#">Terms</Link></div>
        </div>
      </div>
    </footer>
  );
}
