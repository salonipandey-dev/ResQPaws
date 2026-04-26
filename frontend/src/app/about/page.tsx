import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="relative">
        <div className="absolute inset-0 -z-10 gradient-warm" />
        <div className="container py-20 md:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">Our story</span>
            <h1 className="mt-5 font-display text-5xl md:text-6xl font-extrabold tracking-tight text-balance">A faster, kinder world for every paw.</h1>
            <p className="mt-5 text-lg text-muted-foreground">
              ResQPaws was born after a 4 AM call about a hit-and-run pup that nobody could reach in time. We built the tech we wish existed that night — an AI rescue network that mobilises help in minutes, not hours.
            </p>
          </div>
        </div>
      </section>
      <section className="container py-16 grid md:grid-cols-3 gap-5">
        {[
          { t: "Mission", d: "To give every street animal a fighting chance through technology, community and compassion." },
          { t: "Vision", d: "A world where reporting an injured animal is as simple as ordering food — and just as fast." },
          { t: "Values", d: "Empathy, speed, transparency and respect for every life — human or animal." },
        ].map((b) => (
          <div key={b.t} className="rounded-2xl border border-border bg-card p-6 hover:shadow-card transition">
            <p className="text-primary text-xs uppercase font-bold tracking-wider">{b.t}</p>
            <p className="mt-3 text-foreground/90">{b.d}</p>
          </div>
        ))}
      </section>
      <section className="container pb-24">
        <h2 className="font-display text-3xl md:text-4xl font-bold">The team</h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { n: "Aanya Rao", r: "Co-founder & CEO", i: 5 },
            { n: "Karan Patel", r: "Co-founder & CTO", i: 12 },
            { n: "Dr. Riya Joshi", r: "Head of Vet Ops", i: 32 },
            { n: "Vikram Das", r: "Lead Designer", i: 51 },
          ].map(p => (
            <div key={p.n} className="rounded-2xl border border-border bg-card overflow-hidden group">
              <div className="aspect-square overflow-hidden">
                <img src={`https://i.pravatar.cc/400?img=${p.i}`} className="h-full w-full object-cover group-hover:scale-105 transition" alt={p.n} />
              </div>
              <div className="p-4">
                <p className="font-semibold">{p.n}</p>
                <p className="text-sm text-muted-foreground">{p.r}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
      <FloatingActions />
    </main>
  );
}
