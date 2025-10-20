'use client'

import { Button } from "@/components/ui/button"
import SearchInput from "@/components/ui/search-input"
import { CiFilter } from "react-icons/ci"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FILTERS, useFilter } from "@/hooks/use-filter"
import { X } from "lucide-react"
import { useTranslations } from "next-intl"

export default function PatientsFilter() {
  const t = useTranslations("PatientsPage")

  const searchTerm = useFilter((state) => state.searchTerm)
  const setSearchTerm = useFilter((state) => state.setSearchTerm)

  const filters = useFilter((state) => state.filters)
  const setFilters = useFilter((state) => state.setFilters)

  const resetAll = useFilter((state) => state.resetAll)
  const resetFilters = useFilter((state) => state.resetFilters)

  return (
    <div className="flex gap-4 flex-col lg:flex-row">
      <SearchInput
        placeholder={"Search patients"}
        className="bg-primary w-full lg:w-auto max-w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="lg" className="bg-primary w-full lg:w-auto  data-[state=open]:border-ring">
            <CiFilter strokeWidth={1.5} size={16} />
            {t("buttons.filter")}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-80 p-4 space-y-4">
          <div className="flex justify-between items-center h-9">
            <div>
              {t("filterMenu.title")}
            </div>

            {Object.values(filters).some(value => value != undefined) && <Button onClick={resetFilters} variant={"ghost"} className="text-muted px-2"><X size={18}></X> {t("buttons.reset")}</Button>}
          </div>

          <div className="text-sm space-y-4">
            {FILTERS.map((filter) => (
              <div key={filter.key} className="space-y-2">
                <div>{t(`filterMenu.${filter.key}.label`)}</div>
                <Select
                  defaultValue={filters[filter.key] ?? filter.options[0]}
                  value={filters[filter.key] ?? filter.options[0]}
                  onValueChange={(value) =>
                    setFilters({ [filter.key]: value === filter.options[0] ? undefined : value })
                  }
                >
                  <SelectTrigger size="large" className="w-full cursor-pointer bg-primary">
                    <SelectValue>{t(`filterMenu.${filter.key}.${filters[filter.key] ?? filter.options[0]}`)}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {filter.options.map((option) => (
                        <SelectItem key={option} value={option}>
                          {t(`filterMenu.${filter.key}.${option}`)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

        </PopoverContent>
      </Popover>
      {[...Object.values(filters), searchTerm].some(value => !!value) && <Button onClick={resetAll} variant={"ghost"} size={"lg"} className="text-muted px-4"><X size={18}></X> Clear</Button>}
    </div >
  )
}