'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PawPrint, Menu, X, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/report', label: 'Report' },
    { href: '/track', label: 'Track' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/ngo', label: 'NGO' },
    { href: '/admin', label: 'Admin' }
  ];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 w-full transition-all ${
        scrolled
          ? 'backdrop-blur-xl bg-white/70 dark:bg-neutral-900/70 shadow-[0_8px_32px_rgba(255,122,0,0.08)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-5 md:px-8 h-16 md:h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ff7a00] to-[#ff9a2f] grid place-items-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
            <PawPrint className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">
            Res<span className="text-[#ff7a00]">Q</span>Paws
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                pathname === l.href
                  ? 'bg-[#ff7a00] text-white shadow-lg shadow-orange-500/30'
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-orange-50 dark:hover:bg-neutral-800'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDark(!dark)}
            className="w-10 h-10 rounded-full grid place-items-center bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:scale-110 transition"
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Link href="/login" className="hidden sm:block">
            <Button className="rounded-full bg-gradient-to-r from-[#ff7a00] to-[#ff9a2f] hover:opacity-90 text-white shadow-lg shadow-orange-500/30">
              Login
            </Button>
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden w-10 h-10 rounded-full grid place-items-center bg-white border border-neutral-200"
          >
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border-t border-neutral-200 dark:border-neutral-800"
          >
            <div className="px-5 py-4 flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium ${
                    pathname === l.href ? 'bg-[#ff7a00] text-white' : 'hover:bg-orange-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <Link href="/login" onClick={() => setOpen(false)}>
                <Button className="w-full mt-2 rounded-full bg-gradient-to-r from-[#ff7a00] to-[#ff9a2f] text-white">Login</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
