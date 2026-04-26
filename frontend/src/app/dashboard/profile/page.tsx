"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ProfilePage() {
  return (
    <form onSubmit={(e) => { e.preventDefault(); toast.success("Profile updated"); }} className="max-w-3xl space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6 flex items-center gap-5">
        <Avatar className="h-20 w-20"><AvatarImage src="https://i.pravatar.cc/200?img=15" /><AvatarFallback>R</AvatarFallback></Avatar>
        <div>
          <p className="font-semibold text-lg">Riya Kapoor</p>
          <p className="text-sm text-muted-foreground">Volunteer • Mumbai</p>
          <Button type="button" size="sm" variant="outline" className="mt-2 rounded-full">Change photo</Button>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6 grid sm:grid-cols-2 gap-4">
        <div><Label>Full name</Label><Input className="mt-1.5" defaultValue="Riya Kapoor" /></div>
        <div><Label>Email</Label><Input className="mt-1.5" defaultValue="riya@email.com" /></div>
        <div><Label>Phone</Label><Input className="mt-1.5" defaultValue="+91 9876543210" /></div>
        <div><Label>City</Label><Input className="mt-1.5" defaultValue="Mumbai" /></div>
      </div>
      <Button className="rounded-full h-11 px-6 shadow-glow">Save changes</Button>
    </form>
  );
}
