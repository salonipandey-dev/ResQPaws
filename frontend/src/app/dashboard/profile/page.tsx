"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ProfilePage() {
  return (
    <form onSubmit={(e) => { e.preventDefault(); toast.success("Profile updated"); }} className="max-w-3xl space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6 flex items-center gap-5">
        <Avatar className="h-20 w-20"><AvatarFallback>U</AvatarFallback></Avatar>
        <div>
          <p className="font-semibold text-lg">Your Profile</p>
          <p className="text-sm text-muted-foreground">Update contact details used for rescue coordination.</p>
          <Button type="button" size="sm" variant="outline" className="mt-2 rounded-full">Upload photo</Button>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6 grid sm:grid-cols-2 gap-4">
        <div><Label>Full name</Label><Input className="mt-1.5" defaultValue="" placeholder="Enter your full name" /></div>
        <div><Label>Email</Label><Input className="mt-1.5" defaultValue="" placeholder="you@example.com" /></div>
        <div><Label>Phone</Label><Input className="mt-1.5" defaultValue="" placeholder="Add contact number" /></div>
        <div><Label>City</Label><Input className="mt-1.5" defaultValue="" placeholder="Add your city" /></div>
      </div>
      <Button className="rounded-full h-11 px-6 shadow-glow">Save changes</Button>
    </form>
  );
}
