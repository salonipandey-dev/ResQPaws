"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

export default function AdminReports() {
  const reports = [
    { id: "RPT-1001", type: "Spam", by: "@aanya", status: "Open" },
    { id: "RPT-1002", type: "Abuse", by: "@karan", status: "Resolved" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Moderation Reports</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>By</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {reports.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>{item.by}</TableCell>
              <TableCell>{item.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}