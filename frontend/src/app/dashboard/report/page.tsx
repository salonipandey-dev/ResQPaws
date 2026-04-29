"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Camera, Loader2, MapPin, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getApiErrorMessage, rescueApi } from "@/services/api";

type AiResult = {
  severity?: { severity?: string };
  duplicate?: { status?: string; confidence?: number };
  firstAid?: { urgency?: string; steps?: string[] };
};

export default function ReportPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [species, setSpecies] = useState("other");
  const [location, setLocation] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AiResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error("Please upload an image");
      return;
    }

    if (!lat || !lng) {
      toast.error("Latitude and longitude are required");
      return;
    }

    const payload = new FormData();
    payload.append("image", imageFile);
    payload.append("description", description);
    payload.append("animalType", species);
    payload.append("lat", lat);
    payload.append("lng", lng);

    try {
      setLoading(true);
      const { data } = await rescueApi.report(payload);
      setAiResult(data.ai || null);
      toast.success("Report submitted successfully");
      setDescription("");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="font-semibold">1. Photo of the animal</p>
        <p className="text-xs text-muted-foreground">Upload a clear image to help responders assess the case.</p>
        <label className="mt-4 flex items-center justify-center aspect-[16/9] rounded-2xl border-2 border-dashed border-border hover:border-primary/40 bg-muted/30 cursor-pointer relative overflow-hidden transition">
          {preview ? <img src={preview} className="absolute inset-0 w-full h-full object-cover" alt="preview" /> :
            <div className="text-center"><Upload className="h-8 w-8 mx-auto text-muted-foreground" /><p className="mt-2 text-sm font-medium">Click to upload or drag a photo</p><p className="text-xs text-muted-foreground">JPG, PNG up to 10MB</p></div>}
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setImageFile(file);
                setPreview(URL.createObjectURL(file));
              }
            }}
          />
        </label>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <p className="font-semibold">2. Details</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><Label>Species</Label>
            <Select value={species} onValueChange={setSpecies}><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select species" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dog">Dog</SelectItem>
                <SelectItem value="cat">Cat</SelectItem>
                <SelectItem value="cow">Cow</SelectItem>
                <SelectItem value="bird">Bird</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select></div>
          <div><Label>Location</Label><div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input className="pl-9 mt-1.5" placeholder="Address or landmark" value={location} onChange={(e) => setLocation(e.target.value)} /></div></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><Label>Latitude</Label><Input className="mt-1.5" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="e.g. 19.0760" required /></div>
          <div><Label>Longitude</Label><Input className="mt-1.5" value={lng} onChange={(e) => setLng(e.target.value)} placeholder="e.g. 72.8777" required /></div>
        </div>
        <div><Label>Description</Label><Textarea className="mt-1.5 min-h-[100px]" placeholder="Describe what you observed and current condition..." value={description} onChange={(e) => setDescription(e.target.value)} required minLength={10} /></div>
      </div>

      {aiResult && (
        <div className="rounded-2xl border border-border bg-card p-6 space-y-2">
          <p className="font-semibold flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-primary" /> AI Assessment</p>
          <p className="text-sm">Severity: <span className="font-semibold">{aiResult.severity?.severity || "Unknown"}</span></p>
          <p className="text-sm">Duplicate check: <span className="font-semibold">{aiResult.duplicate?.status || "Unknown"}</span></p>
          {Array.isArray(aiResult.firstAid?.steps) && aiResult.firstAid.steps.length > 0 && (
            <p className="text-sm text-muted-foreground">First aid: {aiResult.firstAid.steps.join(" ")}</p>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <Button disabled={loading} type="submit" className="rounded-full h-11 px-6 shadow-glow">
          {loading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Camera className="h-4 w-4 mr-1" />} Submit Report
        </Button>
      </div>
    </form>
  );
}
