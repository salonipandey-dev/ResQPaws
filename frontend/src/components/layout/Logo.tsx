import Link from "next/link";
import { PawPrint } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-2 ${className}`}>
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-orange-400 text-primary-foreground shadow-glow">
        <PawPrint className="h-5 w-5" strokeWidth={2.5} />
      </span>
      <span className="font-display text-xl font-extrabold tracking-tight">
        Res<span className="text-primary">Q</span>Paws
      </span>
    </Link>
  );
}
