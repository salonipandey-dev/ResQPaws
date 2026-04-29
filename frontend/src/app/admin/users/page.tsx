"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const U = [
  { n: "Community Member", r: "User", c: 0 },
  { n: "NGO Account", r: "NGO", c: 0 },
  { n: "Volunteer Account", r: "Volunteer", c: 0 },
  { n: "Admin Account", r: "Admin", c: 0 },
];

export default function AdminUsers() {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="p-5"><p className="font-semibold">All users</p></div>
      <Table>
        <TableHeader>
          <TableRow><TableHead>Name</TableHead><TableHead>Role</TableHead><TableHead>Cases</TableHead><TableHead>Status</TableHead></TableRow>
        </TableHeader>
        <TableBody>
          {U.map((u, i) => (
            <TableRow key={i}>
              <TableCell><span className="font-medium">{u.n}</span></TableCell>
              <TableCell><Badge variant="secondary" className="">{u.r}</Badge></TableCell>
              <TableCell>{u.c}</TableCell>
              <TableCell><span className="text-muted-foreground text-sm">Awaiting live data</span></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
