import './globals.css';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'ResQPaws — Help Injured Animals Fast',
  description: 'Citizen-powered emergency rescue platform connecting reporters, NGOs and volunteers to save stray animals in minutes.',
  keywords: 'animal rescue, stray dog, NGO, emergency, ResQPaws, India',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased bg-[#fffaf7] dark:bg-neutral-950 text-[#1f1f1f] dark:text-neutral-100 overflow-x-hidden">
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-orange-200/30 dark:bg-orange-500/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-amber-200/30 dark:bg-amber-500/5 blur-3xl" />
        </div>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
