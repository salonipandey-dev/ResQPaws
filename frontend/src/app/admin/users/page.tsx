"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const U = Array.from({length:8}).map((_,i)=>({ n: ["Aanya R.","Karan P.","Riya J.","Vikram D.","Mira S.","Sahil M.","Nikhil T.","Priya K."][i], r: ["User","NGO","Volunteer","Admin"][i%4], c: 30+i*5, i: i+10 }));
export default function AdminUsers() {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="p-5"><p className="font-semibold">All users</p></div>
      <Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Role</TableHead><TableHead>Cases</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
        <TableBody>{U.map((u,i)=>(
          <TableRow key={i}><TableCell className="flex items-center gap-2"><Avatar className="h-7 w-7"><AvatarImage src={`https://i.pravatar.cc/60?img=${u.i}`} /><AvatarFallback>U</AvatarFallback></Avatar><span className="font-medium">{u.n}</span></TableCell><TableCell><Badge variant="secondary">{u.r}</Badge></TableCell><TableCell>{u.c}</TableCell><TableCell><span className="text-emerald-600 text-sm">Active</span></TableCell></TableRow>
        ))}</TableBody>
      </Table>
    </div>
  );
}
