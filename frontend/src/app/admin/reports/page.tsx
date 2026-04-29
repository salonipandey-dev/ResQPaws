'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

type ReportItem = {
  id: string
  type: string
  by: string
  status: string
}

const REPORTS: ReportItem[] = [
  { id: 'RPT-1001', type: 'Spam', by: '@aanya', status: 'Open' },
  { id: 'RPT-1002', type: 'Abuse', by: '@karan', status: 'Resolved' }
]

export default function AdminReports(): JSX.Element {
  return (
    <div className='p-6'>
      <h1 className='text-xl font-semibold mb-4'>Moderation Reports</h1>

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
          {REPORTS.map((item: ReportItem) => (
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
  )
}
