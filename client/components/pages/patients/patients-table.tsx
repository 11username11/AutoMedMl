'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useMemo, useRef } from "react"
import { Patient } from "@/lib/types/patient"
import NewCaseBtn from "@/components/ui/new-case-btn"
import PatientRow from "./patient-row"
import { useVirtualizer } from "@tanstack/react-virtual"
import { filterBySearch } from "@/lib/utils"
import { useFilter } from "@/hooks/use-filter"
import PatientsFilter from "./patients-filter"

export default function PatientsTable({ patients }: { patients: Patient[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const filters = useFilter((state) => state.filters)
  const searchTerm = useFilter((state) => state.searchTerm)

  const filteredPatients = useMemo(
    () => filterBySearch(patients, searchTerm, ["name", "surname", "email", "phone"], filters),
    [patients, searchTerm, filters]
  )

  const rowVirtualizer = useVirtualizer({
    count: filteredPatients.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 65,
    overscan: 10,
    initialRect: { height: 1200, width: 0 }
  })

  return (
    <div className="flex flex-col gap-4 w-full h-full overflow-hidden">
      <div className="flex justify-between gap-4 flex-col lg:flex-row">
        <PatientsFilter></PatientsFilter>
        <NewCaseBtn className=" w-full lg:w-auto" />
      </div>

      <div className="rounded-lg border bg-primary overflow-hidden">
        <Table containerRef={parentRef} className="w-full">
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
            className="[&_tr:nth-last-child(2)]:border-0"
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

            {filteredPatients.length === 0 && (
              <TableRow>
                <TableCell className="text-center py-8 text-muted text-base" colSpan={6}>
                  No patients found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
