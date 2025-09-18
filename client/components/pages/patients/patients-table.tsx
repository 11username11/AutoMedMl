'use client'

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import SearchInput from "@/components/ui/search-input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { CiFilter } from "react-icons/ci";
import { Patient } from "@/lib/types/patient";
import { STATUS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import NewCase from "@/components/ui/new-case-btn";

const getStatusBadge = (status: Patient["status"]) => {
  const statusConfig: Record<typeof STATUS[number], { className: string }> = {
    "Active Treatment": { className: "bg-success text-accent-foreground" },
    "Recovered": { className: "bg-secondary text-accent-foreground" },
    "Deceased": { className: "bg-primary-foreground text-foreground" },
  };

  const config = statusConfig[status];
  return <Badge className={config?.className}>{status}</Badge>;
};

export default function PatientsTable({ patients }: { patients: Patient[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const filteredPatients = patients.filter((patient) =>
    Object.values(patient).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between">
        <div>
          <div className="flex gap-4">
            <SearchInput
              className="bg-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            ></SearchInput>
            <div className="flex justify-center items-center gap-1 text-sm bg-primary border rounded-md px-4 h-10 hover:bg-primary-foreground text-foreground cursor-pointer duration-200">
              <CiFilter strokeWidth={1.5} size={16} />
              Filter
            </div>
          </div>
          <div>
          </div>
        </div>
        <NewCase></NewCase>
      </div>

      <div className="rounded-lg border bg-primary overflow-hidden">
        <Table className="w-full ">
          <TableHeader>
            <TableRow className="secondary-foreground/50">
              <TableHead>Patient</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Last Visit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow key={patient.patient_id}>
                <TableCell>
                  <div className="flex items-center gap-3 my-1">
                    <div className="rounded-full text-accent-foreground shrink-0 flex items-center justify-center bg-secondary-foreground w-10 h-10">
                      {(patient.name[0] + patient.surname[0]).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium ">{patient.name} {patient.surname}</div>
                      <div className="text-sm text-muted-foreground ]">ID: {patient.patient_id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm ">{patient.email}</div>
                    <div className="text-sm text-muted-foreground ">{patient.phone}</div>
                  </div>
                </TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{new Date(patient.last_visit).toLocaleDateString()}</TableCell>
                <TableCell>{getStatusBadge(patient.status)}</TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border border-border">
                      <DropdownMenuItem className="gap-2">
                        <Eye className="h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <Edit className="h-4 w-4" />
                        Edit Patient
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-destructive">
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>

  )
}