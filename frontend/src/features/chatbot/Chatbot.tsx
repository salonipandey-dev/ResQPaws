"use client";
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

type Msg = { role: "user" | "bot"; text: string };

const PROMPTS = [
  "How do I report an injured stray?",
  "Nearest NGO around me?",
  "First aid for a bleeding paw?",
  "How does the karma reward work?",
];

export function Chatbot({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [msgs, setMsgs] = React.useState<Msg[]>([
    { role: "bot", text: "Hi, I’m Paw, your ResQPaws AI assistant 🐾 How can I help you today?" },
  ]);
  const [input, setInput] = React.useState("");
  const [typing, setTyping] = React.useState(false);
  const endRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMsgs((m) => [...m, { role: "bot", text: mockReply(text) }]);
      setTyping(false);
    }, 900 + Math.random() * 600);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 border-l flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-orange-200/30">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-orange-400 grid place-items-center text-white shadow-glow">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm flex items-center gap-1.5">Paw AI <Sparkles className="h-3 w-3 text-primary" /></p>
              <p className="text-xs text-muted-foreground">Online • typically replies instantly</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}><X className="h-4 w-4" /></Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-secondary/30">
          {msgs.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-card border border-border rounded-bl-sm"}`}>
                {m.text}
              </div>
            </motion.div>
          ))}
          <AnimatePresence>
            {typing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex">
                <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1">
                    {[0,1,2].map(i => (
                      <motion.span key={i} className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                        animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={endRef} />
        </div>

        {msgs.length <= 2 && (
          <div className="px-4 pt-2 pb-1 flex gap-2 flex-wrap">
            {PROMPTS.map(p => (
              <button key={p} onClick={() => send(p)} className="text-xs rounded-full border border-border bg-card px-3 py-1.5 hover:border-primary hover:text-primary transition">
                {p}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="p-3 border-t border-border bg-background flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message…"
            className="flex-1 rounded-full bg-muted px-4 text-sm outline-none focus:ring-2 ring-primary"
          />
          <Button type="submit" size="icon" className="rounded-full shadow-glow"><Send className="h-4 w-4" /></Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function mockReply(t: string) {
  const x = t.toLowerCase();
  if (x.includes("report")) return "To report an injured animal: tap “Report Animal Now” on the home page, upload a photo, and our AI will instantly tag location and severity.";
  if (x.includes("ngo") || x.includes("near")) return "I can locate the 3 nearest verified NGOs once you allow location access. Tap the Emergency button for instant dispatch.";
  if (x.includes("first aid") || x.includes("bleed")) return "Stay calm. Apply gentle pressure with a clean cloth, keep the animal warm, do NOT feed water. Tap Emergency for live vet guidance.";
  if (x.includes("karma") || x.includes("reward")) return "Every closed rescue earns Karma points. 100 points = a partner perk (pet stores, cafes, vet discounts). Track them in /dashboard/rewards.";
  return "Got it! I’ll connect you with a human responder if needed. Meanwhile, you can tap Emergency for immediate help.";
}
