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
              ResQPaws was created to reduce delays in animal rescue reporting and coordination. We focus on clear reporting, trusted response networks, and transparent case progress.
            </p>
          </div>
        </div>
      </section>
      <section className="container py-16 grid md:grid-cols-3 gap-5">
        {[
          { t: "Mission", d: "Help street animals receive timely support through practical technology and local action." },
          { t: "Vision", d: "Make animal rescue reporting simple, dependable, and accessible to every community." },
          { t: "Values", d: "Empathy, accountability, clarity, and respect for every life." },
        ].map((b) => (
          <div key={b.t} className="rounded-2xl border border-border bg-card p-6 hover:shadow-card transition">
            <p className="text-primary text-xs uppercase font-bold tracking-wider">{b.t}</p>
            <p className="mt-3 text-foreground/90">{b.d}</p>
          </div>
        ))}
      </section>
      <section className="container pb-24">
        <h2 className="font-display text-3xl md:text-4xl font-bold">Our community</h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {["Community Member", "Volunteer", "NGO Coordinator", "Veterinary Partner"].map((role) => (
            <div key={role} className="rounded-2xl border border-border bg-card p-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary grid place-items-center font-semibold">R</div>
              <p className="mt-4 font-semibold">{role}</p>
              <p className="text-sm text-muted-foreground">Profiles are shown after verified onboarding.</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
      <FloatingActions />
    </main>
  );
}
