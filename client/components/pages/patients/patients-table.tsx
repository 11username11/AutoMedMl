'use client'

import { Button } from "@/components/ui/button";
import SearchInput from "@/components/ui/search-input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { CiFilter } from "react-icons/ci";
import { Patient } from "@/lib/types/patient";
import NewCaseBtn from "@/components/ui/new-case-btn";
import PatientRow from "./patient/patient-row";

export default function PatientsTable({ patients }: { patients: Patient[] }) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPatients = patients.filter((patient) =>
    Object.values(patient).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between gap-4 flex-col md:flex-row">
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
        <NewCaseBtn ></NewCaseBtn>
      </div>

      <div className="rounded-lg border bg-primary overflow-hidden">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="secondary-foreground/50">
              <TableHead>Patient</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map((patient) => <PatientRow key={patient.patient_id} patient={patient}></PatientRow>)}
          </TableBody>
        </Table>
      </div>
    </div>

  )
}