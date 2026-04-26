"use client";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
export default function AdminSettings() {
  return (
    <form onSubmit={(e)=>{e.preventDefault(); toast.success("Settings saved");}} className="max-w-2xl space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4"><p className="font-semibold">Platform</p>
        <div><Label>Brand name</Label><Input defaultValue="ResQPaws" className="mt-1.5" /></div>
        <div><Label>Support email</Label><Input defaultValue="hello@resqpaws.com" className="mt-1.5" /></div>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4"><p className="font-semibold">Toggles</p>
        {["Auto-dispatch AI","Allow anonymous reports","Send WhatsApp alerts"].map(l => <div key={l} className="flex items-center justify-between"><Label>{l}</Label><Switch defaultChecked /></div>)}
      </div>
      <Button className="rounded-full h-11 px-6 shadow-glow">Save settings</Button>
    </form>
  );
}
