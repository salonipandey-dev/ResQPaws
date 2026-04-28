"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, MapPin, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ReportPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const handle = (e: React.FormEvent) => { e.preventDefault(); toast.success("Report submitted successfully."); };

  return (
    <form onSubmit={handle} className="max-w-3xl space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="font-semibold">1. Photo of the animal</p>
        <p className="text-xs text-muted-foreground">Upload a clear image to help responders assess the case.</p>
        <label className="mt-4 flex items-center justify-center aspect-[16/9] rounded-2xl border-2 border-dashed border-border hover:border-primary/40 bg-muted/30 cursor-pointer relative overflow-hidden transition">
          {preview ? <img src={preview} className="absolute inset-0 w-full h-full object-cover" alt="preview" /> :
            <div className="text-center"><Upload className="h-8 w-8 mx-auto text-muted-foreground" /><p className="mt-2 text-sm font-medium">Click to upload or drag a photo</p><p className="text-xs text-muted-foreground">JPG, PNG up to 10MB</p></div>}
          <input type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) setPreview(URL.createObjectURL(f)); }} />
        </label>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <p className="font-semibold">2. Details</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><Label>Species</Label>
            <Select><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select species" /></SelectTrigger>
              <SelectContent>{["Dog", "Cat", "Cow", "Bird", "Other"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select></div>
          <div><Label>Severity</Label>
            <Select><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select severity" /></SelectTrigger>
              <SelectContent>{["Critical", "Serious", "Stable", "Minor"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select></div>
        </div>
        <div><Label>Location</Label><div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input className="pl-9 mt-1.5" placeholder="Enter or detect location" defaultValue="" /></div></div>
        <div><Label>Description</Label><Textarea className="mt-1.5 min-h-[100px]" placeholder="Describe what you observed and current condition..." /></div>
      </div>
      <div className="flex gap-3">
        <Button type="submit" className="rounded-full h-11 px-6 shadow-glow"><Camera className="h-4 w-4 mr-1" /> Submit Report</Button>
        <Button type="button" variant="outline" className="rounded-full h-11">Save Draft</Button>
      </div>
    </form>
  );
}
