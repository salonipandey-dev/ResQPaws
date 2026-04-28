"use client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  message: z.string().min(10, "Message is too short"),
});

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });
  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Message sent. We will get back soon.");
    reset();
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="container py-16 md:py-24">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">Get in touch</span>
          <h1 className="mt-4 font-display text-5xl md:text-6xl font-extrabold tracking-tight">We would love to hear from you.</h1>
          <p className="mt-4 text-muted-foreground text-lg">Questions, partnership ideas, or support requests are always welcome.</p>
        </div>
        <div className="mt-12 grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[
              { icon: Mail, t: "Email", v: "support@resqpaws.org" },
              { icon: Phone, t: "Support", v: "Available through verified partner channels" },
              { icon: MapPin, t: "Location", v: "Remote-first coordination network" },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary grid place-items-center"><c.icon className="h-5 w-5" /></div>
                <div>
                  <p className="text-xs text-muted-foreground">{c.t}</p>
                  <p className="font-semibold">{c.v}</p>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-3 rounded-2xl border border-border bg-card p-6 md:p-8 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input className="mt-1.5" placeholder="Your name" {...register("name")} />
                {errors.name && <p className="text-xs text-destructive mt-1">{String(errors.name.message)}</p>}
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input className="mt-1.5" placeholder="you@example.com" {...register("email")} />
                {errors.email && <p className="text-xs text-destructive mt-1">{String(errors.email.message)}</p>}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Message</label>
              <Textarea className="mt-1.5 min-h-[140px]" placeholder="Tell us how we can help..." {...register("message")} />
              {errors.message && <p className="text-xs text-destructive mt-1">{String(errors.message.message)}</p>}
            </div>
            <Button type="submit" disabled={isSubmitting} className="rounded-full h-11 px-6 shadow-glow">
              {isSubmitting ? "Sending..." : <>Send message <Send className="ml-1 h-4 w-4" /></>}
            </Button>
          </form>
        </div>
      </section>
      <Footer />
      <FloatingActions />
    </main>
  );
}
