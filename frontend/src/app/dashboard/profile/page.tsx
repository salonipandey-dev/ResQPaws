"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { authApi, getApiErrorMessage } from "@/services/api";

export default function ProfilePage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", city: "", state: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    authApi.me().then(({ data }) => {
      setForm({
        name: data.user?.name || "",
        email: data.user?.email || "",
        phone: data.user?.phone || "",
        city: data.user?.city || "",
        state: data.user?.state || "",
      });
    }).catch((error) => {
      toast.error(getApiErrorMessage(error));
    });
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await authApi.updateMe({ name: form.name, phone: form.phone, city: form.city, state: form.state });
      toast.success("Profile updated");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="max-w-3xl space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6 flex items-center gap-5">
        <Avatar className="h-20 w-20"><AvatarFallback>{(form.name || "U").slice(0, 1).toUpperCase()}</AvatarFallback></Avatar>
        <div>
          <p className="font-semibold text-lg">Your Profile</p>
          <p className="text-sm text-muted-foreground">Update contact details used for rescue coordination.</p>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6 grid sm:grid-cols-2 gap-4">
        <div><Label>Full name</Label><Input className="mt-1.5" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Enter your full name" required /></div>
        <div><Label>Email</Label><Input className="mt-1.5" value={form.email} disabled /></div>
        <div><Label>Phone</Label><Input className="mt-1.5" value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} placeholder="Add contact number" /></div>
        <div><Label>City</Label><Input className="mt-1.5" value={form.city} onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))} placeholder="Add your city" /></div>
        <div><Label>State</Label><Input className="mt-1.5" value={form.state} onChange={(e) => setForm((prev) => ({ ...prev, state: e.target.value }))} placeholder="Add your state" /></div>
      </div>
      <Button disabled={saving} className="rounded-full h-11 px-6 shadow-glow">{saving ? "Saving..." : "Save changes"}</Button>
    </form>
  );
}
