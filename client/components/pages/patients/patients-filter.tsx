'use client'

import { Button } from "@/components/ui/button"
import SearchInput from "@/components/ui/search-input"
import { CiFilter } from "react-icons/ci"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FILTERS, useFilter } from "@/hooks/use-filter"
import { GENDER, STATUS } from "@/lib/constants"
import { X } from "lucide-react"

export default function PatientsFilter() {
  const searchTerm = useFilter((state) => state.searchTerm)
  const setSearchTerm = useFilter((state) => state.setSearchTerm)

  const filters = useFilter((state) => state.filters)
  const setFilters = useFilter((state) => state.setFilters)

  const reset = useFilter((state) => state.reset)

  return (
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
          <div className="flex justify-between items-center h-9">
            <div>
              Filters
            </div>

            {Object.values(filters).some(value => value != undefined) && <Button onClick={reset} variant={"ghost"} className="text-muted px-2"><X size={18}></X> Clear</Button>}
          </div>

          <div className="text-sm space-y-4">
            {FILTERS.map((filter) => (
              <div className="space-y-2">
                <div>{filter.label}</div>
                <Select
                  defaultValue={filters[filter.key] ?? filter.options[0]}
                  value={filters[filter.key] ?? filter.options[0]}
                  onValueChange={(value) =>
                    setFilters({ [filter.key]: value === filter.options[0] ? undefined : value })
                  }
                >
                  <SelectTrigger size="large" className="w-full cursor-pointer bg-primary">
                    <SelectValue>{filters[filter.key] ?? filter.options[0]}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {filter.options.map((gender) => (
                        <SelectItem key={gender} value={gender}>
                          {gender}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

        </PopoverContent>
        {/* <PopoverContent align="start" className="w-80 p-4 space-y-4">
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
        </PopoverContent> */}
      </Popover>
      {Object.values(filters).some(value => value != undefined) && <Button onClick={reset} variant={"ghost"} size={"lg"} className="text-muted px-4"><X size={18}></X> Clear</Button>}
    </div >
  )
}