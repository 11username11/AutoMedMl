'use client'

import { Button } from "@/components/ui/button"
import SearchInput from "@/components/ui/search-input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useMemo, useRef, useState } from "react"
import { CiFilter } from "react-icons/ci"
import { Patient } from "@/lib/types/patient"
import NewCaseBtn from "@/components/ui/new-case-btn"
import PatientRow from "./patient-row"
import { useVirtualizer } from "@tanstack/react-virtual"
import { filterBySearch } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GENDER, STATUS } from "@/lib/constants"

export default function PatientsTable({ patients }: { patients: Patient[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const [selectedGender, setSelectedGender] = useState<string | undefined>()
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>()

  const [searchTerm, setSearchTerm] = useState("")

  const genderValues = ["All genders", ...GENDER]
  const statusValues = ["All statuses", ...STATUS]

  const filteredPatients = useMemo(
    () => filterBySearch(patients, searchTerm, ["name", "surname", "email", "phone"], {
      "gender": selectedGender,
      "status": selectedStatus
    }),
    [patients, searchTerm, selectedGender, selectedStatus]
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
        <div className="flex gap-4 flex-col lg:flex-row">
          <SearchInput
            className="bg-primary w-full lg:w-auto max-w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="lg" className="bg-primary w-full lg:w-auto  data-[state=open]:border-ring">
                <CiFilter strokeWidth={1.5} size={16} />
                Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-80 p-4 space-y-4">
              <div>
                Filters
              </div>

              <div className="text-sm space-y-4">
                <div className="space-y-2">
                  <div>Gender</div>
                  <Select
                    defaultValue={selectedGender ?? genderValues[0]}
                    onValueChange={(value) =>
                      setSelectedGender(value === genderValues[0] ? undefined : value)
                    }
                  >
                    <SelectTrigger size="large" className="w-full cursor-pointer bg-primary">
                      <SelectValue>{selectedGender ?? genderValues[0]}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {genderValues.map((gender) => (
                          <SelectItem key={gender} value={gender}>
                            {gender}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div>Status</div>
                  <Select
                    defaultValue={selectedStatus ?? statusValues[0]}
                    onValueChange={(value) =>
                      setSelectedStatus(value === statusValues[0] ? undefined : value)
                    }
                  >
                    <SelectTrigger size="large" className="w-full cursor-pointer bg-primary">
                      <SelectValue>{selectedStatus ?? statusValues[0]}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {statusValues.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
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
