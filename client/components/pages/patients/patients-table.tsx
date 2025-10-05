'use client'

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import SearchInput from "@/components/ui/search-input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { CiFilter } from "react-icons/ci";
import { Patient } from "@/lib/types/patient";
import NewCaseBtn from "@/components/ui/new-case-btn";
import Link from "next/link";
import StatusBadge from "@/components/ui/status-badge";
import { differenceInYears, parse } from "date-fns";

export default function PatientsTable({ patients }: { patients: Patient[] }) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPatients = patients.filter((patient) =>
    Object.values(patient).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <div>
          <div className="flex gap-4">
            <SearchInput
              className="bg-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            ></SearchInput>

            <Button variant={"outline"} size={"lg"} className="bg-primary">
              <CiFilter strokeWidth={1.5} size={16} />
              Filter
            </Button>
          </div>
          <div>
          </div>
        </div>
        <NewCaseBtn></NewCaseBtn>
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
                    <div className="text-sm text-muted-foreground ">{patient.phone.match(/.{1,3}/g)?.join(" ") ?? ""}</div>
                  </div>
                </TableCell>
                <TableCell className="px-6">{differenceInYears(new Date(), parse(patient.date_of_birth, "dd.MM.yyyy", new Date()))}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{new Date(patient.last_visit).toLocaleDateString()}</TableCell>
                <TableCell>{StatusBadge(patient.status)}</TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border border-border">
                      <Link href={"/patients/" + patient.patient_id}>
                        <DropdownMenuItem className="gap-2">
                          <Eye className="h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                      </Link>
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