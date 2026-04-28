"use client";
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Siren, Plus, X } from "lucide-react";
import { Chatbot } from "@/features/chatbot/Chatbot";
import { EmergencyModal } from "@/features/emergency/EmergencyModal";
import { cn } from "@/lib/utils";

export function FloatingActions() {
  const [chatOpen, setChatOpen] = React.useState(false);
  const [emergencyOpen, setEmergencyOpen] = React.useState(false);
  const [mobileExpanded, setMobileExpanded] = React.useState(false);

  return (
    <>
      <div className="hidden sm:flex fixed bottom-6 right-6 z-40 flex-col gap-3">
        <FloatBtn
          onClick={() => setEmergencyOpen(true)}
          label="Emergency"
          tone="danger"
          icon={<Siren className="h-5 w-5" />}
          pulse
        />
        <FloatBtn
          onClick={() => setChatOpen(true)}
          label="Rescue Guide"
          tone="primary"
          icon={<MessageCircle className="h-5 w-5" />}
        />
      </div>

      <div className="sm:hidden fixed bottom-5 right-5 z-40">
        <AnimatePresence>
          {mobileExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mb-3 flex flex-col gap-3"
            >
              <FloatBtn onClick={() => { setEmergencyOpen(true); setMobileExpanded(false); }} label="Emergency" tone="danger" icon={<Siren className="h-5 w-5" />} small />
              <FloatBtn onClick={() => { setChatOpen(true); setMobileExpanded(false); }} label="Rescue Guide" tone="primary" icon={<MessageCircle className="h-5 w-5" />} small />
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setMobileExpanded((v) => !v)}
          aria-label="Quick actions"
          className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-glow grid place-items-center transition-transform active:scale-95"
        >
          {mobileExpanded ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
        </button>
      </div>

      <Chatbot open={chatOpen} onOpenChange={setChatOpen} />
      <EmergencyModal open={emergencyOpen} onOpenChange={setEmergencyOpen} />
    </>
  );
}

function FloatBtn({
  onClick, label, icon, tone, pulse, small,
}: { onClick: () => void; label: string; icon: React.ReactNode; tone: "primary" | "danger"; pulse?: boolean; small?: boolean }) {
  const styles = tone === "danger"
    ? "bg-destructive text-destructive-foreground"
    : "bg-primary text-primary-foreground";
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-2 rounded-full pl-3 pr-4 shadow-glow font-medium",
        styles,
        small ? "h-11 text-sm" : "h-12 text-sm"
      )}
    >
      <span className="relative grid h-8 w-8 place-items-center rounded-full bg-white/20">
        {icon}
        {pulse && <span className="absolute inset-0 rounded-full bg-white/40 animate-pulse-ring" />}
      </span>
      <span className="hidden md:inline whitespace-nowrap">{label}</span>
    </motion.button>
  );
}
