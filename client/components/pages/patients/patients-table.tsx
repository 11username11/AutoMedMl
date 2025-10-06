'use client'

import { Button } from "@/components/ui/button"
import SearchInput from "@/components/ui/search-input"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useMemo, useRef, useState } from "react"
import { CiFilter } from "react-icons/ci"
import { Patient } from "@/lib/types/patient"
import NewCaseBtn from "@/components/ui/new-case-btn"
import PatientRow from "./patient-row"
import { useVirtualizer } from "@tanstack/react-virtual"
import { filterBySearch } from "@/lib/utils"

export default function PatientsTable({ patients }: { patients: Patient[] }) {
  const parentRef = useRef<HTMLDivElement>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPatients = useMemo(
    () => filterBySearch(patients, searchTerm, ["name", "surname", "email", "phone"]),
    [patients, searchTerm]
  )

  const rowVirtualizer = useVirtualizer({
    count: filteredPatients.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64,
    overscan: 5,
  })

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between gap-4 flex-col md:flex-row">
        <div className="flex gap-4">
          <SearchInput
            className="bg-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="outline" size="lg" className="bg-primary">
            <CiFilter strokeWidth={1.5} size={16} />
            Filter
          </Button>
        </div>
        <NewCaseBtn />
      </div>

      <div className="rounded-lg border bg-primary overflow-hidden">
        <div ref={parentRef} className="max-h-[600px] overflow-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="secondary-foreground/50">
                <TableHead>Patient</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody
              style={{
                height: rowVirtualizer.getTotalSize(),
                position: "relative",
              }}
            >
              {rowVirtualizer.getVirtualItems().length > 0 && (
                <tr style={{ height: rowVirtualizer.getVirtualItems()[0].start }}>
                  <td colSpan={6} />
                </tr>
              )}
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const patient = filteredPatients[virtualRow.index]
                return (
                  <PatientRow key={patient.patient_id}
                    style={{ height: virtualRow.size }} patient={patient} />
                )
              })}
              {rowVirtualizer.getVirtualItems().length > 0 && (
                <tr
                  style={{
                    height:
                      rowVirtualizer.getTotalSize() -
                      rowVirtualizer.getVirtualItems().at(-1)!.end,
                  }}
                >
                  <td colSpan={6} />
                </tr>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
